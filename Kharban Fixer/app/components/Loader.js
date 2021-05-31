import React, { Component } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Colors } from "../constants/colors/Colors";
import { PropTypes } from "prop-types";
import { DEV_HEIGHT } from "../constants/Device/DeviceDetails";

class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { loaderProps } = this.props;
    return (
      <View>
        <ActivityIndicator
          {...loaderProps}
          color={Colors.YELLOW_COLOR}
          size="large"
          style={[
            { marginTop: (DEV_HEIGHT * 25) / 100 },
            loaderProps && loaderProps.style,
          ]}
        />
      </View>
    );
  }
}

Loader.propTypes = {
  loaderProps: PropTypes.object,
};

export default Loader;
