import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { globalStyles } from "../styles/GlobalStyles";
import meshBg from "../assets/mesh-bg.png";

export default function OuterContainer({ styles, children }) {
  return (
    <View
      style={{
        ...styles,
        backgroundColor: "rgba(255, 251, 251, 0.28)",
        borderWidth: 3,
        borderColor: "rgba(0,0,0,0.04)",
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
