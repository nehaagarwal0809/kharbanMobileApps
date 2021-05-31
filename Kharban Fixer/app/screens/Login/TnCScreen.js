import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import Container from "../../components/Container";
import { Colors } from "../../constants/colors/Colors";
import KharbanButton from "../../components/KharbanButton";
import ScrollViewIndicator from "react-native-scroll-indicator";
import { DEV_WIDTH, DEV_HEIGHT } from "../../constants/Device/DeviceDetails";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import querystring from "querystring";
import AsyncStorage from "@react-native-community/async-storage";
import { standardPostApi } from "../../api/ApiWrapper";
import { StackActions, NavigationActions } from "react-navigation";
import { Toaster } from "../../components/Toaster";
import { IS_IOS, DEV_VERSION } from "../../constants/Device/DeviceDetails";
import { firebase } from "@react-native-firebase/messaging";
import Loader from "../../components/Loader";
import HTML from "react-native-render-html";
function CheckBox(props) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View>
        <TouchableOpacity onPress={props.onPress}>
          <View
            style={[
              styles.emptyBox,
              {
                backgroundColor:
                  props.checked === "1"
                    ? Colors.YELLOW_COLOR
                    : Colors.WHITE_COLOR,
                borderColor:
                  props.checked === "1"
                    ? Colors.BLACK_COLOR
                    : Colors.BLACK_COLOR,
              },
            ]}
          >
            {props.checked && (
              <Icons name="check-bold" color={Colors.BLACK_COLOR} size={13} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default class TnCScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      loading: false,
      is_tc_checked: 0,
      termsLoading: true,
      termsData: "",
    };
  }

  componentDidMount() {
    this.checkPermission();
    const { navigation } = this.props;
    const signupData = navigation.getParam("userDetails");
    console.log("tnc #####", signupData);
    this.getTerms();
  }

  getTerms = async () => {
    try {
      const res = await standardPostApi(
        "getContent",
        undefined,
        {
          content_type: "ProviderTermCondition",
        },
        true,
        false
      );

      console.log(res);
      if (res.data.status == 200) {
        this.setState({ termsData: res.data.result.description });
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
    this.setState({ termsLoading: false });
  };

  toggleCheck = async () => {
    await this.setState({
      checked: !this.state.checked,
    });
  };

  getToken = async () => {
    AsyncStorage.getItem("fcmToken", async (err1, fcmToken) => {
      console.log("AsyncStorage=>" + fcmToken);
      if (!fcmToken) {
        // user has a device token
        fcmToken = await firebase.messaging().getToken();
        await AsyncStorage.setItem("fcmToken", fcmToken);
        console.log("user has a device token" + fcmToken);
        global.fcmToken = fcmToken;
      } else {
        console.log("user has a device token" + fcmToken);
        await AsyncStorage.setItem("fcmToken", fcmToken);
        global.fcmToken = fcmToken;
      }
      console.log("FCM TOKE" + fcmToken);
    });
  };

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    console.log("enabled ==> ", enabled);
    if (enabled === 1) {
      this.getToken();
    } else {
      this.requestPermission();
      this.getToken();
    }
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log("permission rejected");
    }
  };

  saveUserDeviceInfo = async () => {
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      const res = await standardPostApi(
        "saveDeviceInfo",
        { Authorization: "Bearer " + TOKEN },
        {
          device_id: await AsyncStorage.getItem("fcmToken"),
          device_type: IS_IOS ? "ios" : "android",
          device_version: DEV_VERSION.toString(),
        },
        true,
        false
      );
      console.log("device info ", res);
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: "Congrats",
              params: {},
            }),
          ],
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  authoriseUser = async () => {
    const { navigation } = this.props;
    const signupData = navigation.getParam("userDetails");

    await axios
      .post(
        "http://kharban.net:82/authorization",
        {
          username: signupData.contact_no,
          password: signupData.otp,
          grant_type: "password",
        },
        {
          "Content-Type": "application/json",
        }
      )
      .then(async (res) => {
        if (res.status == 200) {
          console.log("Auth response is ", res.data);
          await AsyncStorage.setItem(
            "@USER_ACCESS_TOKEN",
            res.data.access_token
          );
          this.saveUserDeviceInfo();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  registerUser = async () => {
    const { navigation } = this.props;
    const signupData = navigation.getParam("userDetails");

    if (this.state.checked) {
      try {
        this.setState({ loading: true });
        const res = await standardPostApi(
          "addProvider",
          undefined,
          {
            first_name: signupData.first_name,
            otp: signupData.otp,
            contact_no: signupData.contact_no,
            document_id: signupData.document_id,
            service_category_id: signupData.service_category_id,
            iban_no: signupData.iban_no,
            profile_picture: signupData.profile_picture,
            profile_extension: signupData.profile_extension,
            document_image: signupData.document_image,
            document_extension: signupData.document_extension,
            iban_image: signupData.iban_image,
            iban_extension: signupData.iban_extension,
            is_tc_checked: 1,
            country_code: signupData.country_code,
          },
          true
        );
        console.log("Final Response of add provider res ", res.data);
        if (res.data.status == 200) {
          this.setState({ loading: false });
          Alert.alert("You have to wait for admin approval first");
          this.authoriseUser();
        }
      } catch (error) {
        console.log(error);
      }
    } else if (signupData.isregistered) {
      Toaster("Please Sign Up before proceeding!!", Colors.LIGHT_RED);
    } else {
      Toaster(
        "Please accept the Terms and Conditions before proceeding!!",
        Colors.LIGHT_RED
      );
    }
    this.setState({ loading: false });
  };
  render() {
    const { navigation } = this.props;
    const signupData = navigation.getParam("userDetails");
    const { termsLoading, termsData } = this.state;
    return (
      <Container>
        {termsLoading ? (
          <Loader />
        ) : (
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View style={styles.container}>
              <Text style={styles.text}>Terms and conditions</Text>
              <Text style={styles.subhead}>
                Please read the terms and conditions{" "}
              </Text>
            </View>
            <ScrollViewIndicator
              flexibleIndicator={false}
              shouldIndicatorHide={false}
              indicatorHeight={23}
              scrollIndicatorContainerStyle={{ backgroundColor: "#F2F2F2" }}
              style={{
                paddingHorizontal: "9%",
                flex: 1,
                marginTop: 25,
                alignItems: "flex-start",
                marginBottom: signupData ? 0 : 50,
              }}
            >
              <HTML
                ignoredStyles={["font-family"]}
                html={`${termsData}`}
                onLinkPress={(event, href) => {
                  Linking.openURL(href);
                }}
              />
            </ScrollViewIndicator>
            {signupData && signupData.promptAcceptTerms && (
              <View>
                <View style={styles.checkBoxContainer}>
                  <CheckBox
                    checked={this.state.checked}
                    onPress={() => this.toggleCheck()}
                  />
                  <Text style={{ color: Colors.BLACK_COLOR, fontSize: 15 }}>
                    I agree to the terms and conditions
                  </Text>
                </View>
                <KharbanButton
                  buttonProps={{
                    style: styles.nextBtn,
                    onPress: () => {
                      this.registerUser();
                    },
                  }}
                  buttonText="Next"
                  buttonTextProps={{
                    style: { color: Colors.BLACK_COLOR, fontWeight: "bold" },
                  }}
                  loading={this.state.loading}
                />
              </View>
            )}
          </View>
        )}
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    // flexDirection: "column",
    // alignItems: "flex-start",
    // marginTop:hp(5),
    marginTop: 0,
    paddingHorizontal: "5%",
  },
  text: {
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: 45,
  },
  subhead: {
    marginTop: 10,
    color: Colors.GREY_COLOR,
    fontSize: 14,
    lineHeight: 25,
    opacity: 0.6,
  },
  scollerview: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  textterms: {
    fontSize: 13,
    color: Colors.GREY_COLOR,
    lineHeight: 25,
  },
  emptyBox: {
    height: 17,
    width: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    paddingHorizontal: "3%",
  },
  nextBtn: {
    width: 280,
    height: 47,
    marginTop: 25,
    alignSelf: "center",
    backgroundColor: Colors.YELLOW_COLOR,
    marginBottom: 30,
  },
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 30,
    paddingHorizontal: "5%",
  },
});
