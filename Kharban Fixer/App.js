import React from "react";
import { StatusBar } from "react-native";
import AppNavigator from "./app/navigations/AppNavigator";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "@react-native-firebase/messaging";
import NavigationService from "./app/navigations/NavigationService";
import { RootSiblingParent } from "react-native-root-siblings";
import Geocoder from "react-native-geocoding";
import { Toaster } from "./app/components/Toaster";
import { Colors } from "./app/constants/colors/Colors";
import Toast from "react-native-root-toast";

const GOOGLE_MAPS_APIKEY = "AIzaSyDfujfLdGzG-pWG0VGe4agzS80EKAhP4gU";

Geocoder.init(GOOGLE_MAPS_APIKEY);

export default function App() {
  React.useEffect(() => {
    //For push notification
    checkPermission();
    onNotificationOpenedApp = firebase
      .messaging()
      .onNotificationOpenedApp(onNotificationOpenedApp);
    onMessage = firebase.messaging().onMessage(onMessage);
    firebase.messaging().getInitialNotification().then(getInitialNotification);
    firebase.messaging().setBackgroundMessageHandler(async (data) => {
      console.log("setBackgroundMessageHandler", data);
      setBackgroundMessageHandler(data);
    });

    return () => {
      onNotificationOpenedApp();
      onMessage();
    };
  }, []);
  let navigateToScreen = async (data) => {
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    if (TOKEN) {
      if (data.data.badge == 1) {
        NavigationService.reset(
          data.data.notificationType,
          data.data && data.data
        );
      }
      if (data.data.badge == 2) {
        NavigationService.navigate(
          data.data.notificationType,
          data.data && data.data
        );
      }
    }

    console.log(
      "data.notificationType ",
      data.data.notificationType,
      " data.badge ",
      data.data.badge
    );
  };
  let onMessage = (data) => {
    console.log("onMessage", data);
    if (data.notification.body) {
      Toaster(
        data.notification.body,
        Colors.LIGHT_GREEN,
        Colors.WHITE_COLOR,
        Toast.positions.TOP
      );
    }
    navigateToScreen(data);
  };

  let onNotificationOpenedApp = (data) => {
    console.log("onNotificationOpenedApp", data);
    navigateToScreen(data);
  };

  const getInitialNotification = (data) => {
    console.log("getInitialNotification", data);
    navigateToScreen(data);
  };

  const setBackgroundMessageHandler = (data) => {
    console.log("setBackgroundMessageHandler", data);
    navigateToScreen(data);
  };

  const checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    console.log("enabled ==> ", enabled);
    if (enabled === 1) {
      getToken();
    } else {
      requestPermission();
      getToken();
    }
  };

  const getToken = async () => {
    AsyncStorage.getItem("fcmToken", async (err1, fcmToken) => {
      console.log("AsyncStorage=>" + fcmToken);
      if (!fcmToken) {
        // user has a device token
        fcmToken = await firebase.messaging().getToken();
        await AsyncStorage.setItem("fcmToken", fcmToken);
        console.log("user has a device token" + fcmToken);
        global.fcmToken = fcmToken;
      } else {
        console.log("user has a device token" + fcmToken);
        await AsyncStorage.setItem("fcmToken", fcmToken);
        global.fcmToken = fcmToken;
      }
      console.log("FCM TOKE" + fcmToken);
    });
  };

  const requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      getToken();
    } catch (error) {
      console.log("permission rejected");
    }
  };

  return (
    <RootSiblingParent>
      <AppNavigator
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    </RootSiblingParent>
  );
}
