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
import image from "../assets/hand-image.png";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { api } from "../store/api";

import {
  saveDataToStorage,
  authenticate,
  fetchUser,
} from "../store/actions/auth";
import meshBg from "../assets/mesh-bg.png";

const LoginScreen = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    email: "",
    password: "",
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
    fetch(`${api}/user/login`, config)
      .then((data) => data.json())
      .then((data) => {
        if (data.status == "failure") {
          setError(data.message);
        } else {
          setError("");
          setData({
            email: "",
            password: "",
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
          props.navigation.navigate("product");
        }
      })
      .catch((e) => {
        setError(e);
        console.log("error is", e);
      });
    // props.navigation.navigate("homeScreen")
  };

  return (
    <View style={styles.backgroundImage}>
      <LinearGradient colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.6)"]} />
      <View style={styles.screen}>
        <View style={styles.imageContainer}>
          <Image style={{ width: "90%", height: "100%" }} source={image} />
        </View>
        <View style={styles.container}>
          <Text style={styles.mainText}>Sign In</Text>
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
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email address:</Text>
            <TextInput
              style={styles.input}
              placeholder="email address"
              onChangeText={(e) => {
                setData({ ...data, email: e });
              }}
              placeholderTextColor="#000"
            />
          </View>
          <View style={{ ...styles.inputContainer, marginTop: 15 }}>
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(e) => {
                setData({ ...data, password: e });
              }}
              placeholder="password"
              placeholderTextColor="#000"
            />
            <Text
              style={{
                textAlign: "right",
                marginTop: 1,
                fontSize: 13,
                color: "#555956",
              }}
            >
              Forget password ?{" "}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            style={styles.button}
            onPress={clickHandler}
          >
            <Text
              style={{ textAlign: "center", color: "#fff", fontWeight: "bold" }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
          <Text style={{ color: "#555956" }}>
            New to this app?{" "}
            <Text
              style={{ color: "#000", fontWeight: "bold" }}
              onPress={() => {
                props.navigation.navigate("signUpScreen");
              }}
            >
              Sign up
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
    width: "100%",
    height: "100%",
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
    height: "60%",
    alignItems: "center",
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    elevation: 3,
    //backgroundColor:"transparent"
  },
  imageContainer: {
    height: "40%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  mainText: {
    paddingVertical: "7%",
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  inputContainer: {
    width: "80%",
  },
  label: {
    marginLeft: 10,
    fontSize: 12,
    color: "#555956",
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderColor: "#000",
    borderWidth: 1,
    marginVertical: "7%",
    width: "80%",
    paddingVertical: "4%",
    borderRadius: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "transparent",
    borderColor: "#999",
    borderWidth: 1,
    borderStyle: "solid",
    paddingVertical: "3%",
    borderRadius: 8,
    paddingLeft: 10,
    marginTop: 4,
    color: "#000",
    fontWeight: "bold",
  },
});
