import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  Linking,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import database from "@react-native-firebase/database";
import Geolocation from "react-native-geolocation-service";
import Mapstyle from "./assets/MapStyle.json";
import {
  DEV_HEIGHT,
  DEV_WIDTH,
  IS_IOS,
} from "../../constants/Device/DeviceDetails";
import IconRight from "react-native-vector-icons/Feather";
import { Colors } from "../../constants/colors/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import IconCall from "react-native-vector-icons/Ionicons";
import IconCareer from "react-native-vector-icons/MaterialCommunityIcons";
import RNPickerSelect from "react-native-picker-select";
import IconDown from "react-native-vector-icons/dist/Entypo";
import KharbanButton from "../../components/KharbanButton";
import { standardPostApi } from "../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationActions, StackActions } from "react-navigation";
import Spinnner from "../../components/Spinner";
import validate from "../../components/Validations/validate_wrapper";
import IconCancel from "react-native-vector-icons/Entypo";
import { Toaster } from "../../components/Toaster";

const KEYBOARD_VIEW = Platform.OS === "ios" ? KeyboardAvoidingView : View;

function CompleteJobDiv(props) {
  return (
    <View style={[styles.jobRequest, { height: DEV_HEIGHT / 2 }]}>
      <ScrollView>
        <View style={{ marginTop: "5%" }}>
          <TouchableOpacity
            onPress={props.onCancel}
            style={{ paddingHorizontal: 15 }}
          >
            <IconCancel
              name="circle-with-cross"
              size={27}
              color={Colors.RED_COLOR}
            />
          </TouchableOpacity>
          <Image
            source={props.userimg}
            style={{
              width: 125,
              height: 125,
              alignSelf: "center",
              borderRadius: 63,
            }}
          />
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 19, lineHeight: 42, fontWeight: "bold" }}>
            {props.username}
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 28,
              color: Colors.GREY_COLOR,
              opacity: 0.6,
            }}
          >
            {props.contactno}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.distance}>Distance</Text>
            <Text style={styles.desc}>{props.distance}</Text>
          </View>
          <View>
            <View style={styles.hr}></View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.distance}>Time</Text>
            <Text style={styles.desc}>{props.time}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 40,
          }}
        >
          <TouchableOpacity onPress={props.onNext}>
            <View style={styles.buttons}>
              <Text style={styles.buttonText}>Complete Job</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.call}>
            <View
              style={[
                styles.buttons,
                {
                  backgroundColor: "#60D063",
                  shadowColor: "rgb(96,208,99)",
                  flexDirection: "row",
                },
              ]}
            >
              <IconCall
                style={{ marginRight: 5 }}
                name="call-outline"
                size={20}
                color={Colors.WHITE_COLOR}
              />
              <Text style={styles.buttonText}>Call</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

var databaseRef = "";
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.5955;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = "AIzaSyDfujfLdGzG-pWG0VGe4agzS80EKAhP4gU";

