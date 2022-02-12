import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchFeedBacks } from "../store/actions/feedback";
import { api } from "../store/api";
import { globalStyles } from "../styles/GlobalStyles";
import meshBg from "../assets/mesh-bg.png";
import foodImage from "../assets/food.jpg";

export default function ImageScreen(props) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.feedback.feedbacks);
  const [feedbacks, setFeedbacks] = useState(data);
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);

  useEffect(() => {
    dispatch(fetchFeedBacks());
  }, []);

  useEffect(() => {
    setFeedbacks(data);
  }, [data]);

  let userID;

  const getUserID = async () => {
    const userDFS = await AsyncStorage.getItem("userData");
    const transformedData = JSON.parse(userDFS);
    userID = transformedData.userId;
  };
  getUserID();

  const addLike = async (id) => {
    try {
      let response = await axios.put(`${api}/feedback/like`, {
        feedbackID: id,
        userID: userID,
      });
      if (response) {
        dispatch(fetchFeedBacks());
      }
    } catch (e) {
      console.log("error in adding likes", e);
    }
  };

  const addDislike = async (id) => {
    try {
      let response = await axios.put(`${api}/feedback/dislike`, {
        feedbackID: id,
        userID: userID,
      });
      if (response) {
        dispatch(fetchFeedBacks());
      }
    } catch (e) {
      console.log("error in adding dislikes", e);
    }
  };

  return (
    <View style={globalStyles.backgroundImage}>
      <View style={globalStyles.container}>
        <View
          style={{
            ...globalStyles.navBar,
            backgroundColor: "rgb(242,145,152)",
            borderRadius: 30,
            marginTop: 15,
            elevation: 8,
            width: "83.5%",
            height: 65,
          }}
        >
          <TouchableOpacity
            style={{ margin: 1 }}
            onPress={() => props.navigation.openDrawer()}
          >
            <FontAwesome5 name="bars" size={24} color="black" />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", marginRight: -4 }}>
              Show all
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              color="black"
              size={30}
              onPress={() => props.navigation.navigate("homeScreen")}
            />
          </View>
          <Text
            style={{ marginLeft: "-10%", fontWeight: "bold", fontSize: 16 }}
          >
            Comments
          </Text>
        </View>
        <View
          style={{
            ...globalStyles.outerContainer,
            width: "85%",
            height: 235,
            marginVertical: 15,
          }}
        >
          <ImageBackground
            source={meshBg}
            style={globalStyles.imageBackgroundInner}
          >
            <View
              style={{
                ...globalStyles.innerContainer,
                padding: "10%",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ textAlign: "justify", fontWeight: "bold" }}>
                Hi there!Thank you for your interest in our app.We constantly
                strive to make our product better,and deliver the most value for
                our end users - so please share your feedback on what features
                you need in next versions!
              </Text>
              <TouchableOpacity
                style={{ ...styles.button, ...globalStyles.buttonStyles }}
                onPress={() => {
                  props.navigation.navigate("formScreen");
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Give Feedback
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        {feedbacks.length == 0 ? (
          <Text style={{ fontWeight: "bold", marginTop: 20 }}>
            No feedbacks yet.
          </Text>
        ) : (
          <ScrollView
            style={{ ...styles.comments, height: 200, paddingBottom: 15 }}
          >
            <View style={{ width: "100%", alignItems: "center" }}>
              {feedbacks.reverse().map((feedback) => {
                return (
                  <View
                    style={{
                      width: "86%",
                      backgroundColor: "rgba(255, 251, 251, 0.28)",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      borderRadius: 40,
                      borderWidth: 3,
                      borderColor: "rgba(0,0,0,0.04)",
                      padding: 15,
                      marginBottom: 5,
                    }}
                    key={feedback._id}
                  >
                    <View style={{ justifyContent: "center", marginRight: 10 }}>
                      <Image
                        source={foodImage}
                        style={{ height: 60, width: 60, borderRadius: 30 }}
                      />
                    </View>
                    <View style={{ flex: 1, paddingHorizontal: 7 }}>
                      <Text
                        style={{
                          textAlign: "justify",
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
                        {feedback.message}
                      </Text>
                      <View style={{ flexDirection: "row", marginTop: 2 }}>
                        {feedback.rating >= 1 ? (
                          <AntDesign name="star" color="black" size={15} />
                        ) : (
                          <AntDesign name="staro" color="black" size={15} />
                        )}
                        {feedback.rating >= 2 ? (
                          <AntDesign name="star" color="black" size={15} />
                        ) : (
                          <AntDesign name="staro" color="black" size={15} />
                        )}
                        {feedback.rating >= 3 ? (
                          <AntDesign name="star" color="black" size={15} />
                        ) : (
                          <AntDesign name="staro" color="black" size={15} />
                        )}
                        {feedback.rating >= 4 ? (
                          <AntDesign name="star" color="black" size={15} />
                        ) : (
                          <AntDesign name="staro" color="black" size={15} />
                        )}
                        {feedback.rating >= 5 ? (
                          <AntDesign name="star" color="black" size={15} />
                        ) : (
                          <AntDesign name="staro" color="black" size={15} />
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          width: "70%",
                          paddingHorizontal: "6%",
                          alignItems: "center",
                          marginTop: 5,
                          justifyContent: "space-evenly",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text style={{ marginTop: 5 }}>
                            {feedback.likes.count}
                          </Text>
                          <AntDesign
                            name={like ? "like1" : "like2"}
                            color="black"
                            size={23}
                            onPress={() => {
                              addLike(feedback._id);
                            }}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 4,
                          }}
                        >
                          <Text style={{ marginBottom: 4 }}>
                            {feedback.dislikes.count}
                          </Text>
                          <AntDesign
                            name={dislike ? "dislike1" : "dislike2"}
                            color="black"
                            size={23}
                            onPress={() => {
                              addDislike(feedback._id);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
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
  },
});
