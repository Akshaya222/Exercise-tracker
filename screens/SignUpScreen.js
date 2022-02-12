import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { api } from "../store/api";

import image from "../assets/hand-image.png";
import meshBg from "../assets/mesh-bg.png";
import {
  saveDataToStorage,
  authenticate,
  fetchUser,
} from "../store/actions/auth";

const LoginScreen = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const clickHandler = () => {
    console.log("data is", data);
    const config = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(`${api}/user/signup`, config)
      .then((data) => data.json())
      .then((data) => {
        if (data.status == "failure") {
          setError(data.message);
        } else {
          setError("");
          setData({
            email: "",
            password: "",
            username: "",
            passwordConfirm: "",
          });
          dispatch(
            authenticate(
              data.data.user._id,
              data.token,
              parseInt(3 * 60 * 60 * 1000)
            )
          );
          const expirationDate = new Date(
            new Date().getTime() + parseInt(3 * 60 * 60 * 1000)
          );
          saveDataToStorage(data.token, data.data.user._id, expirationDate);
          dispatch(fetchUser(data.data.user._id));
          props.navigation.navigate({
            routeName: "iniRecScr",
          });
        }
      })
      .catch((e) => {
        setError(e);
        console.log("error is", e);
      });
  };
  return (
    <View style={styles.backgroundImage}>
      <LinearGradient colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.6)"]} />
      <View style={styles.screen}>
        <View style={styles.imageContainer}>
          <Image
            style={{ width: "80%", height: 250, resizeMode: "contain" }}
            source={image}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.mainText}>Create Account</Text>
          {error ? (
            <Text
              style={{
                marginTop: -17,
                color: "red",
                fontSize: 16,
                marginBottom: 4,
              }}
            >
              {" "}
              {error}{" "}
            </Text>
          ) : null}
          <View style={{ ...styles.inputContainer, marginTop: 0 }}>
            <Text style={styles.label}>Full name:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(e) => {
                setData({ ...data, username: e });
              }}
              placeholder="Full name"
              placeholderTextColor="black"
            />
          </View>
          <View style={{ ...styles.inputContainer, marginTop: "4%" }}>
            <Text style={styles.label}>Email address:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(e) => {
                setData({ ...data, email: e });
              }}
              placeholder="email address"
              placeholderTextColor="black"
            />
          </View>
          <View style={{ ...styles.inputContainer, marginTop: "4%" }}>
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(e) => {
                setData({ ...data, password: e });
              }}
              placeholder="password"
              placeholderTextColor="black"
            />
          </View>
          <View style={{ ...styles.inputContainer, marginTop: "4%" }}>
            <Text style={styles.label}>Confirm password:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(e) => {
                setData({ ...data, passwordConfirm: e });
              }}
              placeholder="confirm password"
              placeholderTextColor="black"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={clickHandler}>
            <Text
              style={{ textAlign: "center", color: "#fff", fontWeight: "bold" }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
          <Text style={{ color: "#555956" }}>
            I'm already a member.{" "}
            <Text
              style={{ color: "#000", fontWeight: "bold" }}
              onPress={() => {
                props.navigation.navigate("signInScreen");
              }}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: "4%",
    alignItems: "center",
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    flex: 1,
  },
  container: {
    width: "100%",
    height: "80%",
    zIndex: 10,
    alignItems: "center",
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    elevation: 3,
    //backgroundColor:"#EFEFEF"
  },
  imageContainer: {
    height: "23%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginLeft: 10,
    fontSize: 12,
    color: "#555956",
  },
  mainText: {
    paddingVertical: "6%",
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  inputContainer: {
    width: "80%",
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderColor: "#000",
    borderWidth: 1,
    marginBottom: "6%",
    marginTop: "7%",
    width: "80%",
    paddingVertical: "4%",
    borderRadius: 10,
  },
  input: {
    backgroundColor: "transparent",
    borderColor: "#999",
    borderWidth: 1,
    borderStyle: "solid",
    width: "100%",
    fontWeight: "bold",
    paddingVertical: "3%",
    borderRadius: 8,
    paddingLeft: 10,
    marginTop: 2,
  },
});
