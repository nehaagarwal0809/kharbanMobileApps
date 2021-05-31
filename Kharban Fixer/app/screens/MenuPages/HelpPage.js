import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  Linking,
} from "react-native";
import { Colors } from "../../constants/colors/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import CrossContainer from "../../components/CrossContainer";
import Icon from "react-native-vector-icons/Entypo";
import IconHelp from "react-native-vector-icons/Ionicons";
import { standardPostApi } from "../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
const EMAIL = "help@kharban.net";
const HELP_ARR = [
  {
    id: 1,
    title: "application work KSA only ?",
    points: [
      {
        text:
          "By using the Kharban app, you agree to abide by these terms and conditions. In the event that you do not agree to the terms and conditions",
      },
    ],
  },
  {
    id: 2,
    title: "application work KSA only ?",
    points: [
      {
        text:
          "By using the Kharban app, you agree to abide by these terms and conditions. In the event that you do not agree to the terms and conditions",
      },
    ],
  },
  {
    id: 3,
    title: "application work KSA only ?",
    points: [
      {
        text:
          "By using the Kharban app, you agree to abide by these terms and conditions. In the event that you do not agree to the terms and conditions",
      },
    ],
  },
];

export default class HelpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: [],
      helpData: [],
      helpDataLoading: true,
    };
    this.getFaqList();
  }

  getFaqList = async () => {
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    try {
      const res = await standardPostApi(
        "getFaqList",
        { Authorization: "Bearer " + TOKEN },
        { faq_for: 1 },
        true,
        false
      );
      console.log("getFaq!!!! ", res);
      if (res.data.status == 200) {
        const All_Faq = res.data.result;
        this.setState({ helpData: All_Faq, helpDataLoading: false });
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
    // this.setState({ loadingRequests: false });
  };

  toggleExpand = (id) => {
    const { helpData } = this.state;
    const expand_item = helpData.find((item) => item.id === id);
    expand_item.expanded = !expand_item.expanded;
    const newHelpData = Object.assign({}, helpData, expand_item);
    this.setState({ newHelpData });
  };

  render() {
    const { helpData, helpDataLoading } = this.state;
    helpData.map(function (el) {
      var o = Object.assign({}, el);
      o.expanded = false;
      return o;
    });
    return (
      <CrossContainer
        isScroll
        hasBottomText
        onCrossPress={() => this.props.navigation.goBack()}
      >
        <View style={{ paddingHorizontal: 29 }}>
          <View
            style={{
              flexDirection: "row",
              marginTop: 40,
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <Image
              style={{ height: 35, width: 35, marginRight: 20 }}
              source={require("./img/chat_icon.png")}
            />
            <View>
              <Text style={styles.help}>Need Help!</Text>
              <Text style={styles.subhelp}>
                questions about the application may help
              </Text>
            </View>
          </View>
          <View style={{ marginBottom: 25 }}>
            {helpData.map((item) => {
              const IS_EXPANDED = item.expanded;
              return (
                <View style={styles.mainDiv}>
                  <TouchableOpacity
                    style={{ paddingVertical: 7 }}
                    onPress={async () => await this.toggleExpand(item.id)}
                  >
                    <View style={styles.rowContainer}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <IconHelp
                          name={"help-circle-outline"}
                          size={20}
                          style={{ marginRight: 10 }}
                        />
                        <Text style={styles.title}>{item.question}</Text>
                      </View>
                      <View>
                        <Icon
                          name={IS_EXPANDED ? "chevron-up" : "chevron-down"}
                          size={17}
                          color="#BEC1C6"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  {IS_EXPANDED && (
                    <View>
                      {/* {item.points.map((i) => { */}
                      {/* return ( */}
                      <View>
                        <Text style={styles.pointTxt}>{item.answer}</Text>
                      </View>
                      {/* ); */}
                      {/* })} */}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${EMAIL}`)}>
            <View style={styles.mailDiv}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{ height: 33, width: 33, marginRight: 15 }}
                  source={require("./img/supportCenter.png")}
                />
                <View>
                  <Text style={styles.helpText}>Here to help you</Text>
                  <Text style={styles.helpMail}>{EMAIL}</Text>
                </View>
              </View>
              <View>
                <View style={styles.iconDiv}>
                  <Image source={require("./img/Sent.png")} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
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
    fontSize: 14,
    width: "80%",
    // fontFamily: ROBO_MEDIUM,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pointTxt: {
    fontSize: 13,
    color: Colors.GREY_COLOR,
    padding: 8,
    alignSelf: "flex-start",
    lineHeight: 24,
  },
  mainDiv: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#EDEDEB",
    padding: 10,
    marginVertical: 15,
  },
  mailDiv: {
    marginTop: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor: "#FFD800",
    shadowColor: "rgb(255,216,0)",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      height: 4,
      width: 0,
    },
    // elevation: 10,
    padding: 25,
  },
  helpText: {
    fontSize: 16,
    lineHeight: 30,
    fontWeight: "bold",
  },
  helpMail: {
    fontSize: 12,
    lineHeight: 23,
  },
  iconDiv: {
    height: 50,
    width: 50,
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 50,
    shadowColor: "#FFD800",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      height: 4,
      width: 0,
    },
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  bgImage: {
    tintColor: "green",
    position: "absolute",
    bottom: 0,
    height: 200,
    width: "100%",
  },
});
