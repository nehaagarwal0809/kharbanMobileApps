import React, { Component } from "react";
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Platform,
} from "react-native";

const KEYBOARD_VIEW = Platform.OS === "ios" ? KeyboardAvoidingView : View;

export default class Container extends Component {
  render() {
    return (
      <KEYBOARD_VIEW
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
        }}
        behavior="padding"
      >
        <View style={styles.container}>
          <Image
            style={{ marginTop: -20, width: "100%" }}
            source={require("./img/bg.png")}
          />
          {this.props.children}
        </View>
      </KEYBOARD_VIEW>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
