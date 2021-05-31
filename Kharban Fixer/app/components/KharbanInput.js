import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { PropTypes } from "prop-types";
import { Colors } from "../constants/colors/Colors";
import * as Animatable from "react-native-animatable";
// import { ROBO_REGULAR } from "../constants/Fonts";

class KharbanInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: "",
      isFocused: false,
    };
  }

  onChangeText(text) {
    this.setState({ inputText: text });
    try {
      this.props.inputProps.onChangeText(text);
    } catch (ex) {}
  }

  render() {
    const { containerProps, inputProps, placeholderProps } = this.props;
    const { isFocused } = this.state;
    return (
      <View
        {...containerProps}
        style={[styles.container, containerProps && containerProps.styles]}
      >
          
        {this.state.inputText.length > 0 && !this.props.noAnimation && (
          <Animatable.View
            animation="bounceIn"
            {...placeholderProps}
            style={[styles.placeHolderContainer]}
          >
            <Text style={styles.placeHolderText}>{this.props.placeText}</Text>
          </Animatable.View>
        )}
        <TextInput
          autoCapitalize="none"
          {...inputProps}
          selectionColor={Colors.PLACEHOLDER_COLOR}
          onChangeText={(text) => this.onChangeText(text)}
          placeholderTextColor={this.props.placeColor || Colors.PLACEHOLDER_COLOR}
          onFocus={() => this.setState({ isFocused: true })}
          onBlur={() => this.setState({ isFocused: false })}
          style={[
            styles.input,
            { borderColor: isFocused ? Colors.SKY_COLOR : Colors.LIGHT_GREY },
            inputProps && inputProps.style,
          ]}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    width: "100%",
    borderRadius: 5,
    padding: 10,
    backgroundColor: Colors.WHITE_COLOR,
    height: 45,
    color: Colors.BLACK_COLOR,
    fontSize: 15,
    // fontFamily: ROBO_REGULAR,
    marginBottom: 25,
  },
  placeHolderContainer: {
    position: "absolute",
    zIndex: 99,
    top: -12,
    left: 20,
    backgroundColor: Colors.BLACK_COLOR,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  placeHolderText: {
    color: Colors.WHITE_COLOR,
    fontSize: 13,
  },
});

KharbanInput.propTypes = {
  containerProps: PropTypes.object,
  inputProps: PropTypes.object,
  placeholderProps: PropTypes.object,
};

export default KharbanInput;
