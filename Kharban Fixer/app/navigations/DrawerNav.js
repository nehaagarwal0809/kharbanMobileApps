import React from "react";
import {
  View,
  TouchableWithoutFeedback,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerItems,
  DrawerActions,
} from "react-navigation-drawer";
import Home from "../screens/Home/Home";
import { Colors } from "../constants/colors/Colors";
import IconShare from "react-native-vector-icons/Ionicons";
import IconHome from "react-native-vector-icons/Ionicons";
import IconAbout from "react-native-vector-icons/Ionicons";
import IconHelp from "react-native-vector-icons/Ionicons";
import IconClose from "react-native-vector-icons/Fontisto";
import Profile from "../screens/Profile/Profile";
import Notification from "../screens/Notification/Notification";
import Orders from "../screens/Orders/Orders";
import Finance from "../screens/Finance/Finance";
import Help from "../screens/Help/Help";
import Share from "../screens/Share/Share";
import About from "../screens/About/About";
import { heightPercentageToDP } from "react-native-responsive-screen";
import HomeStackNav from "./HomeStack";
// import MyTeamsStackNav from "./MyTeamsStack";
// import ProfileStackCoachNav from "./ProfileStackCoachNav";
// import { ROBO_BOLD, POP_BOLD, POP_REGULAR } from "../constants/Fonts";

const INACTIVE_TAB_COLOR = "rgba(255,255,255,0.5)";

const CustomDrawerComponent = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
          <IconClose
            name={"close-a"}
            size={20}
            color={Colors.BLACK_COLOR}
          ></IconClose>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <DrawerItems {...props} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DrawerNav = createDrawerNavigator(
  {
    Home: HomeStack,
    Profile: Profile,
    Orders: Orders,
    Notification: Notification,

    Finance: {
      screen: Finance,
      navigationOptions: {
        drawerLabel: "Financial Information",
      },
    },
    Help: Help,
    About: {
      screen: About,
      navigationOptions: {
        drawerLabel: "About App",
      },
    },
    Share: {
      screen: Share,
      navigationOptions: {
        drawerLabel: "Share App",
      },
    },
    // Profile: ProfileStackCoachNav,
  },
  {
    drawerBackgroundColor: Colors.WHITE_COLOR,
    drawerType: "back",
    overlayColor: "transparent",
    backBehavior: "initialRoute",
    initialRouteName: "HomeStack",
    contentComponent: CustomDrawerComponent,
    drawerWidth: Dimensions.get("window").width,
    screenContainerStyle: {
      height: 25,
    },
    defaultNavigationOptions: ({ navigation }) => ({
      drawerIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === "Home") {
          return (
            <View>
              <IconHome name={"home-outline"} size={20} color={tintColor} />
            </View>
          );
        } else if (routeName === "Profile") {
          return (
            <View>
              <Image
                source={require("../screens/Login/img/User.png")}
                style={{ height: 14, width: 14 }}
              />
            </View>
          );
        } else if (routeName === "Orders") {
          return (
            <View>
              <Image
                source={require("./img/To-Do.png")}
                style={{ height: 16, width: 14 }}
              />
            </View>
          );
        } else if (routeName === "Notification") {
          return (
            <View>
              <Image
                source={require("./img/bell.png")}
                style={{ height: 16, width: 14 }}
              />
            </View>
          );
        } else if (routeName === "Finance") {
          return (
            <View>
              <Image
                source={require("./img/money.png")}
                style={{ height: 16, width: 14 }}
              />
            </View>
          );
        } else if (routeName === "Help") {
          return (
            <View>
              <IconHelp name={"help-buoy"} size={22} color={tintColor} />
            </View>
          );
        } else if (routeName === "About") {
          return (
            <View>
              <IconAbout
                name={"information-circle-outline"}
                size={22}
                color={tintColor}
              />
              {/* <IconProfile name={"user-circle-o"} size={23} color={tintColor} /> */}
            </View>
          );
        } else if (routeName === "Share") {
          return (
            <View>
              <IconShare
                name={"share-social-outline"}
                size={22}
                color={tintColor}
              />
              {/* <IconProfile name={"user-circle-o"} size={23} color={tintColor} /> */}
            </View>
          );
        }
      },
    }),
    contentOptions: {
      activeTintColor: Colors.YELLOW_COLOR,
      inactiveTintColor: Colors.BLACK_COLOR,
      labelStyle: {
        fontSize: 15,
      },
    },
  }
);

const styles = StyleSheet.create({
  logo: {
    height: 100,
    width: 100,
    resizeMode: "contain",
  },
  logoContainer: {
    alignItems: "center",
    padding: 25,
  },
  follow: {
    color: Colors.WHITE_COLOR,
    // fontFamily: POP_BOLD,
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
  socialTxt: {
    color: Colors.WHITE_COLOR,
    // fontFamily: POP_REGULAR,
    fontSize: 10,
    marginTop: 2,
  },
  socialIcon: {
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  contactBtn: {
    backgroundColor: Colors.BLACK_COLOR,
    width: 150,
    padding: 15,
    borderRadius: 25,
    alignSelf: "center",
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  contactTxt: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    // fontFamily: ROBO_BOLD,
  },
  mailIcon: {
    height: 15,
    width: 15,
    resizeMode: "contain",
  },
});
