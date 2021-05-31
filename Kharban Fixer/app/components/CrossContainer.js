import React, { Component } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  RefreshControl,
  ImageBackground,
} from "react-native";
import { Colors } from "../constants/colors/Colors";

export default class CrossContainer extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ paddingHorizontal: 34 }}>
          <TouchableOpacity onPress={this.props.onCrossPress}>
            <Image
              style={styles.crossImg}
              source={require("./img/Close.png")}
            />
          </TouchableOpacity>
          {this.props.hasTitle && (
            <Text style={styles.titleText}>{this.props.title}</Text>
          )}
        </View>
        {this.props.isScroll ? (
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              this.props.pullToRefresh && (
                <RefreshControl
                  refreshing={this.props.refreshing}
                  onRefresh={this.props.onPullToRefresh}
                  title="Loading..."
                />
              )
            }
          >
            {this.props.children}
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>{this.props.children}</View>
        )}

        {this.props.hasBottomText && (
          <Text style={styles.text}>Made With ❤️ In Riyadh </Text>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  crossImg: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    marginTop: 25,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.BLACK_COLOR,
    marginTop: 23,
  },
  text: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
});
