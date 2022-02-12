import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import axios from "axios";
import { api } from "../store/api";
import { fetchFeedBacks } from "../store/actions/feedback";
import { Slider } from "react-native-range-slider-expo";
import { globalStyles } from "../styles/GlobalStyles";
import meshBg from "../assets/mesh-bg.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ImageScreen(props) {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const [message, setMessage] = useState("");
  let userID;

  const getUserID = async () => {
    const userDFS = await AsyncStorage.getItem("userData");
    const transformedData = JSON.parse(userDFS);
    userID = transformedData.userId;
  };
  getUserID();
  const submitHandler = async () => {
    try {
      const data = await axios.post(`${api}/feedback/add`, {
        rating: value,
        message,
        userID: userID,
      });
      dispatch(fetchFeedBacks());
      props.navigation.navigate("fbScreen");
    } catch (e) {
      console.log("error from fbform", e);
    }
  };
  return (
    <View style={globalStyles.backgroundImage}>
      <View style={globalStyles.container}>
        <View style={{ ...globalStyles.navBar, paddingLeft: "8%" }}>
          <Text
            style={{ fontWeight: "bold", fontSize: 16 }}
            onPress={() => props.navigation.navigate("fbScreen")}
          >
            Back
          </Text>
        </View>
        <View
          style={{
            height: "75%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              height: 320,
              width: "85%",
              backgroundColor: "rgba(255, 251, 251, 0.28)",
              borderRadius: 40,
              borderWidth: 3,
              borderColor: "rgba(0,0,0,0.04)",
              alignItems: "center",
              paddingVertical: 22,
            }}
          >
            <View style={{ ...styles.inputContainer, width: "82%" }}>
              <Text style={{ ...styles.label, marginBottom: -10 }}>
                Rating:
              </Text>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  marginLeft: "3%",
                }}
              >
                <Slider
                  min={0}
                  max={5}
                  step={1}
                  valueOnChange={(value) => setValue(value)}
                  initialValue={5}
                  knobColor="pink"
                  valueLabelsBackgroundColor="rgba(245,32,56,0.5)"
                  inRangeBarColor="#e5e5e5"
                  outOfRangeBarColor="orange"
                />
              </View>
              <Text
                style={{
                  marginTop: -12,
                  marginLeft: "4%",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                Value: {value}
              </Text>
            </View>
            <View style={{ ...styles.inputContainer, marginTop: 8 }}>
              <Text style={styles.label}>Message:</Text>
              <TextInput
                style={styles.input}
                placeholder="Message"
                onChangeText={(e) => setMessage(e)}
                placeholderTextColor="#000"
              />
            </View>
            <TouchableOpacity
              style={{
                ...styles.button,
                marginTop: 15,
                ...globalStyles.buttonStyles,
              }}
              onPress={submitHandler}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                Add Feedback
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: "#000",
    borderWidth: 1,
    width: "60%",
    paddingVertical: "3.5%",
    borderRadius: 23,
  },
  text: {
    fontWeight: "bold",
    fontSize: 17,
    color: "rgba(0,0,0,0.7)",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: "3%",
  },
  comments: {
    width: "100%",
    // alignItems:"center"
  },
  inputContainer: {
    width: "80%",
  },
  label: {
    marginLeft: 10,
    fontSize: 13,
    color: "#555956",
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
