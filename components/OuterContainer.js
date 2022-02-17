import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { globalStyles } from "../styles/GlobalStyles";
import meshBg from "../assets/mesh-bg.png";

export default function OuterContainer({ styles, children }) {
  return (
    <View
      style={{
        ...styles,
      }}
    >
      {/* <ImageBackground
        source={meshBg}
        style={globalStyles.imageBackgroundInner}
      > */}
      {children}
      {/* </ImageBackground> */}
    </View>
  );
}
