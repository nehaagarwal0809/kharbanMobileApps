import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { PropTypes } from "prop-types";
import { Colors } from "../constants/colors/Colors";
// import { ROBO_MEDIUM } from "../constants/Fonts";

class KharbanButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      containerProps,
      buttonProps,
      buttonTextProps,
      loading,
      isDisabled,
      iconProps,
    } = this.props;
    return (
      <View {...containerProps} style={styles.container}>
        <TouchableOpacity
          disabled={loading || isDisabled}
          {...buttonProps}
          style={[styles.button, buttonProps.style && buttonProps.style]}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color={Colors.BLACK_COLOR || this.props.indiColor}
            />
          ) : (
            <View style={styles.rowView}>
              {this.props.hasIcon && (
                <Image
                  {...iconProps}
                  style={[styles.icon, iconProps && iconProps.style]}
                  source={this.props.imgUrl}
                />
              )}
              <Text
                {...buttonTextProps}
                style={[styles.text, buttonTextProps && buttonTextProps.style]}
              >
                {this.props.buttonText}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  button: {
    backgroundColor: Colors.YELLOW_COLOR,
    width: "100%",
    borderRadius: 10,
    height: 45,
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: Colors.LIGHT_YELLOW_COLOR,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  text: {
    color: Colors.BLACK_COLOR,
    textAlign: "center",
    fontSize: 15,
    padding: 5,
    // fontWeight:"bold"
    // fontFamily: ROBO_MEDIUM,
  },
  rowView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 15,
    width: 15,
    resizeMode: "contain",
    tintColor: Colors.BLACK_COLOR,
  },
});

KharbanButton.propTypes = {
  containerProps: PropTypes.object,
  buttonProps: PropTypes.object,
  buttonTextProps: PropTypes.object,
  loading: PropTypes.boolean,
  iconProps: PropTypes.object,
};

export default KharbanButton;
