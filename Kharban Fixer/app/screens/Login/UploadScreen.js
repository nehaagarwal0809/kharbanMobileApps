import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  I18nManager,
  ScrollView,
  ActivityIndicator,
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
import IconUpload from "react-native-vector-icons/Octicons";
import * as ImagePicker from "react-native-image-picker";
import { Toaster } from "../../components/Toaster";

export default class UploadScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      servisList: [],
      loaderI: false,
      loaderII: false,
      loaderIII: false,
      responseprofile: null,
      responseid: null,
      responseiban: null,
      responseprofileuri: null,
      responseiduri: null,
      responseibanuri: null,
      profile_extension: "",
      id_extension: "",
      iban_extension: "",
    };
  }

  checkNonEmpty = (text) => {
    if (!text.trim().length > 0) {
      this.setState({ loading: false });
      alert("Please upload required document before proceed!!");
      return false;
    } else {
      return true;
    }
  };
  registerUser = async () => {
    const {
      responseprofile,
      responseid,
      responseiban,
      profile_extension,
      id_extension,
      iban_extension,
    } = this.state;
    this.setState({ loading: true });
    const { navigation } = this.props;
    const signupData = navigation.getParam("userDetails");
    console.log("from upload@@@@", signupData);
    if (responseprofile && responseid) {
      this.props.navigation.navigate("TnCScreen", {
        userDetails: {
          first_name: signupData.first_name,
          otp: signupData.otp,
          contact_no: signupData.contact_no,
          document_id: signupData.document_id,
          service_category_id: signupData.service_category_id,
          iban_no: signupData.iban_no,
          profile_picture: responseprofile,
          profile_extension: profile_extension,
          document_image: responseid,
          document_extension: id_extension,
          iban_image: responseiban,
          iban_extension: iban_extension,
          promptAcceptTerms: true,
          country_code: signupData.countryCode,
        },
      });
    } else {
      this.setState({ loading: false });
      alert("Please upload required document before proceeding!!");
    }
    this.setState({ loading: false });
  };

  selectProfileImage = () => {
    return Alert.alert(
      "Choose a profile image",
      "Please choose from below options.",
      [
        { text: "Cancel" },
        {
          text: "Open Camera",
          onPress: () => this.pickProfileFromCamera(),
        },
        {
          text: "Open Gallery",
          onPress: () => this.chooseProfile(),
        },
      ]
    );
  };

  selectIdAlert = () => {
    return Alert.alert(
      "Choose an ID image",
      "Please choose from below options.",
      [
        { text: "Cancel" },
        {
          text: "Open Camera",
          onPress: () => this.pickIdFromCamera(),
        },
        {
          text: "Open Gallery",
          onPress: () => this.chooseId(),
        },
      ]
    );
  };

  selectIbanAlert = () => {
    return Alert.alert(
      "Choose your IBAN image",
      "Please choose from below options.",
      [
        { text: "Cancel" },
        {
          text: "Open Camera",
          onPress: () => this.pickIbanFromCamera(),
        },
        {
          text: "Open Gallery",
          onPress: () => this.chooseIban(),
        },
      ]
    );
  };

  chooseId = async () => {
    this.setState({ loaderI: true });
    await ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: true,
        maxHeight: 800,
        maxWidth: 800,
        quality: 1,
      },
      (response) => {
        console.log(response);
        if (response.didCancel) {
          this.setState({ loaderI: false });
          // this.setState({response:null})
        } else if (response.type == "image/gif") {
          Toaster("This file type is not supported", Colors.LIGHT_RED);
        } else {
          this.setState({ loaderI: false });
          this.setState({ responseiduri: response });
          this.setState({ responseid: response.base64 });
          this.state.id_extension = this.gettingExtension(response.fileName);
        }
      }
    );
  };

  pickIdFromCamera = async () => {
    this.setState({ loaderI: true });
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
          this.setState({ loaderI: false });
        } else {
          this.setState({ loaderI: false });
          this.setState({ responseiduri: response });
          this.setState({ responseid: response.base64 });
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

  chooseProfile = async () => {
    this.setState({ loaderII: true });
    await ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: true,
        maxHeight: 800,
        maxWidth: 800,
        quality: 1,
      },
      (response) => {
        console.log(response);
        if (response.didCancel) {
          this.setState({ loaderII: false });
          // this.setState({responseprofile:null})
        } else if (response.type == "image/gif") {
          Toaster("This file type is not supported", Colors.LIGHT_RED);
        } else {
          this.setState({ loaderII: false });
          this.setState({ responseprofileuri: response });
          this.setState({ responseprofile: response.base64 });
          this.state.profile_extension = this.gettingExtension(
            response.fileName
          );
        }
      }
    );
  };

  pickProfileFromCamera = async () => {
    this.setState({ loaderII: true });
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
          this.setState({ loaderII: false });
        } else {
          this.setState({ loaderII: false });
          this.setState({ responseprofileuri: response });
          this.setState({ responseprofile: response.base64 });
          this.state.profile_extension = this.gettingExtension(
            response.fileName
          );
        }
      }
    );
  };

  chooseIban = async () => {
    this.setState({ loaderIII: true });
    await ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: true,
        maxHeight: 800,
        maxWidth: 800,
        quality: 1,
      },
      (response) => {
        console.log(response);
        if (response.didCancel) {
          this.setState({ loaderIII: false });
          // this.setState({response:null})
        } else if (response.type == "image/gif") {
          Toaster("This file type is not supported", Colors.LIGHT_RED);
        } else {
          this.setState({ loaderIII: false });
          this.setState({ responseibanuri: response });
          this.setState({ responseiban: response.base64 });
          this.state.iban_extension = this.gettingExtension(response.fileName);
        }
      }
    );
  };

  pickIbanFromCamera = async () => {
    this.setState({ loaderIII: true });
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
          this.setState({ loaderIII: false });
        } else {
          this.setState({ loaderIII: false });
          this.setState({ responseibanuri: response });
          this.setState({ responseiban: response.base64 });
          this.state.iban_extension = this.gettingExtension(response.fileName);
        }
      }
    );
  };

  render() {
    const { loading } = this.state;
    return (
      <Container>
        <ScrollView style={{ paddingTop: 10, marginBottom: 20 }}>
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
          <View style={styles.mainDiv}>
            <View>
              {this.state.responseprofileuri ? (
                <View>
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                    source={{ uri: this.state.responseprofileuri.uri }}
                  />
                </View>
              ) : (
                <Image source={require("./img/upload_profile.png")} />
              )}
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontSize: 15, color: Colors.BLACK_COLOR }}>
                Profile Picture
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.PLACEHOLDER_COLOR,
                  opacity: 0.7,
                  marginTop: 2,
                }}
              >
                Please upload your profile picture{" "}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                // onPress={() => this.resendOtp()}
                onPress={() => this.selectProfileImage()}
              >
                {this.state.loaderII ? (
                  <ActivityIndicator color={Colors.YELLOW_COLOR} size="small" />
                ) : (
                  <IconUpload
                    name={"cloud-upload"}
                    size={28}
                    color={Colors.LIGHT_YELLOW_COLOR}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.mainDiv}>
            <View>
              {this.state.responseiduri ? (
                <View>
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                    source={{ uri: this.state.responseiduri.uri }}
                  />
                </View>
              ) : (
                <Image source={require("./img/upload_id.png")} />
              )}
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontSize: 15, color: Colors.BLACK_COLOR }}>
                Upload ID
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.PLACEHOLDER_COLOR,
                  opacity: 0.7,
                  marginTop: 2,
                }}
              >
                Please upload your ID{" "}
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => this.selectIdAlert()}>
                {this.state.loaderI ? (
                  <ActivityIndicator color={Colors.YELLOW_COLOR} size="small" />
                ) : (
                  <IconUpload
                    name={"cloud-upload"}
                    size={28}
                    color={Colors.LIGHT_YELLOW_COLOR}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.mainDiv}>
            <View>
              {this.state.responseibanuri ? (
                <View>
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                    source={{ uri: this.state.responseibanuri.uri }}
                  />
                </View>
              ) : (
                <Image source={require("./img/upload_bank.png")} />
              )}
            </View>
            <View style={{ flexDirection: "column" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 15, color: Colors.BLACK_COLOR }}>
                  Upload IBAN
                </Text>
                <Text
                  style={{
                    color: Colors.PLACEHOLDER_COLOR,
                    fontSize: 10,
                    marginLeft: 2,
                  }}
                >
                  Optional
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.PLACEHOLDER_COLOR,
                  opacity: 0.7,
                  marginTop: 2,
                }}
              >
                Please upload your IBAN{" "}
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => this.selectIbanAlert()}>
                {this.state.loaderIII ? (
                  <ActivityIndicator color={Colors.YELLOW_COLOR} size="small" />
                ) : (
                  <IconUpload
                    name={"cloud-upload"}
                    size={28}
                    color={Colors.LIGHT_YELLOW_COLOR}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <KharbanButton
            buttonProps={{
              style: {
                width: 280,
                marginTop: 60,
                alignSelf: "center",
                backgroundColor: Colors.YELLOW_COLOR,
                marginBottom: 30,
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
            // indiColor={Colors.BLACK_COLOR}
          />
        </ScrollView>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
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
  mainDiv: {
    flexDirection: "row",
    borderColor: "#EDEDEB",
    borderWidth: 1,
    marginHorizontal: wp(10),
    borderRadius: 10,
    padding: 12,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    marginVertical: 24,
    alignItems: "center",
  },
});
