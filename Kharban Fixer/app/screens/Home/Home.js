import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Linking,
  PermissionsAndroid,
  ToastAndroid,
} from "react-native";
import IconDown from "react-native-vector-icons/FontAwesome";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import AsyncStorage from "@react-native-community/async-storage";
import { standardPostApi } from "../../api/ApiWrapper";
import Geolocation from "react-native-geolocation-service";
import Mapstyle from "./assets/MapStyle.json";
import { DEV_HEIGHT, IS_IOS } from "../../constants/Device/DeviceDetails";
import IconRight from "react-native-vector-icons/Feather";
import { Colors } from "../../constants/colors/Colors";
import { NavigationActions, StackActions } from "react-navigation";
import moment from "moment";
var reference = "";

function RecommBox(props) {
  return (
    <TouchableOpacity onPress={props.onServicePress}>
      <View style={styles.mainDiv}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={styles.servicelogo}>
            <Image
              style={{ width: 35, height: 35 }}
              resizeMode="contain"
              source={{ uri: props.logo }}
            />
          </View>
          <View style={{ flexDirection: "column", marginHorizontal: "4%" }}>
            <Text
              style={{
                fontSize: 13,

                color: Colors.BLACK_COLOR,
                fontWeight: "bold",
              }}
            >
              {props.serviceName}
            </Text>
            <Text
              style={{
                fontSize: 11,
                lineHeight: 12,
                color: "rgba(126,131,141,0.5)",
                opacity: 0.7,
                marginTop: 5.5,
              }}
            >
              {props.serviceTime}
            </Text>
          </View>
        </View>
        <IconRight
          name={"chevron-right"}
          size={20}
          color={Colors.PLACEHOLDER_COLOR}
        />
      </View>
    </TouchableOpacity>
  );
}

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      coordinates: [],
      recommended_requests: [],
      active_requests: null,
      fixerUserID: "",
    };
  }

  updateCurrentLocation = async () => {
    // console.log(this.state.latitude);
    // console.log(this.state.longitude);
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      const res = await standardPostApi(
        "updateProviderLocation",
        { Authorization: "Bearer " + TOKEN },
        {
          latitude: this.state.latitude.toString(),
          longitude: this.state.longitude.toString(),
        },
        true,
        false
      );
      // console.log("saveBookingRequest ", res);
      if (res.data.status == 200) {
        // this.getBookingRequests();
        this.getActiveBookingRequests();
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
  };

  getBookingRequests = async () => {
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      const res = await standardPostApi(
        "getJobRequest",
        { Authorization: "Bearer " + TOKEN },
        {},
        true,
        false
      );
      if (res.data.status == 200) {
        const Booking_Requests = res.data.result;
        this.setState({ recommended_requests: Booking_Requests });
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
  };

  getActiveBookingRequests = async () => {
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      const res = await standardPostApi(
        "getActiveProviderBooking",
        { Authorization: "Bearer " + TOKEN },
        {},
        true,
        false
      );
      console.log("getActiveBooking ", res);
      if (res.data.status == 200) {
        const TYPE = typeof res.data.result;
        if (TYPE == "object" && res.data.result != null) {
          const Active_Requests = res.data.result;
          this.setState({
            active_requests: Active_Requests,
            fixerUserID: Active_Requests.provider_id,
          });
        } else {
          this.getBookingRequests();
        }
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
  };

  getCurrentLocation = async () => {
    await Geolocation.getCurrentPosition(
      async (position) => {
        await this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        this.updateCurrentLocation();
      },
      (error) => {
        console.log(error.message.toString());
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  refreshFunc = async () => {
    this.getCurrentLocation();
  };
  componentDidMount() {
    const sub = this.props.navigation.addListener("willFocus", (payload) => {
      this.requestPermissions();
    });
  }

  changeDate(date) {
    let dateTime = new Date(date).toUTCString();
    // console.log(dateTime);
    // return moment.utc(date).utcOffset("-02:30").format("YYYY/MM/DD hh:mm A");
    // return moment(date).format("MMMM");

    return moment(dateTime).local().format("YYYY/MM/DD hh:mm A");
  }

  async requestPermissions() {
    if (IS_IOS) {
      const openSetting = () => {
        Linking.openSettings().catch(() => {
          Alert.alert("Unable to open settings");
        });
      };
      const status = await Geolocation.requestAuthorization("whenInUse");
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

  render() {
    const { recommended_requests } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <MapView
          ref={(map) => {
            this.map = map;
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={Mapstyle}
          // showsUserLocation={true}
          loadingEnabled={true}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.01,
          }}
          // zoom={25}
          zoomEnabled
          mapType="standard"
        >
          <Marker
            coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
            }}
          >
            <View style={styles.outMostCircle}>
              <View style={styles.innerCircle}>
                <View style={styles.innerMostCircle} />
              </View>
            </View>
          </Marker>
        </MapView>
        {/* <View style={{ flex: 1, justifyContent: "space-between" }}> */}
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
        <View style={[styles.locateMeContainer]}>
          <TouchableOpacity
            onPress={() =>
              this.map.animateToCoordinate({
                latitude: this.state.latitude,
                longitude: this.state.longitude,
              })
            }
            style={styles.locateBtn}
          >
            <Image
              style={styles.locateImg}
              source={require("./assets/img/locate.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.jobRequest}>
          <View
            style={{
              paddingHorizontal: "7%",
              marginTop: "5%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {this.state.active_requests ? (
              <Text
                style={{ fontSize: 19, lineHeight: 42, fontWeight: "bold" }}
              >
                Active Requests
              </Text>
            ) : (
              <Text
                style={{ fontSize: 19, lineHeight: 42, fontWeight: "bold" }}
              >
                Recommended For You
              </Text>
            )}
            <IconDown name={"chevron-down"} size={20} />
          </View>
          <ScrollView style={{ marginBottom: 30 }}>
            {this.state.active_requests == null ? (
              recommended_requests && recommended_requests.length > 0 ? (
                recommended_requests.map((item) => {
                  return (
                    <RecommBox
                      onServicePress={() => {
                        this.props.navigation.navigate("ServiceDetail", {
                          data: {
                            service: item,
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                          },
                          refreshFunc: () => {
                            this.refreshFunc();
                          },
                        });
                      }}
                      serviceName={item.service_name + " Needed"}
                      serviceTime={this.changeDate(item.created)}
                      logo={item.service_image}
                    />
                  );
                })
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 50,
                  }}
                >
                  <Text>There are no requests.</Text>
                </View>
              )
            ) : (
              <RecommBox
                onServicePress={() => {
                  let cords = [
                    {
                      latitude: this.state.latitude,
                      longitude: this.state.longitude,
                    },
                    {
                      latitude: parseFloat(this.state.active_requests.latitude),
                      longitude: parseFloat(
                        this.state.active_requests.longitude
                      ),
                    },
                  ];

                  console.log("params to complete ==> ", cords);
                  if (
                    this.state.active_requests.booking_status == 9 &&
                    this.state.active_requests.receipt_reject_count > 0
                  ) {
                    this.props.navigation.navigate("ReceiptReject", {
                      data: this.state.active_requests,
                    });
                  } else {
                    this.props.navigation.dispatch(
                      StackActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({
                            routeName: "CompleteJob",
                            params: {
                              data: {
                                service: this.state.active_requests,
                                customer_details: this.state.active_requests,
                                fixerID: this.state.fixerUserID,
                                coordinates: cords,
                              },
                            },
                          }),
                        ],
                      })
                    );
                  }
                }}
                serviceName={
                  this.state.active_requests.service_name + " Needed"
                }
                serviceTime={this.changeDate(
                  this.state.active_requests.created
                )}
                logo={this.state.active_requests.service_image}
              />
            )}
          </ScrollView>
        </View>

        {/* </View> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  map: {
    // ...StyleSheet.absoluteFillObject,
    height: (2 * DEV_HEIGHT) / 3,
  },
  jobRequest: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%",
    backgroundColor: "white",

    height: DEV_HEIGHT / 2.8,
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
  locateMeContainer: {
    position: "absolute",
    right: 20,
    bottom: 320,
  },
  locateBtn: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: Colors.WHITE_COLOR,
    shadowColor: Colors.BLACK_COLOR,
    shadowOpacity: 0.7,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 3,
  },
  locateImg: {
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
});
