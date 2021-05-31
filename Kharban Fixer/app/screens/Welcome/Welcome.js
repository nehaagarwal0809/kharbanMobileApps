import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Container from "../../components/Container";
import AppIntroSlider from "react-native-app-intro-slider";
import AsyncStorage from "@react-native-community/async-storage";
import { StackActions, NavigationActions } from "react-navigation";
import { DEV_HEIGHT } from "../../constants/Device/DeviceDetails";
import { Colors } from "../../constants/colors/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const SLIDES = [
  {
    key: "First",
    text: `Do you Have a Service`,
    subtext: `you can provide your services to many \n customers`,
    image: require("./img/uno.png"),
    backgroundColor: "#FFFFFF",
  },
  {
    key: "Second",
    text: `Make More Money`,
    subtext: `you can make more money from our \n app by providing your services`,
    image: require("./img/dos.png"),
    backgroundColor: "#FFFFFF",
  },
  {
    key: "Third",
    text: `Easy To Use`,
    subtext: `An easy application and an easy method \n to work`,
    image: require("./img/tres.png"),
    backgroundColor: "#FFFFFF",
  },
];

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appLoading: true,
    };
    this.checkAuth();
  }
  dispatcher = async (route) => {
    await this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: route,
            params: {},
          }),
        ],
      })
    );
  };
  async checkAuth() {
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    const INTRO_SEEN = await AsyncStorage.getItem("hasSeenIntro");
    if (TOKEN) {
      await this.dispatcher("Home");
      this.setState({ appLoading: false });
    } else if (!TOKEN && INTRO_SEEN) {
      await this.dispatcher("Login");
      this.setState({ appLoading: false });
    } else {
      await this.setState({ appLoading: false });
    }
  }
  _renderItem = ({ item }) => {
    return (
      <View style={styles.sliderView}>
        <Image source={item.image} style={styles.sliderImages} />
        <Text style={styles.sliderText}>{item.text}</Text>
        <Text style={styles.sliderSubText}>{item.subtext}</Text>
      </View>
    );
  };

  RenderNextButton = () => {
    return (
      <View style={styles.nextButton}>
        <Text style={styles.label}>Next</Text>
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={styles.nextButton}>
        <Text style={styles.label}>Get Started</Text>
      </View>
    );
  };
  _renderSkipButton = () => {
    return (
      <View style={styles.skipContainer}>
        <Text style={styles.skipTxt}>Skip</Text>
      </View>
    );
  };
  on_Done_slides = async () => {
    await AsyncStorage.setItem("hasSeenIntro", "YES");
    this.dispatcher("Login");
  };

  render() {
    const { appLoading } = this.state;
    if (appLoading) {
      return (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator color={Colors.YELLOW_COLOR} size="small" />
        </View>
      );
    }
    return (
      <Container>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <AppIntroSlider
            activeDotStyle={{
              backgroundColor: "#050503",
              width: 23,
              height: 5,
              marginLeft: -5,
              // marginBottom: DEV_HEIGHT / 2.6,
              // marginBottom: hp(25),
              marginBottom: hp(4),
            }}
            dotStyle={{
              backgroundColor: "#F2F2F2",
              borderRadius: 5,
              width: 22,
              height: 5,
              marginLeft: -5,
              // marginBottom: DEV_HEIGHT / 2.6,
              // marginBottom: hp(25),
              marginBottom: hp(4),
            }}
            bottomButton="true"
            data={SLIDES}
            renderItem={this._renderItem}
            renderNextButton={this.RenderNextButton}
            renderDoneButton={this._renderDoneButton}
            renderSkipButton={this._renderSkipButton}
            onDone={this.on_Done_slides}
            showSkipButton="true"
            onSkip={this.on_Done_slides}
          />
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  skipContainer: {
    height: 45,
    marginTop: hp(-3),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  sliderView: {
    alignItems: "center",
    paddingBottom: 50,
    paddingHorizontal: 5,
  },
  sliderImages: {
    height: 200,
    resizeMode: "contain",
    // marginTop: 30,
  },
  sliderText: {
    color: Colors.BLACK_COLOR,
    fontSize: 25,
    textAlign: "center",
    width: "100%",
    fontWeight: "bold",
    marginTop: 20,
  },
  sliderSubText: {
    color: Colors.GREY_COLOR,
    fontSize: 16,
    textAlign: "center",
    opacity: 0.6,
    lineHeight: 26,
    marginTop: 13,
  },
  nextButton: {
    backgroundColor: Colors.YELLOW_COLOR,
    width: 150,
    height: 45,
    borderRadius: 7,
    shadowColor: Colors.LIGHT_YELLOW_COLOR,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: -100,
    marginBottom: hp(9),
  },
  label: {
    color: Colors.BLACK_COLOR,
    fontWeight: "bold",
    fontSize: 14,
  },
  indicatorContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  skipTxt: {
    color: "rgba(126,131,141,0.4)",
    lineHeight: 20,
    fontSize: 16,
    // fontFamily: RB_REGULAR,
  },
});
