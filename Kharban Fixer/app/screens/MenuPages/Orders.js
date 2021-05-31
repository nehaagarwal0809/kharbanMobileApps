import React, { Component } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { Colors } from "../../constants/colors/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import CrossContainer from "../../components/CrossContainer";
import { standardPostApi } from "../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../../components/Loader";
import { DEV_HEIGHT } from "../../constants/Device/DeviceDetails";
import moment from "moment";

// const Orders_Arr = [
//   {
//     service_image: require("./img/service.png"),
//     order_id: "35675",
//     title: "Carpenter Needed",
//     date: "08/08/2020 10 : 00 am",
//     status: "Active",
//     price: "25 $",
//   },
//   {
//     service_image: require("./img/service.png"),
//     order_id: "35675",
//     title: "Carpenter Needed",
//     date: "08/08/2020 10 : 00 am",
//     status: "Cancelled",
//     price: "25 $",
//   },
//   {
//     service_image: require("./img/service.png"),
//     order_id: "35675",
//     title: "Carpenter Needed",
//     date: "08/08/2020 10 : 00 am",
//     status: "Waiting For Receipt Approval",
//     price: "25 $",
//   },
//   {
//     service_image: require("./img/service.png"),
//     order_id: "35675",
//     title: "Carpenter Needed",
//     date: "08/08/2020 10 : 00 am",
//     status: "Complete",
//     price: "25 $",
//   },
// ];

export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AllOrderRequests: [],
      refreshing: false,
      loadingRequests: true,
    };
    this.getOrderHistory();
  }

  getOrderHistory = async () => {
    this.setState({ loadingRequests: true });
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      const res = await standardPostApi(
        "getPastProviderBooking",
        { Authorization: "Bearer " + TOKEN },
        {},
        true,
        false
      );
      console.log("getBookingHistory ", res);
      if (res.data.status == 200) {
        const All_Booking_Requests = res.data.result;
        this.setState({ AllOrderRequests: All_Booking_Requests });
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
    this.setState({ loadingRequests: false });
  };
  onRefresh = () => {
    this.setState({ refreshing: true, dataLoading: true });
    this.getOrderHistory();
    this.setState({ refreshing: false, dataLoading: false });
  };

  // changeDate(date) {
  //   let dateTime = moment.utc(date).toDate();
  //   // return moment(date).format("MMMM");
  //   return moment(dateTime).local().format("YYYY/MM/DD HH:mm A");
  // }
  changeDate(date) {
    let dateTime = new Date(date).toUTCString();
    // console.log(dateTime);
    // return moment.utc(date).utcOffset("-02:30").format("YYYY/MM/DD hh:mm A");
    // return moment(date).format("MMMM");

    return moment(dateTime).local().format("YYYY/MM/DD hh:mm A");
  }

  getStatusColor(booking_status) {
    let dotStyle = {};
    dotStyle.status =
      booking_status == 3 || booking_status == 0
        ? "Active"
        : booking_status == 4
        ? "Completed"
        : booking_status == 5
        ? "Waiting For Receipt Approval"
        : "Cancelled";
    dotStyle.color =
      booking_status == 3 || booking_status == 0
        ? "#5FB93E"
        : booking_status == 4
        ? "#7E838D"
        : booking_status == 4
        ? "#F79847"
        : "#EA2020";
    return dotStyle;
  }

  render() {
    const { loadingRequests, AllOrderRequests } = this.state;
    return (
      <CrossContainer
        isScroll
        pullToRefresh
        refreshing={this.state.refreshing}
        onPullToRefresh={() => this.onRefresh()}
        onCrossPress={() => this.props.navigation.goBack()}
      >
        <View style={{ paddingHorizontal: 29 }}>
          <View
            style={{
              marginTop: 30,
              marginBottom: 30,
              paddingHorizontal: 15,
            }}
          >
            <Text style={styles.help}>Orders</Text>
            {/* <Text style={styles.subhelp}>
              questions about the application may help
            </Text> */}
          </View>
          <View style={{ marginBottom: 25 }}>
            {loadingRequests ? (
              <Loader />
            ) : AllOrderRequests != null && AllOrderRequests.length > 0 ? (
              <View>
                {AllOrderRequests.map((item) => {
                  return (
                    <TouchableOpacity
                      style={styles.mainDiv}
                      onPress={() => {
                        if (item.booking_status == 4) {
                          this.props.navigation.navigate("OrderDetails", {
                            data: {
                              BookingData: item,
                            },
                          });
                        }
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={{
                            marginRight: 20,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: Colors.WHITE_COLOR,
                              height: 50,
                              width: 50,
                              borderRadius: 50,
                              borderWidth: 1,
                              borderColor: "#EDEDEB",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: "#FFD800",
                                height: 40,
                                width: 40,
                                borderRadius: 50,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                resizeMode={"contain"}
                                style={{ width: 20, height: 20 }}
                                source={{ uri: item.service_image }}
                              />
                            </View>
                          </View>
                        </View>
                        <View style={{ width: "60%" }}>
                          <Text style={styles.title}>
                            ID : {item.booking_code}
                          </Text>
                          <Text style={styles.pointTxt}>
                            {item.service_name + " Needed"}
                          </Text>
                          <Text style={styles.title}>
                            {this.changeDate(item.created)}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginVertical: 5,
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: this.getStatusColor(
                                  item.booking_status
                                ).color,
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                              }}
                            ></View>
                            <Text
                              style={{
                                color: this.getStatusColor(item.booking_status)
                                  .color,
                                fontWeight: "bold",
                                fontSize: 11,
                                marginLeft: 4,
                              }}
                            >
                              {this.getStatusColor(item.booking_status).status}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {item.booking_status == 4 && (
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.price}>
                            {item.booking_amount} SAR
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.noRequest}>There is no data.</Text>
            )}
          </View>
        </View>
      </CrossContainer>
    );
  }
}

const styles = StyleSheet.create({
  help: {
    color: Colors.BLACK_COLOR,
    fontSize: 24,
    lineHeight: 46,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subhelp: {
    color: Colors.GREY_COLOR,
    fontSize: 12,
    lineHeight: 24,
    // marginBottom: 40,
  },
  title: {
    color: "rgba(126, 131, 141, 0.5)",
    fontSize: 13,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
  },
  pointTxt: {
    fontSize: 13,
    color: Colors.BLACK_COLOR,
    marginVertical: 4,
    fontWeight: "bold",
  },
  mainDiv: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#EDEDEB",
    padding: 13,
    marginTop: 15,
    flexDirection: "row",
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
  date: {
    color: "#FFD800",
    fontWeight: "bold",
    fontSize: 15,
  },
  price: {
    fontWeight: "bold",
    fontSize: 12,
    width: 50,
  },
  noRequest: {
    fontSize: 22,
    color: Colors.BLACK_COLOR,
    textAlign: "center",
    marginTop: DEV_HEIGHT / 10,
  },
});
