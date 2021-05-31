import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Share,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../constants/colors/Colors";
import KharbanButton from "../../components/KharbanButton";
import CrossContainer from "../../components/CrossContainer";
import { IS_IOS } from "../../constants/Device/DeviceDetails";

const LINK = IS_IOS
  ? "https://apps.apple.com/"
  : "https://play.google.com/store/apps/";

export default class ShareApp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        message: `Join me on Kharban and take benifit of fast service providers ${LINK}.`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <CrossContainer onCrossPress={() => this.props.navigation.goBack()}>
        <View style={styles.imageDiv}>
          <Image source={require("./img/share.png")} />
        </View>
        <View>
          <Text style={styles.ShareApp}>Share Application</Text>
          <Text style={styles.shareSubApp}>
            Share the application with your friends to take {`\n`} Application
            services
          </Text>
        </View>
        <View
          style={{ paddingHorizontal: 34, justifyContent: "flex-end", flex: 1 }}
        >
          <KharbanButton
            buttonProps={{
              onPress: () => {
                this.onShare();
              },
            }}
            buttonTextProps={{
              style: {
                color: Colors.BLACK_COLOR,
                fontWeight: "bold",
                fontSize: 13,
              },
            }}
            hasIcon={true}
            imgUrl={require("./img/share_ic.png")}
            buttonText="Share App"
          />
        </View>
      </CrossContainer>
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
    marginTop: 50,
  },
  shareSubApp: {
    color: Colors.GREY_COLOR,
    fontSize: 12,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 10,
  },
});
