import React, { Component } from "react";
import { Text, View, StyleSheet, ActivityIndicator, Image } from "react-native";
import { Colors } from "../../constants/colors/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import CrossContainer from "../../components/CrossContainer";
import Icon from "react-native-vector-icons/Entypo";
import IconHelp from "react-native-vector-icons/Ionicons";
import Loader from "../../components/Loader";
import { DEV_HEIGHT } from "../../constants/Device/DeviceDetails";
import { standardPostApi } from "../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
// import { standardPostApi } from "../../../../api/ApiWrapper";
import moment from "moment";
const Notif_Arr = [
  {
    title: "Notification Title Here ...",
    desc: "notification information here",
    date: "08",
    month: "Aug",
  },
  {
    title: "Notification Title Here ...",
    desc: "notification information here",
    date: "08",
    month: "Aug",
  },
  {
    title: "Notification Title Here ...",
    desc: "notification information here",
    date: "08",
    month: "Aug",
  },
];

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allNotifications: [],
      refreshing: false,
    };
    this.getNotification();
  }

  getNotification = async () => {
    this.setState({ loadingRequests: true });
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      const res = await standardPostApi(
        "getNotification",
        { Authorization: "Bearer " + TOKEN },
        {},
        true,
        false
      );
      console.log("from getNotification ", res);
      if (res.data.status == 200) {
        const All_Notifications = res.data.result;
        this.setState({ allNotifications: All_Notifications });
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
    this.setState({ loadingRequests: false });
  };

  onRefresh = () => {
    this.setState({ refreshing: true, dataLoading: true });
    this.getNotification();
    this.setState({ refreshing: false, dataLoading: false });
  };

  render() {
    const { loadingRequests, allNotifications } = this.state;
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
              flexDirection: "row",
              marginTop: 40,
              marginBottom: 40,
              alignItems: "center",
            }}
          >
            <Image
              style={{ height: 35, width: 35, marginRight: 20 }}
              source={require("./img/notification.png")}
            />
            <View>
              <Text style={styles.help}>Notification</Text>
              {/* <Text style={styles.subhelp}>
                questions about the application may help
              </Text> */}
            </View>
          </View>
          <View style={{ marginBottom: 25 }}>
            {loadingRequests ? (
              <Loader />
            ) : allNotifications != null && allNotifications.length > 0 ? (
              <View>
                {allNotifications.map((item) => {
                  return (
                    <View style={styles.mainDiv}>
                      <View
                        style={{
                          marginRight: 20,
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 10,
                        }}
                      >
                        <Text style={styles.date}>
                          {moment(item.created).format("DD")}
                        </Text>
                        <Text style={styles.date}>
                          {moment(item.created).format("MMM")}
                        </Text>
                      </View>
                      <View style={{ marginBottom: 10 }}>
                        <Text style={styles.title}>{item.notification}</Text>
                        <Text style={styles.pointTxt}>{item.notification}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.noRequest}>There is no Notifications.</Text>
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
    fontSize: 15,
    color: Colors.BLACK_COLOR,
    fontSize: 13,
    fontWeight: "bold",
    // fontFamily: ROBO_MEDIUM,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
  },
  pointTxt: {
    fontSize: 13,
    color: "rgba(126,131,141,0.5)",
    marginTop: 4,
    alignSelf: "flex-start",
    lineHeight: 24,
  },
  mainDiv: {
    borderBottomWidth: 1,
    borderColor: "rgba(227,230,235,0.4)",
    padding: 10,
    marginTop: 15,
    flexDirection: "row",
  },
  date: {
    color: "#FFD800",
    fontWeight: "bold",
    fontSize: 15,
  },
  noRequest: {
    fontSize: 22,
    color: Colors.BLACK_COLOR,
    textAlign: "center",
    marginTop: DEV_HEIGHT / 10,
  },
});
