import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../constants/colors/Colors";

const KEYBOARD_VIEW = Platform.OS === "ios" ? KeyboardAvoidingView : View;

export default class HamBurger extends Component {
  render() {
    return (
      <SafeAreaView style={styles.safeView}>
        <TouchableOpacity
          style={{ padding: "5%" }}
          onPress={this.props.onMenuPress}
        >
          {/* <Icon name="md-menu" size={30} color={Colors.SKY_COLOR} /> */}
          <Image
            source={require("./img/side_menu.png")}
            style={{ height: 20, width: 27 }}
          />
        </TouchableOpacity>
        <ScrollView r style={{ flex: 1 }}>
          {/* <KEYBOARD_VIEW
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
            behavior="padding"
          > */}
          <View style={{ paddingHorizontal: "5%", flex: 1 }}>
            {this.props.children}
          </View>
          {/* </KEYBOARD_VIEW> */}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
  },
});
