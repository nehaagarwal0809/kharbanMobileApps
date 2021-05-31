import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import { Colors } from "../../constants/colors/Colors";
import ScrollViewIndicator from "react-native-scroll-indicator";
import { standardPostApi } from "../../api/ApiWrapper";
import CrossContainer from "../../components/CrossContainer";
import { DEV_HEIGHT } from "../../constants/Device/DeviceDetails";
import HTML from "react-native-render-html";
import Loader from "../../components/Loader";
export default class AboutApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutAppLoading: true,
      aboutApp: "",
    };
  }

  componentDidMount() {
    this.getAboutApp();
  }

  getAboutApp = async () => {
    try {
      const res = await standardPostApi(
        "getContent",
        undefined,
        {
          content_type: "AboutUs",
        },
        true,
        false
      );
      if (res.data.status == 200) {
        this.setState({ aboutApp: res.data.result.description });
      }
    } catch (error) {
      console.log("ERRR" + error);
    }
    this.setState({ aboutAppLoading: false });
  };

  render() {
    const { aboutApp, aboutAppLoading } = this.state;
    return (
      <CrossContainer
        hasBottomText
        onCrossPress={() => this.props.navigation.goBack()}
      >
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={styles.container}>
            <Text style={styles.text}>About App</Text>
            <Text style={styles.subhead}>
              information about the Kharban Application
            </Text>
          </View>
          <ScrollViewIndicator
            flexibleIndicator={false}
            shouldIndicatorHide={false}
            indicatorHeight={23}
            scrollIndicatorContainerStyle={{
              backgroundColor: "#F2F2F2",
              height: DEV_HEIGHT / 3.1,
            }}
            scrollViewStyle={{ height: DEV_HEIGHT / 2.2 }}
            style={{
              paddingHorizontal: "13%",
              flex: 1,
              marginTop: 20,
              alignItems: "flex-start",
              // marginBottom: 50,
            }}
          >
            <HTML
              ignoredStyles={["font-family"]}
              html={`${aboutApp}`}
              onLinkPress={(event, href) => {
                Linking.openURL(href);
              }}
            />
          </ScrollViewIndicator>
          <Image style={styles.bgImage} source={require("./img/aboutBg.png")} />
        </View>
      </CrossContainer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 50,
  },
  text: {
    color: Colors.BLACK_COLOR,
    fontSize: 24,
    lineHeight: 46,
    fontWeight: "bold",
    marginBottom: 6,
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

  bgImage: {
    tintColor: "green",
    position: "absolute",
    bottom: 0,
    height: 200,
    width: "100%",
  },
});
