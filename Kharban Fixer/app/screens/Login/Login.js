import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/colors/Colors";
import KharbanButton from "../../components/KharbanButton";
import { standardPostApi } from "../../api/ApiWrapper";
import { Toaster } from "../../components/Toaster";
import { DEV_WIDTH } from "../../constants/Device/DeviceDetails";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import RNPickerSelect from "react-native-picker-select";
import Loader from "../../components/Loader";
import validate from "../../components/Validations/validate_wrapper";
import ErrorMessage from "../../components/ErrorMessage";

function allEqual(input) {
  return input.split("").every((char) => char === input[0]);
}

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      isVerified: false,
      fetchingOtp: false,
      country_code: "",
      flagImg: "",
      countryList: [],
      mobileError: "",
    };
  }

  getOtp = async () => {
    const { mobile, country_code } = this.state;
    const mobileError = validate("mobile", this.state.mobile);
    // if (country_code == "") {
    //   Toaster("Please choose a country code to proceed.", Colors.LIGHT_RED);
    //   return;
    // }
    if (mobileError) {
      Alert.alert(mobileError.toString());
      return;
    }
    if (allEqual(this.state.mobile)) {
      Toaster("Please enter a valid mobile number.", Colors.LIGHT_RED);
      return;
    }

    if (mobile.trim().length >= 6 && mobile.trim().length < 20) {
      this.setState({ fetchingOtp: true });
      try {
        const res = await standardPostApi(
          "Getotp",
          undefined,
          {
            contact_no: this.state.mobile,
            country_code:
              this.state.country_code == null
                ? "+966"
                : this.state.country_code,
            requesttype: "provider",
          },
          true,
          false
        );
        if (res.data.status == 200) {
          this.setState({ fetchingOtp: false });
          let isRegistered = res.data.isregistered;
          let isApproved = res.data.approved_status;
          if (res.data.usertype == "C") {
            Toaster(
              "This mobile no. is already registered with customer.",
              Colors.LIGHT_RED
            );
          } else {
            this.props.navigation.navigate("OTPScreen", {
              otpData: {
                otp: res.data.otp,
                userId: res.data.userid,
                mobile: this.state.mobile,
                isregistered: isRegistered,
                countryCode: this.state.country_code,
                approved_status: isApproved,
              },
            });
          }
        } else if (res.data.status == 400) {
          Toaster(
            "You have selected an incorrect country code to login, Kindly use a correct country code.",
            Colors.LIGHT_RED
          );
          // Toaster(
          //   "This mobile no. is already registered with customer.",
          //   Colors.LIGHT_RED
          // );
        }
      } catch (error) {
        console.log("ERRR" + error);
      }
      this.setState({ fetchingOtp: false });
    } else {
      Toaster(
        "Please enter a Mobile number in correct format.",
        Colors.LIGHT_RED
      );
    }
  };

  redirectToTerms = () => {
    this.props.navigation.navigate("TnCScreen");
  };

  onChangeText = async (text) => {
    let phone = text.replace(/[^0-9]/g, "");
    await this.setState({
      mobile: phone,
      mobileError: validate("mobile", text),
    });
  };

  refreshCountry = async (item) => {
    console.log(" item ", item);
    if (item !== "") {
      this.setState({
        country_code: item.country_code,
        flagImg: item.country_flag_icon,
      });
    }
  };

  render() {
    return (
      <Container>
        <ScrollView style={{ flex: 1 }}>
          <Image source={require("./img/mobile.png")} style={styles.mobImg} />
          <View style={styles.container}>
            <Text style={styles.text}>Welcome</Text>
            <Text style={styles.subhead}>
              Please Enter the mobile number to complete registration
            </Text>

            <View style={styles.inputView}>
              <TouchableOpacity
                style={styles.imgsRow}
                onPress={() =>
                  this.props.navigation.navigate("CountryModal", {
                    refreshFunc: (country) => this.refreshCountry(country),
                  })
                }
              >
                {this.state.flagImg == "" && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={styles.flag}
                      source={require("./img/flag-default.png")}
                    />
                    <Image
                      style={{ marginHorizontal: 1 }}
                      source={require("./img/arrow.png")}
                    />
                    <Text style={{ color: Colors.BLACK_COLOR }}>+966</Text>
                  </View>
                )}
                {this.state.flagImg != "" && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={styles.flag}
                      source={{ uri: this.state.flagImg }}
                    />
                    <Image
                      style={{ marginHorizontal: 1 }}
                      source={require("./img/arrow.png")}
                    />
                    <Text style={{ color: Colors.BLACK_COLOR }}>
                      {this.state.country_code}
                    </Text>
                  </View>
                )}

                {/* {this.state.flagImg.length > 0 && (
                    <Image
                      source={{ uri: this.state.flagImg }}
                      style={styles.flag}
                    />
                  )} */}

                {/* <RNPickerSelect
                    onValueChange={async (value, index) => {
                      if (index == 0) {
                        await this.setState({
                          country_code: null,
                          flagImg: "",
                        });
                      }
                      if (index >= 1) {
                        await this.setState({
                          country_code: value[0],
                          flagImg: value[1],
                        });
                      }
                    }}
                    items={this.state.countryList}
                    style={{
                      viewContainer: styles.countryPicker,
                      inputAndroid: styles.pickerLabels,
                      inputIOS: styles.pickerLabels,
                      inputAndroidContainer: { height: 45 },
                    }}
                    placeholder={{
                      label: "Select a Country Code",
                      inputLabel: "+966",
                    }}
                    useNativeAndroidPickerStyle={false}
                  /> */}
              </TouchableOpacity>

              <View style={styles.mobileView}>
                <Image source={require("./img/call.png")} />
                <TextInput
                  maxLength={20}
                  returnKeyType="done"
                  keyboardType="number-pad"
                  textContentType="telephoneNumber"
                  placeholder="5 2 7 8 8 7 7 6"
                  placeholderTextColor="rgba(149,149,149,1)"
                  style={styles.inputfield}
                  onChangeText={async (text) => this.onChangeText(text)}
                  value={this.state.mobile}
                />
                {/* {this.state.mobileError.length > 0 && (
                    <ErrorMessage text={this.state.mobileError} />
                  )} */}
              </View>
            </View>
          </View>
          <View>
            <KharbanButton
              buttonProps={{
                style: styles.nextBtn,
                onPress: () => {
                  this.getOtp();
                },
              }}
              buttonText="Next"
              buttonTextProps={{
                style: { color: Colors.BLACK_COLOR },
              }}
              loading={this.state.fetchingOtp}
            />
            <TouchableOpacity
              style={styles.tncButton}
              onPress={() => this.redirectToTerms()}
            >
              <Text style={styles.tncText}>Terms and conditions</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 45,
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
    marginBottom: 15,
  },
  tncButton: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginVertical: 15,
  },
  tncText: {
    color: Colors.LIGHT_GREY_COLOR,
    textDecorationLine: "underline",
  },
  mobImg: {
    height: 200,
    resizeMode: "contain",
    marginTop: 0,
    alignSelf: "center",
  },
  nextBtn: {
    width: DEV_WIDTH / 1.4,
    alignSelf: "center",
    backgroundColor: Colors.YELLOW_COLOR,
    marginVertical: 30,
  },
  countryPicker: {
    fontSize: 16,
    width: wp(12),
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  inputfield: {
    // fontFamily: RB_REGULAR,
    color: Colors.BLACK_COLOR,
    borderBottomColor: "#E3E6EB",
    borderBottomWidth: 1,
    fontSize: 16,
    height: 45,
    marginLeft: -15,
    marginRight: -15,
    paddingLeft: 20,
    paddingRight: 20,
    width: wp(63),
  },
  inputView: {
    // fontFamily: RB_REGULAR,
    color: "#121212",
    flexDirection: "row",
    alignItems: "center",
  },
  mobileView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    height: 17,
    width: 22,
    resizeMode: "contain",
    marginHorizontal: 3,
  },
  imgsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E3E6EB",
    borderBottomWidth: 1,
    marginRight: 10,
    height: 45,
  },
  pickerLabels: {
    color: Colors.BLACK_COLOR,
    // fontFamily: RB_REGULAR,
    fontSize: 16,
  },
});
