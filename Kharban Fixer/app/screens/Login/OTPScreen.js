import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/colors/Colors";
import KharbanButton from "../../components/KharbanButton";
import {
  DEV_WIDTH,
  DEV_VERSION,
  IS_IOS,
} from "../../constants/Device/DeviceDetails";
import IconResend from "react-native-vector-icons/Fontisto";
import { Toaster } from "../../components/Toaster";
import { standardPostApi } from "../../api/ApiWrapper";
import Spinnner from "../../components/Spinner";
import { StackActions, NavigationActions } from "react-navigation";
import axios from "axios";
import querystring from "querystring";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "@react-native-firebase/messaging";

export default class OTPScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 30,
      startTimerAgain: true,
      IFocused: false,
      IIFocused: false,
      IIIFocused: false,
      IVFocused: false,
      first: "",
      second: "",
      third: "",
      fourth: "",
      fetchingOtp: false,
      isNext: true,
      authenticating: false,
    };
  }

  static navigationOptions = {
    headerShown: false,
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

  componentDidMount() {
    this.checkPermission();
    const { navigation } = this.props;
    const sent_details = navigation.getParam("otpData");
    // alert(sent_details.otp);
    this.refs.inputOne.focus();
    this.startInterval();
  }

  startInterval = () => {
    this.interval = setInterval(
      async () =>
        await this.setState((prevState) => ({ timer: prevState.timer - 1 })),
      1000
    );
  };

  async componentDidUpdate() {
    if (this.state.timer === 0) {
      clearInterval(this.interval);
      await this.setState({
        startTimerAgain: false,
        timer: 30,
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.setState({ authenticating: false });
  }

  validateOtp = () => {
    const { navigation } = this.props;
    const sent_details = navigation.getParam("otpData");
    const { first, second, third, fourth } = this.state;
    const enteredOtp = `${first}${second}${third}${fourth}`;
    const sentOtp = sent_details.otp.toString();
    console.log("from resend", sent_details);
    console.log(enteredOtp);
    console.log(sentOtp);
    if (enteredOtp !== sentOtp) {
      Toaster("Invalid OTP \n Please enter a valid OTP.", Colors.LIGHT_RED);
      return false;
    } else {
      if (sent_details.isregistered == false) {
        this.props.navigation.navigate("Registration", {
          userDetails: {
            otp: sent_details.otp,
            mobile: sent_details.mobile,
            isregistered: sent_details.isregistered,
            countryCode: sent_details.countryCode,
          },
        });
      } else if (
        sent_details.isregistered == true &&
        sent_details.approved_status == 0
      ) {
        Toaster("Awaiting Admin approval", Colors.LIGHT_RED);
      } else {
        this.authoriseUser();
      }
    }
  };

  saveUserDeviceInfo = async () => {
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      this.setState({ loading: true });
      const res = await standardPostApi(
        "saveDeviceToken",
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
              routeName: "Home",
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
    const sent_details = navigation.getParam("otpData");
    this.setState({ authenticating: true });
    await axios
      .post(
        "http://kharban.net:82/authorization",
        {
          username: sent_details.mobile,
          password: sent_details.otp,
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

          console.log(
            "from log in storage ",
            await AsyncStorage.getItem("@USER_ACCESS_TOKEN")
          );
          this.saveUserDeviceInfo();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkIsNext = () => {
    const { navigation } = this.props;
    const { first, second, third, fourth } = this.state;
    const enteredOtp = `${first}${second}${third}${fourth}`;
    if (enteredOtp.length == 4) {
      this.setState({ isNext: false });
    } else {
      this.setState({ isNext: true });
    }
  };

  redirectToTerms = () => {
    this.props.navigation.navigate("TnCScreen");
  };

  resendOtp = async () => {
    const { navigation } = this.props;
    const OTP_DATA = navigation.getParam("otpData");
    this.setState({ startTimerAgain: true, fetchingOtp: true });
    try {
      const res = await standardPostApi(
        "Getotp",
        undefined,
        {
          contact_no: OTP_DATA.mobile,
          requesttype: "provider",
          country_code: OTP_DATA.countryCode,
        },
        true,
        false
      );
      if (res.data.status == 200) {
        console.log("the response is ", res.data);
        this.setState({ first: "", second: "", third: "", fourth: "" });
        this.setState({ fetchingOtp: false });
        this.startInterval();
        this.props.navigation.navigate("OTPScreen", {
          otpData: {
            otp: res.data.otp,
            userId: res.data.userid,
            mobile: OTP_DATA.mobile,
            isregistered: res.data.isregistered,
          },
        });
        // alert(res.data.otp);
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
    this.setState({ fetchingOtp: false });
  };

  render() {
    const { startTimerAgain, fetchingOtp, isNext } = this.state;
    return (
      <Container>
        <ScrollView>
          <Spinnner loaderTxt={"Getting OTP"} visible={fetchingOtp} />
          <Image
            source={require("./img/mobile.png")}
            style={styles.imgMobile}
          />
          <View style={styles.container}>
            <Text style={styles.text}>Activate the account</Text>
            <Text style={styles.subhead}>
              Please enter the code sent to your number to activate account
            </Text>
          </View>
          <View style={styles.otpContainer}>
            <TextInput
              ref="inputOne"
              keyboardType="numeric"
              maxLength={1}
              style={[styles.otpBox]}
              onFocus={() => this.setState({ IFocused: true })}
              onBlur={() => this.setState({ IFocused: false })}
              onChangeText={async (text) => {
                await this.setState({ first: text });
                this.checkIsNext();
                if (text.length == 1) this.refs.inputTwo.focus();
              }}
              selectionColor={Colors.PLACEHOLDER_COLOR}
              value={this.state.first}
            />
            <TextInput
              ref="inputTwo"
              keyboardType="numeric"
              maxLength={1}
              style={[styles.otpBox]}
              onFocus={() => this.setState({ IIFocused: true })}
              onBlur={() => this.setState({ IIFocused: false })}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  if (!this.state.second) {
                    this.refs.inputOne.focus();
                  }
                }
              }}
              onChangeText={async (text) => {
                await this.setState({ second: text });
                this.checkIsNext();
                if (text.length == 1) this.refs.inputThree.focus();
              }}
              selectionColor={Colors.PLACEHOLDER_COLOR}
              value={this.state.second}
            />
            <TextInput
              ref="inputThree"
              keyboardType="numeric"
              maxLength={1}
              style={[styles.otpBox]}
              onFocus={() => this.setState({ IIIFocused: true })}
              onBlur={() =>
                this.setState({
                  IIIFocused: false,
                })
              }
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  if (!this.state.third) {
                    this.refs.inputTwo.focus();
                  }
                }
              }}
              onChangeText={async (text) => {
                await this.setState({ third: text });
                this.checkIsNext();
                if (text.length == 1) this.refs.inputFour.focus();
              }}
              selectionColor={Colors.PLACEHOLDER_COLOR}
              value={this.state.third}
            />
            <TextInput
              ref="inputFour"
              keyboardType="numeric"
              maxLength={1}
              style={[styles.otpBox]}
              onFocus={() => this.setState({ IVFocused: true })}
              onBlur={() => this.setState({ IVFocused: false })}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  if (!this.state.fourth) {
                    this.refs.inputThree.focus();
                  }
                }
              }}
              onChangeText={async (text) => {
                await this.setState({ fourth: text });
                this.checkIsNext();
              }}
              selectionColor={Colors.PLACEHOLDER_COLOR}
              value={this.state.fourth}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => this.resendOtp()}
              disabled={startTimerAgain}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <IconResend
                  name={"redo"}
                  size={14}
                  color={
                    startTimerAgain ? Colors.GREY_COLOR : Colors.BLACK_COLOR
                  }
                />
                <Text
                  style={{
                    color: startTimerAgain
                      ? Colors.GREY_COLOR
                      : Colors.BLACK_COLOR,
                    fontSize: 14,
                    paddingHorizontal: 4,
                  }}
                >
                  Resend OTP
                </Text>
              </View>
            </TouchableOpacity>
            {startTimerAgain && (
              <Text
                style={{
                  color: Colors.LIGHT_YELLOW_COLOR,
                  fontSize: 15,
                  paddingHorizontal: 4,
                }}
              >
                00:{this.state.timer}
              </Text>
            )}
          </View>
          {/* <Text style={styles.note}>{i18n.t("forgot.otpNote")}</Text> */}
          <KharbanButton
            buttonProps={{
              style: {
                width: DEV_WIDTH / 1.4,
                marginVertical: 25,
                alignSelf: "center",
                backgroundColor: isNext
                  ? "rgba(255,216,0,0.4)"
                  : Colors.YELLOW_COLOR,
              },
              onPress: () => {
                this.validateOtp();
              },
            }}
            isDisabled={isNext}
            buttonText="Next"
            buttonTextProps={{
              style: {
                color: isNext ? Colors.GREY_COLOR : Colors.BLACK_COLOR,
                fontWeight: "bold",
              },
            }}
            loading={this.state.authenticating}
          />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
              marginBottom: 20,
            }}
            onPress={() => this.redirectToTerms()}
          >
            <Text
              style={{
                color: Colors.LIGHT_GREY_COLOR,
                textDecorationLine: "underline",
              }}
            >
              Terms and conditions
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 30,
    paddingHorizontal: "6%",
  },
  text: {
    fontWeight: "bold",
    fontSize: 25,
  },
  subhead: {
    marginTop: 5,
    color: Colors.GREY_COLOR,
    fontSize: 15,
  },
  otpContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "22%",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  otpBox: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.PLACEHOLDER_COLOR,
    padding: 6,
    height: 50,
    color: Colors.PLACEHOLDER_COLOR,
    fontSize: 15,
    width: "14%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  note: {
    color: Colors.WHITE_COLOR,
    marginBottom: 25,
    fontSize: 10,
  },
  imgMobile: {
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
  },
});
