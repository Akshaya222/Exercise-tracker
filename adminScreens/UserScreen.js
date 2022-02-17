import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../store/actions/auth";
import { globalStyles } from "../styles/GlobalStyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import meshBg from "../assets/mesh-bg.png";
import OuterContainer from "../components/OuterContainer";

const UserScreen = (props) => {
  const user = props.navigation.getParam("userId");
  console.log(user);
  return (
    <View style={{ ...globalStyles.backgroundImage }}>
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
            onPress={() => props.navigation.navigate("usersScreen")}
            name="arrowleft"
            size={30}
          />
          <View style={{ width: "75%" }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}
            >
              {user.name}
            </Text>
          </View>
        </View>
        <OuterContainer
          styles={{
            ...globalStyles.outerContainer,
            width: "90%",
            height: "85%",
          }}
        >
          <View
            style={{
              width: "100%",
              //alignItems: "center",
              padding: 15,
              paddingHorizontal: "9%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              //justifyContent: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
              Name :{" "}
              <Text style={{ fontWeight: "normal", textAlign: "justify" }}>
                {user.name}
              </Text>{" "}
            </Text>
            <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
              Email :{" "}
              <Text style={{ fontWeight: "normal", textAlign: "justify" }}>
                {user.email}
              </Text>{" "}
            </Text>
            <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
              Coins :{" "}
              <Text style={{ fontWeight: "normal", textAlign: "justify" }}>
                {user.coins ? user.coins : 0}
              </Text>{" "}
            </Text>
            <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
              Pricing plan :{" "}
              <Text style={{ fontWeight: "normal", textAlign: "justify" }}>
                {user.pricingPlan
                  ? user.planName || " "
                  : user.freeLimit > 0
                  ? "free limit"
                  : "No"}
              </Text>
            </Text>
            <Text
              style={{ fontWeight: "bold", marginLeft: 10, marginVertical: 10 }}
            >
              Feedbacks
            </Text>
            {user.feedbacks.length == 0 ? (
              <Text style={{ marginLeft: 10 }}>No feedbacks</Text>
            ) : (
              <ScrollView
                style={{ width: "100%", height: "32%", paddingBottom: 15 }}
              >
                <View style={{ width: "100%", alignItems: "center" }}>
                  {user.feedbacks.map((feedback) => {
                    return (
                      <View
                        key={feedback._id}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginLeft: 11,
                          width: "100%",
                          alignItems: "center",
                          borderColor: "rgba(0,0,0,0.2)",
                          borderRadius: 15,
                          borderWidth: 1,
                          marginVertical: 4,
                          padding: "1%",
                        }}
                      >
                        <Text
                          style={{ color: "rgba(0,0,0,0.6)", width: "67%" }}
                        >
                          {feedback.message}
                        </Text>
                        <View style={{ flexDirection: "row", marginTop: 2 }}>
                          {feedback.rating >= 1 ? (
                            <AntDesign
                              name="star"
                              color="rgba(0,0,0,0.8)"
                              size={13}
                            />
                          ) : (
                            <AntDesign name="staro" color="black" size={13} />
                          )}
                          {feedback.rating >= 2 ? (
                            <AntDesign
                              name="star"
                              color="rgba(0,0,0,0.8)"
                              size={13}
                            />
                          ) : (
                            <AntDesign name="staro" color="black" size={13} />
                          )}
                          {feedback.rating >= 3 ? (
                            <AntDesign
                              name="star"
                              color="rgba(0,0,0,0.8)"
                              size={13}
                            />
                          ) : (
                            <AntDesign name="staro" color="black" size={13} />
                          )}
                          {feedback.rating >= 4 ? (
                            <AntDesign
                              name="star"
                              color="rgba(0,0,0,0.8)"
                              size={13}
                            />
                          ) : (
                            <AntDesign name="staro" color="black" size={13} />
                          )}
                          {feedback.rating >= 5 ? (
                            <AntDesign
                              name="star"
                              color="rgba(0,0,0,0.8)"
                              size={13}
                            />
                          ) : (
                            <AntDesign name="staro" color="black" size={13} />
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            )}
            <Text
              style={{ fontWeight: "bold", marginLeft: 10, marginVertical: 10 }}
            >
              Images
            </Text>
            {user.images.length == 0 ? (
              <Text style={{ marginLeft: 10 }}>No Images</Text>
            ) : (
              <ScrollView
                style={{
                  width: "100%",
                  height: "32%",
                  paddingBottom: 15,
                  marginBottom: 10,
                }}
              >
                <View style={{ width: "100%", alignItems: "center" }}>
                  {user.images.map((image) => {
                    return (
                      <View
                        key={image._id}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginVertical: 4,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Text style={{ marginLeft: 12 }}>{image.name}</Text>
                          <Text style={{ marginLeft: "-12%" }}>
                            {" "}
                            <Text style={{ fontWeight: "bold" }}>
                              {image.calories}
                            </Text>{" "}
                            calories
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </View>
        </OuterContainer>
      </View>
    </View>
  );
};

export default UserScreen;

const styles = StyleSheet.create({});
