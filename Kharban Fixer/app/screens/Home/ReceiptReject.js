import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Mapstyle from "./assets/MapStyle.json";
import { DEV_HEIGHT, DEV_WIDTH } from "../../constants/Device/DeviceDetails";
import { Colors } from "../../constants/colors/Colors";
import KharbanButton from "../../components/KharbanButton";
import { standardPostApi } from "../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationActions, StackActions } from "react-navigation";
import Spinnner from "../../components/Spinner";
import validate from "../../components/Validations/validate_wrapper";
import IconCareer from "react-native-vector-icons/MaterialCommunityIcons";
import RNPickerSelect from "react-native-picker-select";
import IconDown from "react-native-vector-icons/dist/Entypo";

const KEYBOARD_VIEW = Platform.OS === "ios" ? KeyboardAvoidingView : View;

export default class ReceiptReject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingId: "",
      count: 0,
      isCreateAgain: false,
      fetchingReceiptResponse: false,
      job_status: "",
      price: "",
      job_description: "",
      priceError: "",
      authenticating: false,
      completing: false,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const __data = navigation.dangerouslyGetParent().state.routes[0].params;
    const active_requests = navigation.getParam("data");
    const DATA = active_requests || (__data && __data);
    await this.setState({
      bookingId: DATA.booking_id,
      count: DATA.receipt_reject_count,
    });
    console.log("received via notofication ", DATA);
  }

  createReceiptAgain() {
    this.setState({ isCreateAgain: true });
  }

  createReceipt = async () => {
    const { job_status, price, desc, bookingId } = this.state;

    const jobStatusError = validate("job_status", job_status);
    const priceError = validate("price", price);

    this.setState({
      jobStatusError: jobStatusError,
      priceError: priceError,
    });

    if (jobStatusError || priceError) {
      alert("Please fill all required fields");
    } else {
      const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
      try {
        this.setState({ authenticating: true });
        const res = await standardPostApi(
          "generateReceipt",
          { Authorization: "Bearer " + TOKEN },
          {
            booking_id: bookingId,
            receipt_amount: price,
            provider_receipt_description: desc,
          },
          true,
          false
        );
        console.log("getReceipt ", res);
        if (res.data.status == 200) {
          this.setState({ fetchingReceiptResponse: true });
        } else {
          alert("Receipt can not be generated at this moment!!");
        }
      } catch (error) {
        console.log("ERRR" + error);
      }
      this.setState({ authenticating: false });
    }
  };

  async completeByProvider() {
    this.setState({ completing: true });
    const { bookingId, completing } = this.state;
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      const res = await standardPostApi(
        "completeByProvider",
        { Authorization: "Bearer " + TOKEN },
        {
          booking_id: bookingId,
        },
        true,
        false
      );
      console.log("getReceipt ", res);
      if (res.data.status == 200) {
        Alert.alert("Complete Job", res.data.msg, [
          { text: "Cancel" },
          {
            text: "Yes",
            onPress: () => {
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
            },
          },
        ]);
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
    this.setState({ completing: false });
  }
  componentWillUnmount() {
    this.setState({ authenticating: false });
  }

  render() {
    const {
      isCreateAgain,
      bookingId,
      count,
      fetchingReceiptResponse,
    } = this.state;
    return (
      <KEYBOARD_VIEW
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
        }}
        behavior="padding"
      >
        <View style={{ flex: 1 }}>
          <Spinnner
            loaderTxt={"Waiting for Response from customer"}
            visible={fetchingReceiptResponse}
          />
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            customMapStyle={Mapstyle}
            loadingEnabled={true}
            zoomEnabled
            mapType="standard"
          ></MapView>
          <View style={[styles.jobRequest, { height: (3 * DEV_HEIGHT) / 4.2 }]}>
            {!isCreateAgain && (
              <View style={{ flex: 1, justifyContent: "space-evenly" }}>
                <View>
                  <View style={{ marginTop: "8%" }}>
                    <Image
                      source={require("./assets/img/receipt_reject.png")}
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
                      style={{
                        fontSize: 22,
                        lineHeight: 32,
                        fontWeight: "bold",
                      }}
                    >
                      Receipt Rejected
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 28,
                        color: Colors.GREY_COLOR,
                        opacity: 0.6,
                      }}
                    >
                      unfortunately receipt has been rejected
                    </Text>
                  </View>
                </View>
                <View>
                  {count != 2 && (
                    <KharbanButton
                      buttonProps={{
                        style: {
                          width: DEV_WIDTH / 1.2,
                          marginVertical: 25,
                          alignSelf: "center",
                          backgroundColor: Colors.YELLOW_COLOR,
                        },
                        onPress: () => {
                          this.createReceiptAgain();
                        },
                      }}
                      buttonText="Create invoice again"
                      buttonTextProps={{
                        style: {
                          fontSize: 13,
                          color: Colors.BLACK_COLOR,
                          fontWeight: "bold",
                        },
                      }}
                    />
                  )}
                  {count == 2 && (
                    <KharbanButton
                      buttonProps={{
                        style: {
                          width: DEV_WIDTH / 1.2,
                          marginVertical: 25,
                          alignSelf: "center",
                          backgroundColor: Colors.YELLOW_COLOR,
                        },
                        onPress: () => {
                          this.completeByProvider();
                        },
                      }}
                      buttonText="Complete Job"
                      buttonTextProps={{
                        style: {
                          fontSize: 13,
                          color: Colors.BLACK_COLOR,
                          fontWeight: "bold",
                        },
                      }}
                      loading={this.state.completing}
                    />
                  )}
                  <KharbanButton
                    buttonProps={{
                      style: {
                        width: DEV_WIDTH / 1.2,
                        marginVertical: 25,
                        alignSelf: "center",
                        backgroundColor: Colors.WHITE_COLOR,
                        borderColor: "#EDEDEB",
                        borderWidth: 1,
                        shadowColor: "rgb(126,131,141)",
                        shadowOpacity: 0.18,
                        shadowRadius: 2,
                        shadowOffset: {
                          height: 3,
                          width: 0,
                        },
                      },
                      onPress: () => {},
                    }}
                    hasIcon={true}
                    imgUrl={require("../MenuPages/img/supportCenter.png")}
                    buttonText="Contact us"
                    buttonTextProps={{
                      style: {
                        fontSize: 13,
                        color: Colors.BLACK_COLOR,
                        fontWeight: "bold",
                      },
                    }}
                  />
                </View>
              </View>
            )}
            {isCreateAgain && (
              <ScrollView>
                <View style={{ marginTop: "8%" }}>
                  <Image
                    source={require("./assets/img/Recipt.png")}
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
                    style={{
                      fontSize: 22,
                      lineHeight: 32,
                      fontWeight: "bold",
                    }}
                  >
                    Create Receipt
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 28,
                      color: Colors.GREY_COLOR,
                      opacity: 0.6,
                    }}
                  >
                    enter your price and change the status
                  </Text>
                </View>
                <View style={styles.inputContainer}>
                  <IconCareer
                    name="briefcase-variant-outline"
                    color="#000"
                    size={20}
                  />
                  <View style={[styles.selectInput]}>
                    <RNPickerSelect
                      onValueChange={(value) => {
                        this.setState({
                          job_status: value,
                          jobStatusError: validate("job_status", value),
                        });
                      }}
                      items={[
                        { id: 1, label: "Job Complete", value: "completed" },
                      ]}
                      value={this.state.job_status}
                      Icon={() => {
                        return (
                          <View style={{ marginTop: 10 }}>
                            <IconDown
                              style={styles.chevron}
                              name="chevron-down"
                              size={20}
                            />
                          </View>
                        );
                      }}
                      style={{
                        inputIOS: {
                          color: "#000",
                          marginTop: 12,
                        },
                        inputAndroid: {
                          color: "#000",
                        },
                      }}
                      placeholder={{
                        label: "Job Status",
                        color: Colors.GREY_COLOR,
                      }}
                    />
                  </View>
                </View>
                {/* {this.state.jobStatusError &&
                  this.state.jobStatusError.length > 0 && (
                    <View>
                      <Text style={{ color: "red", marginHorizontal: 20 }}>
                        {this.state.jobStatusError}
                      </Text>
                    </View>
                  )} */}
                <View style={styles.inputContainer}>
                  <Image
                    source={require("./assets/img/price.png")}
                    style={styles.iconStyle}
                  />
                  <TextInput
                    onChangeText={(text) =>
                      this.setState({
                        price: text,
                        priceError: validate("price", text),
                      })
                    }
                    selectionColor={Colors.PLACEHOLDER_COLOR}
                    keyboardType="numeric"
                    placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                    color={Colors.PLACEHOLDER_COLOR}
                    placeholder="Enter Your Price"
                    style={styles.selectInput}
                  />
                </View>
                {this.state.priceError.length > 0 && (
                  <View style={{ paddingHorizontal: "10%" }}>
                    <Text style={{ color: "red", marginHorizontal: -15 }}>
                      {this.state.priceError}
                    </Text>
                  </View>
                )}
                <View style={styles.textAreaContainer}>
                  <Text
                    style={{
                      color: Colors.PLACEHOLDER_COLOR,
                      // opacity: 0.6,
                      fontSize: 9,
                    }}
                  >
                    Optional
                  </Text>
                  <TextInput
                    onChangeText={(text) => this.setState({ desc: text })}
                    style={styles.textArea}
                    maxLength={200}
                    placeholder="Description (Max 200 Characters)"
                    selectionColor={Colors.PLACEHOLDER_COLOR}
                    placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                    numberOfLines={10}
                    multiline={true}
                  />
                </View>
                <KharbanButton
                  buttonProps={{
                    style: {
                      width: DEV_WIDTH / 1.2,
                      marginVertical: 35,
                      alignSelf: "center",
                      backgroundColor: Colors.YELLOW_COLOR,
                    },
                    onPress: () => {
                      this.createReceipt();
                    },
                  }}
                  buttonText="Create Receipt"
                  buttonTextProps={{
                    style: {
                      fontSize: 13,
                      color: Colors.BLACK_COLOR,
                      fontWeight: "bold",
                    },
                  }}
                  loading={this.state.authenticating}
                />
              </ScrollView>
              // </View>
            )}
          </View>
        </View>
      </KEYBOARD_VIEW>
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
    color: Colors.BLACK_COLOR,
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
