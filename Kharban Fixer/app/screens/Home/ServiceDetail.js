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
  Linking,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import IconDown from "react-native-vector-icons/FontAwesome";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import Mapstyle from "./assets/MapStyle.json";
import { DEV_HEIGHT } from "../../constants/Device/DeviceDetails";
import IconRight from "react-native-vector-icons/Feather";
import { Colors } from "../../constants/colors/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import { standardPostApi } from "../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import MapViewDirections from "react-native-maps-directions";
import database from "@react-native-firebase/database";
import { NavigationActions, StackActions } from "react-navigation";

var reference = "";
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = "AIzaSyDfujfLdGzG-pWG0VGe4agzS80EKAhP4gU";

export default class ServiceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      coordinates: [],
      booking_id: "",
      distance: 0,
      time: 0,
      fixerUserID: "",
      id: "",
      accepting: false,
      rejecting: false,
    };
  }

  componentDidMount() {
    const sub = this.props.navigation.addListener(
      "willFocus",
      async (payload) => {
        const { navigation } = this.props;
        const Service = navigation.getParam("data").service;
        const DATA = navigation.getParam("data");

        const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
        console.log("TOKEN data ==> ", TOKEN);

        let cords = [
          {
            latitude: DATA.latitude,
            longitude: DATA.longitude,
          },
          {
            latitude: parseFloat(DATA.service.latitude),
            longitude: parseFloat(DATA.service.longitude),
          },
        ];

        this.setState(
          {
            booking_id: Service.booking_id,
            id: Service.id,
            coordinates: cords,
          },
          () => {
            this.getUserUniqueID();
          }
        );
      }
    );
  }

  getUserUniqueID = async () => {
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      const res = await standardPostApi(
        "getLoginUserInfo",
        { Authorization: "Bearer " + TOKEN },
        {},
        true,
        false
      );
      if (res.status == 200) {
        this.setState(
          {
            fixerUserID: res.data.userid,
          },
          () => {
            reference = database().ref("/" + this.state.fixerUserID);
            //reference = database().ref('/123');

            //one time read value
            reference.once("value").then((snapshot) => {
              console.log("User data: ", snapshot.val());
              const { navigation } = this.props;
              const DATA = navigation.getParam("data");
              let cords = [];
              if (snapshot.val() && snapshot.val().lat) {
                cords.push({
                  latitude: snapshot.val().lat,
                  longitude: snapshot.val().lng,
                });
              } else {
                cords.push({
                  latitude: DATA.latitude,
                  longitude: DATA.longitude,
                });
              }
              cords.push({
                latitude: parseFloat(DATA.service.latitude),
                longitude: parseFloat(DATA.service.longitude),
              });

              this.setState(
                {
                  coordinates: cords,
                },
                () => {
                  console.log("one time value ==> ", this.state.coordinates);
                }
              );
            });

            //trigger when change in value
            reference.on("value", (snapshot) => {
              const { navigation } = this.props;
              const DATA = navigation.getParam("data");
              let cords = [];
              if (snapshot.val() && snapshot.val().lat) {
                cords.push({
                  latitude: snapshot.val().lat,
                  longitude: snapshot.val().lng,
                });
              } else {
                cords.push({
                  latitude: DATA.latitude,
                  longitude: DATA.longitude,
                });
              }
              cords.push({
                latitude: parseFloat(DATA.service.latitude),
                longitude: parseFloat(DATA.service.longitude),
              });

              this.setState(
                {
                  coordinates: cords,
                },
                () => {
                  console.log(
                    "after value change ==> ",
                    this.state.coordinates
                  );
                }
              );
            });
          }
        );
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
  };

  jobAcceptDecline = async (Service, job_status) => {
    this.setState(
      job_status == "1" ? { accepting: true } : { rejecting: true }
    );
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      const res = await standardPostApi(
        "jobAcceptDecline",
        { Authorization: "Bearer " + TOKEN },
        {
          id: this.state.id,
          booking_id: this.state.booking_id,
          provider_status: job_status,
        },
        true,
        false
      );
      console.log("job accept response  ", res);
      if (res.data.status == 200) {
        if (job_status == 1) {
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: "CompleteJob",
                  params: {
                    data: {
                      service: Service,
                      customer_details: res.data.result,
                      fixerID: this.state.fixerUserID,
                      coordinates: this.state.coordinates,
                    },
                  },
                }),
              ],
            })
          );
        } else {
          this.goBack();
        }
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
    this.setState(
      job_status == "1" ? { accepting: false } : { rejecting: false }
    );
  };

  componentWillUnmount() {
    this.goBack();
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc();
  };

  render() {
    const { navigation } = this.props;
    const Service = navigation.getParam("data").service;
    console.log("service ", Service);
    const DATA = navigation.getParam("data");

    return (
      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={Mapstyle}
          loadingEnabled={true}
          region={{
            latitude:
              this.state.coordinates[0] && this.state.coordinates[0].latitude
                ? this.state.coordinates[0].latitude
                : DATA.latitude,
            longitude:
              this.state.coordinates[0] && this.state.coordinates[0].longitude
                ? this.state.coordinates[0].longitude
                : DATA.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          zoomEnabled
          mapType="standard"
        >
          {this.state.coordinates.map((coordinate, index) => {
            if (index == 0) {
              return (
                <MapView.Marker
                  key={`coordinate_${index}`}
                  coordinate={coordinate}
                >
                  <View style={styles.outMostCircle}>
                    <View style={styles.innerCircle}>
                      <View style={styles.innerMostCircle} />
                    </View>
                  </View>
                </MapView.Marker>
              );
            }
            if (index == 1) {
              return (
                <Marker coordinate={coordinate}>
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
              strokeWidth={4}
              strokeColor="#FFD800"
              optimizeWaypoints={true}
              onStart={(params) => {
                console.log(
                  `Started routing between "${params.origin}" and "${params.destination}"`
                );
              }}
              onReady={(result) => {
                `onReady result ==> : ${result} km`;
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
                this.setState({
                  distance: result.distance,
                  time: result.duration,
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
            onPress={() => this.goBack()}
          >
            <Icon
              name="keyboard-backspace"
              size={28}
              color={Colors.BLACK_COLOR}
            />
          </TouchableOpacity>
        </SafeAreaView>
        <View style={styles.jobRequest}>
          <ScrollView>
            <View
              style={{
                paddingHorizontal: "7%",
                marginTop: "5%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 19, lineHeight: 42, fontWeight: "bold" }}
              >
                {Service.service_name + " Needed"}
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
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.distance}>Distance</Text>
                <Text style={styles.desc}>{`${Math.ceil(
                  this.state.distance
                )} km`}</Text>
              </View>
              <View>
                <View style={styles.hr}></View>
              </View>
              <View>
                <Text style={styles.distance}>Time</Text>
                <Text style={styles.desc}>{`${Math.ceil(
                  this.state.time
                )} min`}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 40,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.jobAcceptDecline(Service, "3");
                }}
                disabled={this.state.rejecting}
              >
                <View style={styles.buttons}>
                  {this.state.rejecting ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.WHITE_COLOR}
                    />
                  ) : (
                    <Text style={styles.buttonText}>Reject</Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.jobAcceptDecline(Service, "1");
                }}
                disabled={this.state.accepting}
              >
                <View
                  style={[
                    styles.buttons,
                    {
                      backgroundColor: "#60D063",
                      shadowColor: "rgb(96,208,99)",
                    },
                  ]}
                >
                  {this.state.accepting ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.WHITE_COLOR}
                    />
                  ) : (
                    <Text style={styles.buttonText}>Accept</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  map: {
    height: (2 * DEV_HEIGHT) / 2.8,
  },
  jobRequest: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%",
    backgroundColor: "white",

    height: DEV_HEIGHT / 3,
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
    backgroundColor: "#E15252",
    borderRadius: 10,
    width: 158,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgb(225,82,82)",
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
});
