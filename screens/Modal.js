import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Dimensions,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchUser } from "../store/actions/auth";
import { api } from "../store/api";
import { globalStyles } from "../styles/GlobalStyles";

const simpleModal = (props) => {
  const dispatch = useDispatch();
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [referralCode, setReferralCode] = useState("");
  const [codeApplied, setCodeApplied] = useState(false);

  let userID;

  const getUserID = async () => {
    const userDFS = await AsyncStorage.getItem("userData");
    const transformedData = JSON.parse(userDFS);
    userID = transformedData.userId;
  };
  getUserID();

  useEffect(() => {
    Dimensions.addEventListener("change", (e) => {
      setWidth(e.window);
    });
  }, []);

  const closeModal = (bool) => {
    console.log(bool);
    props.changeModalVisibility(bool);
  };

  const applyReferralCode = async () => {
    try {
      const response = await axios.post(`${api}/refferals/add`, {
        code: referralCode,
        userId: userID,
      });
      if (response) {
        dispatch(fetchUser(userID));
        setCodeApplied(true);
        setTimeout(() => {
          closeModal(false);
        }, 1000);
      }
    } catch (e) {
      console.log("error is", e);
    }
  };

  return (
    <TouchableOpacity disabled={true} style={styles.contentContainer}>
      <View style={[styles.modal, { width: width - 60 }]}>
        <Text style={styles.text}>Have a Referral code ?</Text>
        <Entypo
          name="cross"
          size={25}
          style={{ position: "absolute", right: 15, top: 21 }}
          onPress={() => closeModal(false)}
        />
        <AntDesign name="gift" size={50} style={{ marginVertical: 5 }} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            marginVertical: 15,
          }}
        >
          <View style={{ ...styles.inputContainer, width: 145 }}>
            <TextInput
              placeholder="Ex: fQy3Cp"
              style={{ fontWeight: "bold" }}
              value={referralCode}
              onChangeText={(e) => setReferralCode(e)}
            />
          </View>
          <TouchableOpacity
            onPress={() => applyReferralCode()}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderWidth: 1,
              borderLeftWidth: 0,
              borderColor: "rgba(0,0,0,0.3)",
              ...globalStyles.buttonStyles,
            }}
          >
            <Text>Apply</Text>
          </TouchableOpacity>
        </View>
        {codeApplied ? (
          <Text
            style={{
              color: "green",
              textAlign: "center",
              fontStyle: "italic",
              fontWeight: "bold",
            }}
          >
            {" "}
            {referralCode} applied!
          </Text>
        ) : (
          <Text
            style={{ textAlign: "center", marginTop: -5 }}
            onPress={() => {
              setReferralCode("");
            }}
          >
            Cancel
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    height: 230,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,0.1)",
    elevation: 10,
    borderRadius: 30,
    position: "relative",
  },
  text: {
    margin: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  touchableHighlight: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 10,
    alignSelf: "stretch",
    alignItems: "center",
    borderRadius: 10,
  },
  textView: {
    flex: 1,
    alignItems: "center",
  },
  buttonsView: {
    width: "100%",
    flexDirection: "row",
  },
  inputContainer: {
    width: "80%",
    backgroundColor: "pink",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
    paddingLeft: 10,
    // borderRadius:10,
    paddingVertical: 3,
  },
});

export default simpleModal;
