import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors/Colors";
import KharbanButton from "../../components/KharbanButton";
import Container from "../../components/Container";
import { StackActions, NavigationActions } from "react-navigation";

export default class ShareApp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <View style={styles.imageDiv}>
          <Image source={require("./img/congrats.png")} />
        </View>
        <View>
          <Text style={styles.ShareApp}>Congrats</Text>
          <Text style={styles.shareSubApp}>
            Congratulations you are in the System.
          </Text>
          <Text style={styles.shareSubApp}>
            Once Approved account will Activate.
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 34,
            justifyContent: "flex-end",
            flex: 1,
            marginBottom: 50,
          }}
        >
          <KharbanButton
            buttonProps={{
              onPress: () => {
                this.props.navigation.dispatch(
                  StackActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({
                        routeName: "Home",
                        params: {},
                      }),
                    ],
                  })
                );
              },
            }}
            buttonTextProps={{
              style: {
                color: Colors.BLACK_COLOR,
                fontWeight: "bold",
                fontSize: 12,
              },
            }}
            buttonText="Get Started"
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  imageDiv: {
    marginTop: 60,
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  ShareApp: {
    fontSize: 24,
    lineHeight: 44,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -25,
  },
  shareSubApp: {
    color: Colors.GREY_COLOR,
    fontSize: 12,
    lineHeight: 23,
    textAlign: "center",
    // marginTop: 10,
  },
});
