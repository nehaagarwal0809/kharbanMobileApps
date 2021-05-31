//***** import libraries */
import React from "react";
import { StyleSheet, Text } from "react-native";

//***** Common component for error message */
export default function ErrorMessage({ text, margintop = 3 }) {
  return (
    <Text
      style={{
        fontSize: 12,
        marginTop: margintop,
        letterSpacing: 0,
        color: "red",
        marginHorizontal: 26,
      }}
    >
      {text}
    </Text>
  );
}
