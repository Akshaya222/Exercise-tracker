import { View, Text } from "react-native";
import React from "react";

export default function TransparentBackground({ children, styles, key }) {
  return (
    <View style={{ ...styles }} key={key}>
      {children}
    </View>
  );
}
