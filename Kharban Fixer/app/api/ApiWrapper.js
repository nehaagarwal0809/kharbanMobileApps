import axios from "axios";
import querystring from "querystring";
import AsyncStorage from "@react-native-community/async-storage";
import { Toaster } from "../components/Toaster";
import { Colors } from "../constants/colors/Colors";
import NavigationService from "../navigations/NavigationService";

const CORE_URL = "http://kharban.net:82";
const MVC_URL = "http://14.98.110.242:226";

const BASE_URL = CORE_URL;

export async function standardPostApi(
  endpoint,
  headers,
  params,
  pushLoginToUnauth = true,
  showErrorAlert = false
) {
  const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
  const res = await axios
    .post(
      `${BASE_URL}/api/v1/${endpoint}`,
      { ...params, AccessToken: TOKEN },
      {
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      }
    )
    .then()
    .catch(async (error) => {
      if (error.message == "Request failed with status code 401") {
        await AsyncStorage.removeItem("@USER_ACCESS_TOKEN");
        NavigationService.reset("Login");
        Toaster(
          "You have been logged out, Please login again to continue!!",
          Colors.LIGHT_RED
        );
      }
    });
  if (res.data.code == 401) {
    console.log("REMOVED ACCESS TOKEN !");
  }
  if (showErrorAlert && res.data.code !== 200 && res.data.message) {
    alert(res.data.message);
  }
  return res;
}
