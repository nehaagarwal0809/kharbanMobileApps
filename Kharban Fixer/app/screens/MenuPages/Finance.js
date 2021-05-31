import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Colors } from "../../constants/colors/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import CrossContainer from "../../components/CrossContainer";
import { DEV_WIDTH } from "../../constants/Device/DeviceDetails";
// import Icon from "react-native-vector-icons/Entypo";
import Icon from "react-native-vector-icons/EvilIcons";
import { standardPostApi } from "../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../../components/Loader";
import moment from "moment";
import DatePicker from "react-native-datepicker";

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

export default class Finance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      earning_data: [],
      dataLoading: true,
      user_img: "",
      earnings: 0,
      isOpen: false,
      StartDate: "",
      EndDate: "",
    };
    this.getUserProfile();
    this.getEarninghistory();
  }

  getEarninghistory = async () => {
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      const res = await standardPostApi(
        "getCompleteBookings",
        { Authorization: "Bearer " + TOKEN },
        {
          StartDate: this.state.StartDate,
          EndDate: this.state.EndDate,
        },
        true,
        false
      );
      console.log("getFinanceList ", res);
      if (res.data.status == 200) {
        const All_Earnings = res.data.result;
        this.setState({ AllEarnings: All_Earnings, dataLoading: false });
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
    // this.setState({ loadingRequests: false });
  };

  getUserProfile = async () => {
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      const res = await standardPostApi(
        "getProviderInformation",
        { Authorization: "Bearer " + TOKEN },
        {},
        true,
        false
      );
      // console.log("getUserProfile ", res);
      if (res.data.status == 200) {
        let data = res.data.result;
        this.setState({
          name: data.first_name,
          user_img: data.profile_picture,

          earnings: data.TotalEarning,
        });
        console.log(this.state.user_profile);
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
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

  toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };

  convertDate = (date) => {
    return moment(this.toTimestamp(date) * 1000)
      .format("YYYY-MM-DD")
      .toString();
  };

  render() {
    const { dataLoading, AllEarnings, isOpen, StartDate, EndDate } = this.state;
    return (
      <CrossContainer
        isScroll
        onCrossPress={() => this.props.navigation.goBack()}
      >
        <View style={{ paddingHorizontal: 29 }}>
          <View style={styles.profileRow}>
            <Image
              style={styles.userImg}
              // source={require("../Home/assets/img/user_1.png")}
              source={
                this.state.user_img
                  ? { uri: this.state.user_img }
                  : require("../Home/assets/img/user_1.png")
              }
            />
            <View>
              <Text style={styles.welcomeTxt}>
                {this.state.earnings
                  ? this.state.earnings + " SAR"
                  : 0 + " SAR"}
              </Text>
              <Text style={styles.userNameTxt}>Total Earning</Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 15,
              marginBottom: 5,
              paddingHorizontal: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={styles.help}>Earns History</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image source={require("./img/Filter_icon.png")} />
              <Text
                style={{ fontSize: 13, marginLeft: 5 }}
                onPress={() => {
                  this.setState({ isOpen: true });
                }}
              >
                Filter
              </Text>
              <Icon
                name={isOpen ? "chevron-up" : "chevron-down"}
                size={22}
                color={Colors.BLACK_COLOR}
                onPress={() => {
                  if (isOpen) {
                    this.setState({ isOpen: false });
                  } else {
                    this.setState({ isOpen: true });
                  }
                }}
              />
            </View>
          </View>
          {isOpen && (
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <DatePicker
                style={{ width: 120 }}
                date={this.state.StartDate}
                mode="date"
                placeholder="select start date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateInput: {},
                }}
                showIcon={false}
                onDateChange={(date) => {
                  this.setState({ StartDate: date });
                }}
              />
              <DatePicker
                style={{ width: 120, marginLeft: 20 }}
                date={this.state.EndDate}
                mode="date"
                placeholder="select end date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                minDate={StartDate || new Date()}
                customStyles={{}}
                showIcon={false}
                onDateChange={(date) => {
                  let _date = new Date(date).addDays(1);
                  this.setState({
                    EndDate: this.convertDate(_date),
                    isOpen: false,
                  });
                  if (this.state.StartDate) {
                    this.getEarninghistory();
                  } else {
                    alert("Please select both dates");
                  }
                }}
              />
            </View>
          )}
          {dataLoading ? (
            <Loader />
          ) : (
            AllEarnings && (
              <View style={{ marginBottom: 25 }}>
                {AllEarnings.map((item) => {
                  return (
                    <View style={styles.mainDiv}>
                      <View style={{ flexDirection: "row", flex: 1 }}>
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
                                style={{ width: 20, height: 20 }}
                                source={{ uri: item.service_image }}
                              />
                            </View>
                          </View>
                        </View>
                        <View>
                          <Text style={styles.title}>
                            ID : {item.booking_code}
                          </Text>
                          <Text style={styles.pointTxt}>
                            {item.service_name + " Needed"}
                          </Text>
                          <Text style={styles.title}>
                            {this.changeDate(item.created)}
                          </Text>
                        </View>
                      </View>
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
                    </View>
                  );
                })}
              </View>
            )
          )}
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
    flex: 1,
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
    fontSize: 13,
    // width: 60,
  },
  profileRow: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
  },
  welcomeTxt: {
    fontSize: 16,
    color: Colors.BLACK_COLOR,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 5,
  },
  userNameTxt: {
    fontSize: 14,
    lineHeight: 25,
    color: Colors.GREY_COLOR,
    fontWeight: "bold",
    width: DEV_WIDTH / 1.6,
    marginBottom: 5,
    marginLeft: 5,
  },
  userImg: {
    resizeMode: "contain",
    shadowColor: "rgba(126,131,141,0.09)",
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: 5,
    shadowOpacity: 1,
    width: 100,
    height: 100,
  },
});
