import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  I18nManager,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { standardPostApi } from "../../api/ApiWrapper";
import CrossContainer from "../../components/CrossContainer";
import { Colors } from "../../constants/colors/Colors";
import { DEV_WIDTH } from "../../constants/Device/DeviceDetails";
import IconCareer from "react-native-vector-icons/MaterialCommunityIcons";
import IconDown from "react-native-vector-icons/dist/Entypo";
import RNPickerSelect from "react-native-picker-select";
import KharbanButton from "../../components/KharbanButton";
import * as ImagePicker from "react-native-image-picker";
import validate from "../../components/Validations/validate_wrapper";
import Icon from "react-native-vector-icons/FontAwesome";
import { Toaster } from "../../components/Toaster";
const EMAIL = "help@kharban.net";
export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocusedI: false,
      isFocusedII: false,
      isFocusedIII: false,
      providerID: "",
      name: "",
      user_img: "",
      mobile: "",
      mobileError: "",
      service_type: "",
      serviceTypeError: "",
      iban: "",
      ibanError: "",
      responseprofile: "",
      loading: false,
      serviceList: [],
      countryCode: "",
      earnings: 0,
      subject: "",
    };
  }
  async componentDidMount() {
    await this.fetchPickerData();
    await this.getUserProfile();
  }

  fetchPickerData = async () => {
    try {
      const res = await standardPostApi("getCategoryList", undefined, {}, true);
      console.log(res);
      if (res.data.status == 200) {
        this.setState({
          serviceList: res.data.result,
        });
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
      console.log("getUserProfile ==> ", res);
      if (res.data.status == 200) {
        let data = res.data.result;
        this.setState({
          user_profile: data,
          providerID: data.id,
          name: data.first_name,
          user_img: data.profile_picture,
          mobile: data.contact_no,
          service_type: data.service_category_id,
          iban: data.iban_no,
          countryCode: data.country_code ? data.country_code : "",
          earnings: data.TotalEarning ? data.TotalEarning : 0,
        });
        console.log("profile ", this.state.user_profile);
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
  };

  selectImageAlert = () => {
    return Alert.alert(
      "Choose a profile image",
      "Please choose from below options.",
      [
        { text: "Cancel" },
        {
          text: "Open Camera",
          onPress: () => this.pickFromCamera(),
        },
        {
          text: "Open Gallery",
          onPress: () => this.chooseId(),
        },
      ]
    );
  };

  chooseId = async () => {
    await ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: true,
        maxHeight: 800,
        maxWidth: 800,
        quality: 1,
      },
      (response) => {
        console.log(" image re ==> ", response);
        if (response.didCancel) {
        } else if (response.type == "image/gif") {
          Toaster("This file type is not supported", Colors.LIGHT_RED);
        } else {
          this.setState({ user_img: response.uri });
          this.setState({ responseprofile: response.base64 });
          this.state.id_extension = this.gettingExtension(response.fileName);
        }
      }
    );
  };

  pickFromCamera = async () => {
    await ImagePicker.launchCamera(
      {
        mediaType: "photo",
        includeBase64: true,
        maxHeight: 800,
        maxWidth: 800,
        quality: 1,
      },
      (response) => {
        console.log(" camera res ==> ", response);
        if (response.didCancel) {
        } else {
          this.setState({ user_img: response.uri });
          this.setState({ responseprofile: response.base64 });
          this.state.id_extension = this.gettingExtension(response.fileName);
        }
      }
    );
  };

  gettingExtension = (str) => {
    var ext;
    ext = str.substr(str.indexOf(".") + 1);
    return ext;
  };

  updateUserProfile = async () => {
    console.log("update profile call");
    // const mobileError = validate('mobile', this.state.mobile);
    const serviceTypeError = validate("service_type", this.state.service_type);
    const ibanError = validate("iban", this.state.iban);

    this.setState({
      // mobileError: mobileError,
      serviceTypeError: serviceTypeError,
      ibanError: ibanError,
    });

    if (serviceTypeError || ibanError) {
      alert("Please fill all fields");
    } else {
      console.log("update profile in else");
      const { user_profile } = this.state;

      const postData = {
        first_name: user_profile.first_name,
        otp: user_profile.otp,
        country_code:
          user_profile && user_profile.country_code
            ? user_profile.country_code
            : "",
        contact_no: this.state.mobile,
        document_id: user_profile.document_id,
        service_category_id: this.state.service_type,
        iban_no: this.state.iban,
        image: this.state.responseprofile
          ? this.state.responseprofile
          : this.state.user_img,
        image_extension: this.state.id_extension,
        document_image: user_profile.document_image,
        document_extension: user_profile.document_extension,
        iban_image: user_profile.iban_image,
        iban_extension: user_profile.iban_extension,
        is_tc_checked: user_profile.is_tc_checked,
      };

      console.log("update postData ==> ", postData);

      const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
      try {
        const res = await standardPostApi(
          "updateProviderInformation",
          { Authorization: "Bearer " + TOKEN },
          postData,
          true,
          false
        );
        console.log("update details ==> ", res);
        if (res.data.status == 200) {
          Toaster(
            "Profile Updated Successfully.",
            Colors.YELLOW_COLOR,
            "#000000"
          );
        }
      } catch (error) {
        console.log("ERRR" + error);
      }
    }
  };

  render() {
    const {
      loading,
      isFocusedI,
      isFocusedII,
      isFocusedIII,
      earnings,
    } = this.state;
    return (
      <CrossContainer
        isScroll
        onCrossPress={() => this.props.navigation.goBack()}
      >
        <View style={{ paddingHorizontal: 29 }}>
          <View style={styles.profileRow}>
            <TouchableOpacity onPress={() => this.selectImageAlert()}>
              <Image
                style={styles.userImg}
                source={
                  this.state.user_img
                    ? { uri: this.state.user_img }
                    : require("../Home/assets/img/user_1.png")
                }
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.welcomeTxt}>{earnings + " SAR"}</Text>
              <Text style={styles.userNameTxt}>
                {this.state.name ? this.state.name : "No name"}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: "8%",
                marginTop: 25,
              }}
            >
              <Icon name="phone" size={24} color="#000" />
              <Text style={{ paddingHorizontal: 10 }}>Mobile Number</Text>
            </View>
            <View style={{ paddingLeft: "12%" }}>
              <TextInput
                onChangeText={(mobile) => {
                  this.setState({
                    mobile: mobile,
                    mobileError: validate("mobile", mobile),
                  });
                }}
                selectionColor={Colors.PLACEHOLDER_COLOR}
                placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                color={Colors.PLACEHOLDER_COLOR}
                value={this.state.countryCode + " " + this.state.mobile}
                placeholder="Mobile Number"
                editable={false}
                placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                onFocus={() => this.setState({ isFocusedI: true })}
                onBlur={() => this.setState({ isFocusedI: false })}
                style={[
                  styles.textinput,
                  {
                    borderBottomColor: isFocusedI
                      ? Colors.BLACK_COLOR
                      : "#E3E6EB",
                    fontSize: 18,
                    color: "#000",
                    backgroundColor: "#efefef",
                  },
                ]}
              />
              {this.state.mobileError.length > 0 && (
                <Text style={{ color: "red", marginHorizontal: -15 }}>
                  {this.state.mobileError}
                </Text>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: "8%",
                marginTop: 25,
              }}
            >
              <IconCareer
                name="briefcase-variant-outline"
                color="#000"
                size={20}
              />
              <Text style={{ paddingHorizontal: 10 }}>Service Type</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: "12%",
              }}
            >
              <View style={[styles.selectInput]}>
                <RNPickerSelect
                  onValueChange={(value) => {
                    this.setState({
                      service_type: value,
                      serviceTypeError: validate("service_type", value),
                    });
                  }}
                  items={this.state.serviceList}
                  Icon={() => {
                    return (
                      <View style={{ marginTop: 10 }}>
                        <IconDown
                          style={styles.chevron}
                          name="chevron-down"
                          size={24}
                        />
                      </View>
                    );
                  }}
                  value={this.state.service_type}
                  style={{
                    inputIOS: { color: "#000", marginTop: 12, fontSize: 18 },
                    inputAndroid: {
                      color: "#000",
                    },
                  }}
                  placeholder={{ label: "Service Type" }}
                />
              </View>
            </View>
            {this.state.serviceTypeError.length > 0 && (
              <Text style={{ color: "red", marginHorizontal: 20 }}>
                {this.state.serviceTypeError}
              </Text>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: "8%",
                marginTop: 25,
              }}
            >
              <Image
                source={require("../Home/assets/img/iban.png")}
                style={styles.iconStyle}
              />
              <Text style={{ paddingHorizontal: 10 }}>Iban No</Text>
            </View>
            <View style={{ paddingLeft: "12%" }}>
              <TextInput
                onChangeText={(iban) => {
                  this.setState({
                    iban: iban,
                    ibanError: validate("iban", iban),
                  });
                }}
                selectionColor={Colors.PLACEHOLDER_COLOR}
                placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                color={Colors.PLACEHOLDER_COLOR}
                value={this.state.iban}
                placeholder="SA5478768787878787878787"
                placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                onFocus={() => this.setState({ isFocusedIII: true })}
                onBlur={() => this.setState({ isFocusedIII: false })}
                style={[
                  styles.textinput,
                  {
                    borderBottomColor: isFocusedIII
                      ? Colors.BLACK_COLOR
                      : "#E3E6EB",
                    fontSize: 18,
                    color: "#000",
                  },
                ]}
              />
              {this.state.ibanError.length > 0 && (
                <Text style={{ color: "red", marginHorizontal: -15 }}>
                  {this.state.ibanError}
                </Text>
              )}
            </View>
            <KharbanButton
              buttonProps={{
                style: {
                  width: DEV_WIDTH / 1.4,
                  marginVertical: 25,
                  alignSelf: "center",
                  backgroundColor: Colors.YELLOW_COLOR,
                  marginBottom: 50,
                },
                onPress: () => {
                  Alert.alert(
                    "Alert",
                    "You have to mail the admin to update any field.",
                    [
                      { text: "Cancel" },
                      {
                        text: "Email",
                        onPress: () =>
                          Linking.openURL(
                            `mailto:${EMAIL}?subject=Update the following information of Fixer with mobil no.${
                              this.state.countryCode + "" + this.state.mobile
                            }`
                          ),
                      },
                    ]
                  );

                  // this.updateUserProfile();
                },
              }}
              buttonText="Email"
              buttonTextProps={{
                style: { color: Colors.BLACK_COLOR, fontWeight: "bold" },
              }}
              loading={loading}
            />
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
    height: 18,
    width: 18,
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
  textinput: {
    borderBottomWidth: 2,
    borderColor: "#E3E6EB",
    borderBottomColor: "#E3E6EB",
    height: 45,
    width: "88%",
    marginLeft: -15,
    marginRight: -15,

    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  selectInput: {
    borderBottomWidth: 2,
    borderColor: "#E3E6EB",
    borderBottomColor: "#E3E6EB",
    height: 45,
    width: "88%",
    marginLeft: -15,
    marginRight: -15,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  iconStyle: {
    height: 15,
    width: 15,
    resizeMode: "contain",
  },
});
