import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { Colors } from "../../constants/colors/Colors";
import { DEV_WIDTH } from "../../constants/Device/DeviceDetails";
import CrossContainer from "../../components/CrossContainer";
import { ProfileListData } from "./assets/ProfileData";
import AsyncStorage from "@react-native-community/async-storage";
import { StackActions, NavigationActions } from "react-navigation";
import { standardPostApi } from "../../api/ApiWrapper";
import { firebase } from "@react-native-firebase/messaging";

function Stars(props) {
  const { providerRating } = props;
  return (
    <>
      {providerRating != null && providerRating != "" && (
        <View style={styles.starsRow}>
          {Array.from(Array(providerRating).keys()).map(() => {
            return (
              <Image
                style={{ marginRight: 2 }}
                source={require("./star_filled.png")}
              />
            );
          })}
        </View>
      )}
    </>
  );
}
export default class MenuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchValue: true,
      name: "",
      user_img: "",
      user_profile: null,
      userid: "",
      earnings: 0,
      providerRating: "",
    };
  }

  componentDidMount() {
    const sub = this.props.navigation.addListener("willFocus", (payload) => {
      this.getUserProfile();
    });
  }

  logoutUser = async () => {
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      this.setState({ loading: true });
      const res = await standardPostApi(
        "saveDeviceToken",
        { Authorization: "Bearer " + TOKEN },
        {
          device_id: "",
          device_type: "",
          device_version: "",
        },
        true,
        false
      );
      if (res) {
        await AsyncStorage.removeItem("@USER_ACCESS_TOKEN");
        await AsyncStorage.removeItem("fcmToken");
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Login",
                params: {},
              }),
            ],
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
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
      if (res.data.status == 200) {
        let data = res.data.result;
        this.setState({
          user_profile: data,
          name: data.first_name,
          user_img: data.profile_picture,
          switchValue: data.is_online == "1" ? true : false,
          userid: data.id,
          earnings: data.totalEarning,
          providerRating: Number(data.rating),
        });
        console.log("stars are ", this.state.user_profile);
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
  };
  toggleSwitch = async (value) => {
    console.log("toggle value ", value);
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      const res = await standardPostApi(
        "updateProviderOnlineStatus",
        { Authorization: "Bearer " + TOKEN },
        {
          is_online: value ? 1 : 0,
          // id: this.state.userid,
        },
        true,
        false
      );
      console.log("from toggle switch ", res);
      if (res.data.status == 200) {
        this.setState({ switchValue: value });
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
  };

  navigateAndGoback = (pageName) => {
    this.props.navigation.navigate(pageName);
  };

  render() {
    const { switchValue, providerRating } = this.state;
    return (
      <CrossContainer
        isScroll
        onCrossPress={() => this.props.navigation.goBack()}
      >
        <View style={{ paddingHorizontal: 29 }}>
          <View style={styles.profileRow}>
            <Image
              style={styles.userImg}
              source={
                this.state.user_img
                  ? { uri: this.state.user_img }
                  : require("../Home/assets/img/user_1.png")
              }
            />
            <View>
              <Text style={styles.welcomeTxt}>
                {" "}
                {this.state.earnings
                  ? this.state.earnings + " SAR"
                  : 0 + " SAR"}
              </Text>
              <Text style={styles.userNameTxt}>
                {this.state.name ? this.state.name : ""}
              </Text>
              <Stars providerRating={providerRating} />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                }}
              >
                <Text style={styles.activateTxt}>Available</Text>
                <Switch
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  trackColor={{ false: "#767577", true: "rgba(255,216,0,0.5)" }}
                  thumbColor={
                    switchValue ? Colors.LIGHT_YELLOW_COLOR : "#f4f3f4"
                  }
                  onValueChange={this.toggleSwitch}
                  value={switchValue}
                />
              </View>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            {ProfileListData.map((item) => {
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      item.isButton
                        ? Alert.alert(
                            "Signout",
                            "Are you sure you want to sign out ?",
                            [
                              { text: "Cancel" },
                              {
                                text: "Yes",
                                onPress: () => this.logoutUser(),
                              },
                            ]
                          )
                        : this.navigateAndGoback(item.pageName);
                    }}
                    style={{ paddingVertical: 20 }}
                  >
                    <View style={styles.mainRow}>
                      <Image style={styles.icon} source={item.img} />
                      <Text style={styles.text}>{item.title}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </CrossContainer>
    );
  }
}

const styles = StyleSheet.create({
  welcomeTxt: {
    fontSize: 16,
    color: Colors.BLACK_COLOR,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 5,
  },
  userNameTxt: {
    fontSize: 26,
    color: Colors.BLACK_COLOR,
    fontWeight: "bold",
    width: DEV_WIDTH / 1.6,
    marginBottom: 5,
    marginLeft: 5,
  },
  userImg: {
    //resizeMode: "contain",
    shadowColor: "rgba(126,131,141,0.09)",
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: 5,
    shadowOpacity: 1,
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  icon: {
    height: 19,
    width: 19,
    resizeMode: "contain",
    tintColor: Colors.SKY_COLOR,
    marginRight: 15,
  },
  text: {
    fontSize: 17,
    color: Colors.BLACK_COLOR,
    marginLeft: 10,
  },
  mainRow: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  profileRow: {
    flexDirection: "row",
    marginTop: 35,
    alignItems: "center",
  },
  activateTxt: {
    fontSize: 14,
    color: Colors.BLACK_COLOR,
    marginRight: 25,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
