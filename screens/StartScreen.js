import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import meshBg from "../assets/mesh-bg.png";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { fetchUser } from "../store/actions/auth";

import * as AuthActions from "../store/actions/auth";
import foodImage from "../assets/food.jpg";

const StartScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;
      const expirationDate = new Date(expiryDate);
      if (expirationDate <= new Date() || !token || !userId) {
        console.log("not Authenticated");
      } else {
        const expirationTime = expirationDate.getTime() - new Date().getTime();
        dispatch(fetchUser(userId));
        dispatch(AuthActions.authenticate(userId, token, expirationTime));
        props.navigation.navigate("product");
      }
    };
    tryLogin();
  }, []);
  return (
    <View style={styles.backgroundImage}>
      <LinearGradient colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.3)"]} />
      <View style={styles.screen}>
        <View style={styles.container}>
          <Text style={styles.mainText}>My Contour</Text>
          <View
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{ height: "72%", width: "100%", borderRadius: 150 }}
              source={foodImage}
            />
          </View>
        </View>
        <Text style={styles.text}>Best way to invest your time!</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              props.navigation.navigate("signUpScreen");
            }}
          >
            <Text
              style={{ textAlign: "center", color: "#fff", fontWeight: "bold" }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => {
              props.navigation.navigate("signInScreen");
            }}
          >
            <Text
              style={{ textAlign: "center", fontWeight: "bold", color: "#000" }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 30,
    alignItems: "center",
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    flex: 1,
  },
  mainText: {
    textAlign: "center",
    fontSize: 21,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderColor: "#000",
    borderWidth: 1,
    width: "100%",
    paddingVertical: "4%",
    borderRadius: 10,
  },
  button2: {
    marginTop: "4%",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(0,0,0,0.7)",
    width: "100%",
    paddingVertical: "4%",
    borderRadius: 10,
  },
  container: {
    alignItems: "center",
    marginTop: "7%",
    height: "65%",
    width: "90%",
    padding: "10%",
    borderRadius: 40,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  buttonContainer: {
    width: "80%",
    marginTop: "7%",
  },
  text: {
    fontSize: 17,
    marginTop: "7%",
    fontWeight: "bold",
  },
});