export default class CompleteJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inProgress: true,
      isReceiptCreate: false,
      job_status: "",
      mobile_no: "",
      booking_details: null,
      price: "",
      job_description: "",
      coordinates: [],
      fixerUserID: "",
      distance: 0,
      time: 0,
      latitude: 0,
      longitude: 0,
      fetchingReceiptResponse: false,
      priceError: "",
      jobStatusError: "",
      authenticating: false,
    };
  }

  componentDidMount() {
    const sub = this.props.navigation.addListener(
      "willFocus",
      async (payload) => {
        const { navigation } = this.props;
        const DATA = navigation.dangerouslyGetParent().state.routes[0].params
          .data;
        const Service = DATA.service;
        const customer_DATA = DATA.customer_details;

        if (Service.booking_status == 5) {
          this.setState({
            isReceiptCreate: true,
            fetchingReceiptResponse: true,
          });
        }
        if (customer_DATA.country_code) {
          this.setState({
            mobile_no: customer_DATA.country_code + customer_DATA.contact_no,
          });
        } else {
          this.setState({ mobile_no: customer_DATA.contact_no });
        }
        this.setState({ booking_details: Service });
        console.log("Data ==> ", DATA.coordinates);

        this.setState(
          {
            coordinates: DATA.coordinates ? DATA.coordinates : [],
            fixerUserID: DATA.fixerID ? DATA.fixerID : "",
          },
          () => {
            console.log("fixer userid", this.state.fixerUserID);
            this.getLocation();
            setTimeout(() => {
              this.map.fitToSuppliedMarkers(["mk1", "mk2"], {
                animated: true,
                edgePadding: {
                  top: 150,
                  right: 150,
                  bottom: 500,
                  left: 150,
                },
              });
            }, 1000);
          }
        );
      }
    );
    this.requestPermissions();
  }

  getCurrentLocation = async () => {
    await Geolocation.getCurrentPosition(
      async (position) => {
        console.log("from get Current location", position);
        await this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error.message.toString());
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 30000,
        // maximumAge: 0,
      }
    );
  };

  async requestPermissions() {
    console.log("from request permissions****");
    if (IS_IOS) {
      const openSetting = () => {
        Linking.openSettings().catch(() => {
          Alert.alert("Unable to open settings");
        });
      };
      const status = await Geolocation.requestAuthorization("whenInUse");
      console.log("permission status", status);
      if (status === "granted") {
        await this.getCurrentLocation();
      }
      if (status === "denied") {
        Alert.alert(
          "Allow Kharban to use your location to see nearby booking requests.",
          "",
          [
            { text: "Go to Settings", onPress: openSetting },
            { text: "Don't use Loaction", onPress: () => {} },
          ]
        );
      }
      if (status === "disabled") {
        Alert.alert(
          "Turn on Location Services to allow to determine your location.",
          "",
          [
            { text: "Go to Settings", onPress: openSetting },
            { text: "Don't use Loaction", onPress: () => {} },
          ]
        );
      }
    } else {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (hasPermission) {
        this.getCurrentLocation();
      } else {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
          this.getCurrentLocation();
        }
        if (status === PermissionsAndroid.RESULTS.DENIED) {
          ToastAndroid.show(
            "Allow Kharban to use your location to see nearby booking requests.",
            ToastAndroid.LONG
          );
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          ToastAndroid.show(
            "Location permission revoked by user.",
            ToastAndroid.LONG
          );
        }
      }
    }
  }

  getLocation = () => {
    console.log("from get location");
    databaseRef = database().ref("/" + this.state.fixerUserID);
    console.log("databaseRef==", databaseRef);

    databaseRef.once("value").then((snapshot) => {
      console.log("User data: ", snapshot.val());
      if (snapshot.val() && snapshot.val().lat) {
      } else {
        databaseRef.set({
          lat:
            this.state.coordinates[0] && this.state.coordinates[0].latitude
              ? this.state.coordinates[0].latitude
              : this.state.latitude,
          lng:
            this.state.coordinates[0] && this.state.coordinates[0].longitude
              ? this.state.coordinates[0].longitude
              : this.state.longitude,
        });
        // .then(() => console.log("Data set."));
      }
    });

    //trigger when change in value
    databaseRef.on("value", (snapshot) => {
      // console.log("snapshot", snapshot);
      const { navigation } = this.props;
      const DATA = navigation.getParam("data");
      let cords = [...this.state.coordinates];
      if (snapshot.val() && snapshot.val().lat) {
        cords.shift();
        cords.unshift({
          latitude: snapshot.val().lat,
          longitude: snapshot.val().lng,
        });
      }

      this.setState({
        coordinates: cords,
      });

      this.watchID = Geolocation.watchPosition((lastPosition) => {
        console.log(lastPosition);
        this.setState({ lastPosition });
        this.onLocation(lastPosition);
      });
    });
  };

  onLocation = (location) => {
    // console.log("location==", location);
    let cord = [...this.state.coordinates];
    cord.shift();
    if (location && location.coords) {
      cord.unshift({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      databaseRef.set({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      // .then(() => console.log("Data set."));
    }
  };

  componentWillUnmount() {
    Geolocation.stopObserving();
    Geolocation.clearWatch(this.state.lastPosition);
  }

  goBack() {
    const { navigation } = this.props;
    if (this.state.isReceiptCreate) {
      this.setState({ inProgress: true, isReceiptCreate: false });
    } else {
      navigation.goBack();
    }
  }

  componentWillUnmount() {
    this.setState({ authenticating: false });
  }
  createReceipt = async () => {
    const { job_status, price, desc, booking_details } = this.state;

    const jobStatusError = validate("job_status", job_status);
    const priceError = validate("price", price);

    this.setState({
      jobStatusError: jobStatusError,
      priceError: priceError,
    });

    if (jobStatusError || priceError) {
      alert("Please fill all required fields");
    } else {
      const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
      try {
        this.setState({ authenticating: true });
        const res = await standardPostApi(
          "generateReceipt",
          { Authorization: "Bearer " + TOKEN },
          {
            booking_id: booking_details.booking_id,
            receipt_amount: price,
            provider_receipt_description: desc,
          },
          true,
          false
        );
        console.log("getReceipt ", res);
        if (res.data.status == 200) {
          this.setState({ fetchingReceiptResponse: true });
        } else {
          alert("Receipt can not be generated at this moment!!");
        }
      } catch (error) {
        console.log("ERRR" + error);
      }
      this.setState({ authenticating: false });
    }
  };

  cancelJob = async (Service, job_status) => {
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      const res = await standardPostApi(
        "jobAcceptDecline",
        { Authorization: "Bearer " + TOKEN },
        {
          id: Service.id,
          booking_id: Service.booking_id,
          provider_status: job_status,
        },
        true,
        false
      );
      if (res.data.status == 200) {
        Toaster(
          "You have successfully cancelled this booking.",
          Colors.LIGHT_GREEN
        );
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Home",
              }),
            ],
          })
        );
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
  };

  render() {
    const { navigation } = this.props;
    const Service = navigation.dangerouslyGetParent().state.routes[0].params
      .data.service;
    const customer_details = navigation.dangerouslyGetParent().state.routes[0]
      .params.data.customer_details;

    console.log("customer details ", customer_details);

    const {
      isReceiptCreate,
      inProgress,
      mobile_no,
      fetchingReceiptResponse,
    } = this.state;

    return (
      <KEYBOARD_VIEW
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
        }}
        behavior="padding"
      >
        <View style={{ flex: 1 }}>
          <Spinnner
            loaderTxt={"Waiting for Response from customer"}
            visible={fetchingReceiptResponse}
          />
          <MapView
            ref={(map) => {
              this.map = map;
            }}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            customMapStyle={Mapstyle}
            loadingEnabled={true}
            initialRegion={{
              latitude:
                this.state.coordinates[0] && this.state.coordinates[0].latitude
                  ? this.state.coordinates[0].latitude
                  : this.state.latitude,
              longitude:
                this.state.coordinates[0] && this.state.coordinates[0].longitude
                  ? this.state.coordinates[0].longitude
                  : this.state.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            zoomEnabled
            mapType="standard"
          >
            {this.state.coordinates.map((coordinate, index) => {
              if (index == 0) {
                return (
                  <Marker
                    identifier={"mk1"}
                    key={`coordinate_${index}`}
                    coordinate={coordinate}
                  >
                    <View style={styles.outMostCircle}>
                      <View style={styles.innerCircle}>
                        <View style={styles.innerMostCircle} />
                      </View>
                    </View>
                  </Marker>
                );
              }
              if (index == 1) {
                return (
                  <Marker coordinate={coordinate} identifier={"mk2"}>
                    <View style={styles.servicelogo}>
                      <Image
                        resizeMode="contain"
                        style={{ width: 35, height: 35 }}
                        source={{ uri: Service.service_image }}
                      ></Image>
                    </View>
                  </Marker>
                );
              }
            })}

            {this.state.coordinates.length >= 2 && (
              <MapViewDirections
                origin={this.state.coordinates[0]}
                destination={
                  this.state.coordinates[this.state.coordinates.length - 1]
                }
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={3}
                strokeColor="#FFD800"
                waypoints={this.state.coordinates}
                // optimizeWaypoints={true}
                resetOnChange={false}
                onStart={(params) => {}}
                onReady={(result) => {
                  `onReady result ==> : ${result} km`;
                  console.log("origin==", this.state.coordinates[0]);
                  console.log(
                    "dest==",
                    this.state.coordinates[this.state.coordinates.length - 1]
                  );
                  this.setState({
                    distance: result.distance,
                    time: result.duration,
                  });
                  this.map.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: DEV_WIDTH / 20,
                      bottom: DEV_HEIGHT / 20,
                      left: DEV_WIDTH / 20,
                      top: DEV_WIDTH / 20,
                    },
                  });
                }}
                onError={(errorMessage) => {
                  console.log("GOT AN ERROR ==> ", errorMessage);
                }}
              />
            )}
          </MapView>

          <SafeAreaView style={{ position: "absolute" }}>
            <TouchableOpacity
              style={{ paddingTop: "10%", paddingHorizontal: "12%" }}
              onPress={() => this.props.navigation.navigate("MenuScreen")}
            >
              <Image
                source={require("../../components/img/side_menu.png")}
                style={{ height: 20, width: 27 }}
              />
            </TouchableOpacity>
          </SafeAreaView>
          {inProgress && (
            <CompleteJobDiv
              userimg={
                customer_details.profile_picture &&
                customer_details.profile_picture.length > 0
                  ? { uri: customer_details.profile_picture }
                  : require("./assets/img/user_dummy.jpg")
              }
              username={
                customer_details.first_name + " " + customer_details.last_name
              }
              contactno={this.state.mobile_no}
              distance={`${Math.ceil(this.state.distance)} km`}
              time={`${Math.ceil(this.state.time)} min`}
              onNext={() => {
                this.setState(
                  {
                    inProgress: false,
                    isReceiptCreate: true,
                  },
                  () => {
                    databaseRef.remove();
                  }
                );
              }}
              onCancel={() => {
                Alert.alert(
                  "Are you sure, you want to cancel this Booking?",
                  "You will be charged a penalty for cancelling this job if you cancel it outside the allowed time.",
                  [
                    { text: "Don't Cancel" },
                    {
                      text: "Yes, Cancel",
                      onPress: () => this.cancelJob(Service, "2"),
                    },
                  ]
                );
              }}
              call={() =>
                Linking.canOpenURL(`tel:${mobile_no}`).then((supported) => {
                  if (!supported) {
                    console.log(Error);
                  } else {
                    return Linking.openURL(
                      IS_IOS ? `telprompt:${mobile_no}` : `tel:${mobile_no}`
                    );
                  }
                })
              }
            />
          )}
          {isReceiptCreate &&
            (Service.booking_status == 5 ||
              Service.booking_status == 0 ||
              Service.booking_status == 3) && (
              <View
                style={[styles.jobRequest, { height: (3 * DEV_HEIGHT) / 4.2 }]}
              >
                <ScrollView>
                  <View style={{ marginTop: "8%" }}>
                    <Image
                      source={require("./assets/img/Recipt.png")}
                      resizeMode="contain"
                      style={{ width: 100, height: 100, alignSelf: "center" }}
                    />
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 22,
                        lineHeight: 32,
                        fontWeight: "bold",
                      }}
                    >
                      Create Receipt
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 28,
                        color: Colors.GREY_COLOR,
                        opacity: 0.6,
                      }}
                    >
                      enter your price and change the status
                    </Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <IconCareer
                      name="briefcase-variant-outline"
                      color="#000"
                      size={20}
                    />
                    <View style={[styles.selectInput]}>
                      <RNPickerSelect
                        onValueChange={(value) => {
                          this.setState({
                            job_status: value,
                            jobStatusError: validate("job_status", value),
                          });
                        }}
                        items={[
                          { id: 1, label: "Job Complete", value: "completed" },
                        ]}
                        value={this.state.job_status}
                        Icon={() => {
                          return (
                            <View style={{ marginTop: 10 }}>
                              <IconDown
                                style={styles.chevron}
                                name="chevron-down"
                                size={20}
                              />
                            </View>
                          );
                        }}
                        style={{
                          inputIOS: {
                            color: "#000",
                            marginTop: 12,
                          },
                          inputAndroid: {
                            color: "#000",
                          },
                        }}
                        placeholder={{
                          label: "Job Status",
                          color: Colors.GREY_COLOR,
                        }}
                      />
                    </View>
                  </View>
                  {this.state.jobStatusError.length > 0 && (
                    <View>
                      <Text style={{ color: "red", marginHorizontal: 20 }}>
                        {this.state.jobStatusError}
                      </Text>
                    </View>
                  )}
                  <View style={styles.inputContainer}>
                    <Image
                      source={require("./assets/img/price.png")}
                      style={styles.iconStyle}
                    />
                    <TextInput
                      onChangeText={(text) =>
                        this.setState({
                          price: text,
                          priceError: validate("price", text),
                        })
                      }
                      selectionColor={Colors.PLACEHOLDER_COLOR}
                      keyboardType="numeric"
                      placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                      color={Colors.PLACEHOLDER_COLOR}
                      placeholder="Enter Your Price"
                      style={styles.selectInput}
                    />
                  </View>
                  {this.state.priceError.length > 0 && (
                    <View style={{ paddingHorizontal: "10%" }}>
                      <Text style={{ color: "red", marginHorizontal: -15 }}>
                        {this.state.priceError}
                      </Text>
                    </View>
                  )}
                  <View style={styles.textAreaContainer}>
                    <Text
                      style={{
                        color: Colors.PLACEHOLDER_COLOR,
                        // opacity: 0.6,
                        fontSize: 9,
                      }}
                    >
                      Optional
                    </Text>
                    <TextInput
                      onChangeText={(text) => this.setState({ desc: text })}
                      style={styles.textArea}
                      maxLength={200}
                      placeholder="Description (Max 200 Characters)"
                      selectionColor={Colors.PLACEHOLDER_COLOR}
                      placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                      numberOfLines={10}
                      multiline={true}
                    />
                  </View>
                  <KharbanButton
                    buttonProps={{
                      style: {
                        width: DEV_WIDTH / 1.2,
                        marginVertical: 35,
                        alignSelf: "center",
                        backgroundColor: Colors.YELLOW_COLOR,
                      },
                      onPress: () => {
                        this.createReceipt();
                      },
                    }}
                    buttonText="Create Receipt"
                    buttonTextProps={{
                      style: {
                        fontSize: 13,
                        color: Colors.BLACK_COLOR,
                        fontWeight: "bold",
                      },
                    }}
                    loading={this.state.authenticating}
                  />
                </ScrollView>
              </View>
            )}
        </View>
      </KEYBOARD_VIEW>
    );
  }
}
const styles = StyleSheet.create({
  map: {
    height: (2 * DEV_HEIGHT) / 4,
  },
  jobRequest: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%",
    backgroundColor: Colors.WHITE_COLOR,

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: "#EDEDEB",
  },
  mainDiv: {
    flexDirection: "row",
    borderColor: "#EDEDEB",
    borderWidth: 1,
    marginHorizontal: "7%",
    borderRadius: 10,
    padding: 14,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "rgb(126,131,141)",
    shadowOpacity: 0.18,
    shadowRadius: 2,
    shadowOffset: {
      height: 3,
      width: 0,
    },
    // elevation: 10,
    backgroundColor: "white",
  },
  servicelogo: {
    width: 47,
    height: 47,
    borderRadius: 50,
    borderColor: Colors.YELLOW_COLOR,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "3%",
  },
  outMostCircle: {
    backgroundColor: "rgba(255,216,0,0.3)",
    height: 75,
    width: 75,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    backgroundColor: "rgba(255,216,0,0.4)",
    height: 51,
    width: 51,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  innerMostCircle: {
    backgroundColor: "#fff",
    height: 12,
    width: 12,
    borderRadius: 6,
  },
  distance: {
    fontSize: 12,
    color: Colors.OFF_WHITE,
  },
  desc: {
    fontSize: 15,
    color: Colors.BLACK_COLOR,
    marginTop: 10,
  },
  hr: {
    borderColor: "#EDEDEB",
    borderWidth: 1,
    height: 45,
  },
  buttons: {
    backgroundColor: Colors.BLACK_COLOR,
    borderRadius: 10,
    width: 158,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgb(5,5,3)",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 3,
      width: 0,
    },
    // elevation: 10,
  },
  buttonText: {
    color: Colors.WHITE_COLOR,
    fontWeight: "bold",
    fontSize: 14,
    // textAlign: "center",
  },
  selectInput: {
    borderBottomWidth: 2,
    borderColor: "#E3E6EB",
    borderBottomColor: "#E3E6EB",
    height: 45,
    width: "96%",
    marginLeft: -15,
    marginRight: -15,
    paddingLeft: 25,
    paddingRight: 25,
    textAlign: "left",
    color: Colors.BLACK_COLOR,
  },

  chevron: {
    color: Colors.PLACEHOLDER_COLOR,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "8%",
    marginTop: 25,
  },
  iconStyle: {
    height: 18,
    width: 12,
    resizeMode: "contain",
  },
  textAreaContainer: {
    borderBottomWidth: 2,
    borderColor: "#E3E6EB",
    borderBottomColor: "#E3E6EB",
    padding: 5,
    marginLeft: "8%",
    width: "80%",
    marginTop: 25,
  },
  textArea: {
    height: 100,
    justifyContent: "flex-start",
  },
});
