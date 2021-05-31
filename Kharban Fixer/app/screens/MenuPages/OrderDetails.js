import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import CrossContainer from "../../components/CrossContainer";
import { Colors } from "../../constants/colors/Colors";
import { DEV_WIDTH } from "../../constants/Device/DeviceDetails";
import IconLoc from "react-native-vector-icons/Ionicons";
import Geocoder from "react-native-geocoding";

function JobDetails(props) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.mainRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View>
            {props.profile_picture && props.profile_picture ? (
              <Image
                source={{ uri: props.profile_picture }}
                style={styles.workerImg}
              />
            ) : (
              <Image
                source={require("./img/user_dummy.jpg")}
                style={{
                  width: 125,
                  height: 125,
                  alignSelf: "center",
                  borderRadius: 63,
                }}
              />
            )}
          </View>
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.serviceName}>{props.customerName}</Text>
            {props.contact_no && (
              <Text style={styles.jobId}>{props.contact_no}</Text>
            )}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.dot}></View>
              <Text style={styles.serviceStatus}>Completed</Text>
            </View>
            {/* <Text style={styles.jobId}>08/05/2020 05:50 AM</Text> */}
          </View>
        </View>
        <View>
          <Text style={[styles.serviceName, { marginBottom: 20 }]}>
            {props.booking_amount} SAR
          </Text>
          {/* {props.hasRating && (
            <View style={styles.starsRow}>
              {Array.from(Array(Math.round(props.numberOfStars)).keys()).map(
                () => {
                  return <Image source={require("./star_filled.png")} />;
                }
              )}
            </View>
          )} */}
        </View>
      </View>
    </View>
  );
}

export default class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
    };
    this.getFullAddress();
  }

  getFullAddress() {
    const { navigation } = this.props;
    const DATA = navigation.getParam("data").BookingData;
    Geocoder.from(DATA.latitude, DATA.longitude).then((json) => {
      var addressComponent = json.results[0].formatted_address;
      this.setState({ address: addressComponent });
    });
  }

  render() {
    const { navigation } = this.props;
    const DATA = navigation.getParam("data").BookingData;
    console.log("data from order screen===>", DATA);
    return (
      <CrossContainer
        isScroll
        hasTitle
        title="Order Details"
        onCrossPress={() => navigation.goBack()}
      >
        <View style={{ paddingHorizontal: 33, marginTop: 8 }}>
          <Text style={styles.appNumber}>
            {" "}
            Request ID {"" + DATA.booking_code}{" "}
          </Text>
          <JobDetails
            booking_amount={DATA.booking_amount}
            serviceStatus={DATA.booking_status}
            contact_no={DATA.contact_no}
            profile_picture={DATA.profile_picture}
            customerName={DATA.customer_name}
          />
          <View style={styles.line} />
          <Text style={styles.appNumber}>Service Location</Text>
          <View style={styles.locationRow}>
            <IconLoc
              name="ios-location-outline"
              size={20}
              color={Colors.BLACK_COLOR}
            />
            <View style={{ marginLeft: 15 }}>
              {/* <Text style={styles.locationName}>Work</Text> */}
              <Text style={styles.fullLocation}>{this.state.address}</Text>
            </View>
          </View>
          <View
            style={{
              shadowColor: "rgb(126,131,141)",
              shadowOpacity: 0.18,
              shadowRadius: 2,
              shadowOffset: {
                height: 3,
                width: 0,
              },
              // elevation: 10,
            }}
          >
            <Image
              style={{
                // resizeMode: "contain",
                width: "100%",
                borderRadius: 20,
              }}
              source={require("./img/map_big.png")}
            />
          </View>
          <View style={styles.line} />
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={require("./img/comment.png")} />
              <Text style={[styles.appNumber, { marginLeft: 15 }]}>
                Comments
              </Text>
            </View>
            <Text style={styles.notesTxt}>
              {DATA.provider_rating_description
                ? DATA.provider_rating_description
                : "Not Available"}
            </Text>
          </View>
        </View>
      </CrossContainer>
    );
  }
}

const styles = StyleSheet.create({
  appNumber: {
    fontSize: 15,
    color: Colors.BLACK_COLOR,
    fontWeight: "bold",
    // fontFamily: RB_BOLD,
  },
  workerImg: {
    height: 74,
    width: 74,
    resizeMode: "cover",
    borderRadius: 37,
    borderWidth: 5,
    borderColor: "#EDEDEB",
  },
  serviceStatus: {
    fontSize: 12,
    color: "#5FB93E",
    fontWeight: "bold",
    marginLeft: 5,
    // fontFamily: RB_REGULAR,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#5FB93E",
    borderRadius: 50,
  },
  workerName: {
    fontSize: 20,
    color: Colors.BLACK_COLOR,
    lineHeight: 35,
    // fontFamily: RB_BOLD,
    width: DEV_WIDTH / 2,
  },
  serviceName: {
    fontSize: 13,
    color: Colors.BLACK_COLOR,
    lineHeight: 32,
    fontWeight: "bold",
    // fontFamily: RB_REGULAR,
  },
  jobId: {
    fontSize: 15,
    color: "#93928F",
    lineHeight: 28,
    opacity: 0.6,
    // fontFamily: RB_REGULAR,
  },
  cardContainer: {
    backgroundColor: "white",
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
  },
  mapImage: {
    width: "100%",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  line: {
    borderBottomWidth: 1,
    borderColor: "#E3E6EB",
    opacity: 0.5,
    marginVertical: 30,
  },
  locationName: {
    color: Colors.BLACK_COLOR,
    fontSize: 12,
    // fontFamily: RB_REGULAR,
  },
  fullLocation: {
    color: "#7E838D",
    fontSize: 10,
    // fontFamily: RB_REGULAR,
    width: DEV_WIDTH / 1.3,
  },
  locationRow: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  notesTxt: {
    color: "#7E838D",
    fontSize: 12,
    marginTop: 10,
    //   fontFamily: RB_REGULAR
  },
});
