import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native";
import { globalStyles } from "../styles/GlobalStyles";
import meshBg from "../assets/mesh-bg.png";
import { FontAwesome5 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import { fetchAllUsers } from "../store/actions/auth";

const HomeScreen = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.allUsers);
  const [userInfo, setUserInfo] = useState(userData);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, []);

  useEffect(() => {
    setUserInfo(userData);
  }, [userData]);

  return (
    <ImageBackground source={meshBg} style={globalStyles.backgroundImage}>
      <View style={{ ...globalStyles.container }}>
        <View
          style={{
            width: "100%",
            marginTop: 20,
            marginBottom: 10,
            flexDirection: "row",
            paddingLeft: "8%",
          }}
        >
          <AntDesign
            onPress={() => props.navigation.navigate("adminScreen")}
            name="arrowleft"
            size={30}
          />
          <View style={{ width: "75%" }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}
            >
              Users
            </Text>
          </View>
        </View>
        <View style={{ width: "100%" }}>
          {userInfo?.length == 0 ? (
            <Text>No users</Text>
          ) : (
            <ScrollView
              style={{ width: "100%", paddingBottom: 10, height: "87%" }}
            >
              <View style={{ width: "100%", alignItems: "center" }}>
                {userInfo?.map((user) => {
                  return (
                    <TouchableOpacity
                      key={user._id}
                      style={{
                        ...globalStyles.buttonStyles,
                        width: "87%",
                        marginVertical: 10,
                        borderRadius: 35,
                        borderWidth: 3,
                        borderColor: "rgba(0,0,0,0.05)",
                        paddingVertical: 13,
                        paddingHorizontal: 16,
                      }}
                      key={user._id}
                      onPress={() => {
                        props.navigation.navigate({
                          routeName: "userScreen",
                          params: {
                            userId: user,
                          },
                        });
                      }}
                    >
                      <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
                        Name :{" "}
                        <Text
                          style={{ fontWeight: "normal", textAlign: "justify" }}
                        >
                          {user.name}
                        </Text>{" "}
                      </Text>
                      <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
                        Email :{" "}
                        <Text
                          style={{ fontWeight: "normal", textAlign: "justify" }}
                        >
                          {user.email}
                        </Text>{" "}
                      </Text>
                      <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
                        Coins :{" "}
                        <Text
                          style={{ fontWeight: "normal", textAlign: "justify" }}
                        >
                          {user.coins ? user.coins : 0}
                        </Text>{" "}
                      </Text>
                      <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
                        Pricing plan :{" "}
                        <Text
                          style={{ fontWeight: "normal", textAlign: "justify" }}
                        >
                          {user.pricingPlan
                            ? user.planName || " "
                            : user.freeLimit > 0
                            ? "free limit"
                            : "No"}
                        </Text>
                      </Text>
                      <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
                        Number of Images :{" "}
                        <Text
                          style={{ fontWeight: "normal", textAlign: "justify" }}
                        >
                          {user.images.length}
                        </Text>
                      </Text>
                      <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
                        Number of feedbacks :{" "}
                        <Text
                          style={{ fontWeight: "normal", textAlign: "justify" }}
                        >
                          {user.feedbacks.length}
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
