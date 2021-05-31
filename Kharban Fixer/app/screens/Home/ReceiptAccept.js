import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Mapstyle from "./assets/MapStyle.json";
import { DEV_HEIGHT, DEV_WIDTH } from "../../constants/Device/DeviceDetails";
import { Colors } from "../../constants/colors/Colors";
import KharbanButton from "../../components/KharbanButton";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationActions, StackActions } from "react-navigation";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = "AIzaSyDfujfLdGzG-pWG0VGe4agzS80EKAhP4gU";
export default class ReceiptAccept extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  goBack() {
    const { navigation } = this.props;
  }
  async backToHome() {
    this.props.navigation.navigate("Home");
    // StackActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({
    //       routeName: "Home",
    //       params: {},
    //     }),
    //   ],
    // });
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={Mapstyle}
          loadingEnabled={true}
          zoomEnabled
          mapType="standard"
        ></MapView>

        {/* <SafeAreaView style={{ position: "absolute" }}>
          <TouchableOpacity
            style={{ paddingTop: "10%", paddingHorizontal: "12%" }}
            onPress={() => this.goBack()}
          >
            <Icon
              name="keyboard-backspace"
              size={28}
              color={Colors.BLACK_COLOR}
            />
          </TouchableOpacity>
        </SafeAreaView> */}

        <View style={[styles.jobRequest, { height: (3 * DEV_HEIGHT) / 4.2 }]}>
          {/* <ScrollView> */}
          <View style={{ flex: 1, justifyContent: "space-evenly" }}>
            <View>
              <View>
                <Image
                  source={require("./assets/img/receipt_accept.png")}
                  resizeMode="contain"
                  style={{ width: 100, height: 100, alignSelf: "center" }}
                />
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text
                  style={{ fontSize: 22, lineHeight: 32, fontWeight: "bold" }}
                >
                  Receipt Approved
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 28,
                    color: Colors.GREY_COLOR,
                    opacity: 0.6,
                  }}
                >
                  the service amount has been paid
                </Text>
              </View>
            </View>
            <KharbanButton
              buttonProps={{
                style: {
                  width: DEV_WIDTH / 1.2,
                  marginVertical: 25,
                  alignSelf: "center",
                  backgroundColor: Colors.YELLOW_COLOR,
                },
                onPress: () => {
                  this.backToHome();
                },
              }}
              buttonText="Back To Home"
              buttonTextProps={{
                style: {
                  fontSize: 13,
                  color: Colors.BLACK_COLOR,
                  fontWeight: "bold",
                },
              }}
            />
          </View>
          {/* </ScrollView> */}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  map: {
    height: (2 * DEV_HEIGHT) / 4,
  },
  jobRequest: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%",
    backgroundColor: Colors.WHITE_COLOR,

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: "#EDEDEB",
  },
  mainDiv: {
    flexDirection: "row",
    borderColor: "#EDEDEB",
    borderWidth: 1,
    marginHorizontal: "7%",
    borderRadius: 10,
    padding: 14,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
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
  servicelogo: {
    width: 47,
    height: 47,
    borderRadius: 50,
    borderColor: Colors.YELLOW_COLOR,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "3%",
  },

  distance: {
    fontSize: 12,
    color: Colors.OFF_WHITE,
  },
  desc: {
    fontSize: 15,
    color: Colors.BLACK_COLOR,
    marginTop: 10,
  },
  hr: {
    borderColor: "#EDEDEB",
    borderWidth: 1,
    height: 45,
  },
  buttons: {
    backgroundColor: Colors.BLACK_COLOR,
    borderRadius: 10,
    width: 158,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgb(5,5,3)",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 3,
      width: 0,
    },
    // elevation: 10,
  },
  buttonText: {
    color: Colors.WHITE_COLOR,
    fontWeight: "bold",
    fontSize: 14,
    // textAlign: "center",
  },
  selectInput: {
    borderBottomWidth: 2,
    borderColor: "#E3E6EB",
    borderBottomColor: "#E3E6EB",
    height: 45,
    width: "96%",
    marginLeft: -15,
    marginRight: -15,
    paddingLeft: 25,
    paddingRight: 25,
    textAlign: "left",
  },

  chevron: {
    color: Colors.PLACEHOLDER_COLOR,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "8%",
    marginTop: 25,
  },
  iconStyle: {
    height: 18,
    width: 12,
    resizeMode: "contain",
  },
  textAreaContainer: {
    borderBottomWidth: 2,
    borderColor: "#E3E6EB",
    borderBottomColor: "#E3E6EB",
    padding: 5,
    marginLeft: "8%",
    width: "80%",
    marginTop: 25,
  },
  textArea: {
    height: 100,
    justifyContent: "flex-start",
  },
});
