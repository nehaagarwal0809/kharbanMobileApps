import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  I18nManager,
  Alert,
} from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/colors/Colors";
import KharbanButton from "../../components/KharbanButton";
// import IconUser from "react-native-vector-icons/FontAwesome";
import IconCareer from "react-native-vector-icons/MaterialCommunityIcons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { standardPostApi } from "../../api/ApiWrapper";
import { DEV_WIDTH } from "../../constants/Device/DeviceDetails";
import IconDown from "react-native-vector-icons/dist/Entypo";
import RNPickerSelect from "react-native-picker-select";
import validate from "../../components/Validations/validate_wrapper";
import ErrorMessage from "../../components/ErrorMessage";
export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocusedI: false,
      isFocusedII: false,
      isFocusedIII: false,
      firstName: "",
      document_id: "",
      career_id: "",
      iban: "",
      loading: false,
      nameError: "",
      ibanError: "",
      idError: "",
      serviceTypeError: "",
      // isNext:true,
      servisList: [],
    };
    this.fetchPickerData();
  }
  fetchPickerData = async () => {
    try {
      const res = await standardPostApi("getCategoryList", undefined, {}, true);
      console.log(res);
      if (res.data.status == 200) {
        let DATA = [];
        let MAIN = [];
        DATA = res.data.result;
        DATA.forEach((element) => {
          MAIN.push({
            label:
              element.arabic_name != null
                ? element.label + " (" + element.arabic_name + ")"
                : element.label,
            value: element.value,
          });
        });
        this.setState({
          servisList: MAIN,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  checkNonEmpty = (text) => {
    console.log(text);
    if (!text.trim().length > 0) {
      this.setState({ loading: false });
      alert("Input fields can not be empty.");
      return false;
    } else {
      return true;
    }
  };

  registerUser = async () => {
    const { firstName, document_id, career_id, iban } = this.state;
    this.setState({ loading: true });
    const { navigation } = this.props;
    const signupData = navigation.getParam("userDetails");
    const nameError = validate("first_name", this.state.firstName);
    const idError = validate("id", this.state.document_id);
    // const ibanError = validate("iban", this.state.iban);
    const serviceTypeError = validate("service_type", this.state.career_id);
    console.log(signupData);
    if (nameError) {
      Alert.alert(nameError.toString());
      this.setState({ loading: false });
      return;
    }
    if (idError) {
      Alert.alert(idError.toString());
      this.setState({ loading: false });
      return;
    }
    // if (ibanError) {
    //   Alert.alert(ibanError.toString());
    //   this.setState({ loading: false });
    //   return;
    // }
    if (serviceTypeError) {
      Alert.alert(serviceTypeError.toString());
      this.setState({ loading: false });
      return;
    }

    if (
      this.checkNonEmpty(firstName) &&
      this.checkNonEmpty(document_id) &&
      this.checkNonEmpty(career_id)
    ) {
      this.props.navigation.navigate("UploadScreen", {
        userDetails: {
          first_name: firstName,
          otp: signupData.otp,
          contact_no: signupData.mobile,
          document_id: document_id,
          service_category_id: career_id,
          iban_no: iban,
          countryCode: signupData.countryCode,
        },
      });
      this.setState({ loading: false });
    }
  };
  render() {
    const { loading, isFocusedI, isFocusedII, isFocusedIII } = this.state;
    return (
      <Container>
        <ScrollView>
          <Image
            source={require("./img/signup.png")}
            style={{
              marginHorizontal: wp(10),
              height: 200,
              resizeMode: "contain",
              marginTop: hp(-1),
            }}
          />
          <View style={styles.container}>
            <Text style={styles.text}>New Account</Text>
            <Text style={styles.subhead}>Please complete your information</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: "8%",
              marginTop: 30,
            }}
          >
            {/* <IconUser name="user-o" color="#000" size={16} /> */}
            <Image
              source={require("./img/User.png")}
              style={styles.iconStyle}
            />
            <TextInput
              onChangeText={(text) =>
                this.setState({
                  firstName: text,
                  nameError: validate("name", text),
                })
              }
              selectionColor={Colors.PLACEHOLDER_COLOR}
              placeholderTextColor={Colors.PLACEHOLDER_COLOR}
              color={Colors.PLACEHOLDER_COLOR}
              placeholder="Enter Your Name"
              onFocus={() => this.setState({ isFocusedI: true })}
              onBlur={() => this.setState({ isFocusedI: false })}
              style={[
                styles.textinput,
                {
                  borderBottomColor: isFocusedI
                    ? Colors.BLACK_COLOR
                    : "#E3E6EB",
                },
              ]}
            />
          </View>
          {this.state.nameError.length > 0 && (
            <ErrorMessage text={this.state.nameError} />
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: "8%",
              marginTop: 25,
            }}
          >
            {/* <IconUser name="user-o" color="#000" size={16} /> */}
            <Image
              source={require("./img/IDCard.png")}
              style={styles.iconStyle}
            />
            <TextInput
              onChangeText={(text) =>
                this.setState({
                  document_id: text,
                  idError: validate("id", text),
                })
              }
              selectionColor={Colors.PLACEHOLDER_COLOR}
              placeholderTextColor={Colors.PLACEHOLDER_COLOR}
              color={Colors.PLACEHOLDER_COLOR}
              placeholder="ID Number"
              onFocus={() => this.setState({ isFocusedII: true })}
              onBlur={() => this.setState({ isFocusedII: false })}
              style={[
                styles.textinput,
                {
                  borderBottomColor: isFocusedII
                    ? Colors.BLACK_COLOR
                    : "#E3E6EB",
                },
              ]}
            />
          </View>
          {this.state.idError.length > 0 && (
            <ErrorMessage text={this.state.idError} />
          )}
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
              size={16}
            />
            <View style={[styles.selectInput]}>
              <RNPickerSelect
                onValueChange={(value) => {
                  console.log("career" + value);
                  this.setState({
                    career_id: value,
                    serviceTypeError: validate("service_type", value),
                  });
                }}
                items={this.state.servisList}
                Icon={() => {
                  return (
                    <IconDown
                      style={styles.chevron}
                      name="chevron-down"
                      size={24}
                    />
                  );
                }}
                style={{
                  inputIOS: { color: Colors.BLACK_COLOR, marginTop: 12 },
                  inputAndroid: { color: Colors.BLACK_COLOR },
                }}
                placeholder={{ label: "Choose Your Career" }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: "8%",
              marginTop: 25,
            }}
          >
            {/* <IconUser name="user-o" color="#000" size={16} /> */}
            <Image
              source={require("./img/iban.png")}
              style={styles.iconStyle}
            />
            <Text style={{ paddingHorizontal: 10 }}>IBAN (optional)</Text>
          </View>
          <View style={{ paddingLeft: "12%" }}>
            <TextInput
              onChangeText={(text) => {
                console.log("iban" + text);
                this.setState({
                  iban: text,
                  // ibanError: validate("iban", text),
                });
              }}
              selectionColor={Colors.PLACEHOLDER_COLOR}
              placeholderTextColor={Colors.PLACEHOLDER_COLOR}
              color={Colors.PLACEHOLDER_COLOR}
              placeholder="SA5478768787878787878787"
              onFocus={() => this.setState({ isFocusedIII: true })}
              onBlur={() => this.setState({ isFocusedIII: false })}
              style={[
                styles.textinput,
                {
                  borderBottomColor: isFocusedIII
                    ? Colors.BLACK_COLOR
                    : "#E3E6EB",
                },
              ]}
            />
          </View>
          {/* {this.state.ibanError.length > 0 && (
            <ErrorMessage text={this.state.ibanError} />
          )} */}
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
                this.registerUser();
              },
            }}
            buttonText="Next"
            buttonTextProps={{
              style: { color: Colors.BLACK_COLOR, fontWeight: "bold" },
            }}
            loading={loading}
          />
        </ScrollView>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    // alignItems:"center",
    marginTop: 10,
    paddingHorizontal: wp(10),
  },
  text: {
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: 45,
  },
  subhead: {
    color: Colors.GREY_COLOR,
    fontSize: 15,
    opacity: 0.6,
    lineHeight: 26,
  },
  textinput: {
    borderBottomWidth: 2,
    borderColor: "#E3E6EB",
    borderBottomColor: "#E3E6EB",
    height: 45,
    width: "88%",
    marginLeft: -15,
    marginRight: -15,
    paddingLeft: 25,
    paddingRight: 25,
    textAlign: I18nManager.isRTL ? "right" : "left",
    color: Colors.BLACK_COLOR,
  },
  selectInput: {
    borderBottomWidth: 2,
    borderColor: "#E3E6EB",
    borderBottomColor: "#E3E6EB",
    height: 45,
    width: "88%",
    marginLeft: -15,
    marginRight: -15,
    paddingLeft: 25,
    paddingRight: 25,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  iconStyle: {
    height: 15,
    width: 15,
    resizeMode: "contain",
  },
  chevron: {
    color: Colors.PLACEHOLDER_COLOR,
  },
  validation: {
    marginLeft: 20,
  },
});
