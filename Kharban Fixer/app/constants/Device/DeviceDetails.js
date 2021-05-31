import { Platform, Dimensions } from "react-native";

export const IS_IOS = Platform.OS === "ios";

export const DEV_HEIGHT = Dimensions.get("window").height;

export const DEV_WIDTH = Dimensions.get("window").width;

export const DEV_VERSION = Platform.Version;
export const isIOS13 =
  IS_IOS &&
  parseInt(Platform.Version, 10) >= 13 &&
  parseInt(Platform.Version, 10) < 14;
export const isIOS14 = IS_IOS && parseInt(Platform.Version, 10) >= 14;
