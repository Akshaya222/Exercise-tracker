import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Button,
  TextInput,
  ScrollView,
} from "react-native";
import { globalStyles } from "../styles/GlobalStyles";
import meshBg from "../assets/mesh-bg.png";
import { FontAwesome5 } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
import { api } from "../store/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchPricingPlans } from "../store/actions/payment";

const HomeScreen = (props) => {
  const dispatch = useDispatch();
  const pricingPlanData = useSelector((state) => state.payment.pricingPlans);
  const [pricingData, setPricingData] = useState(pricingPlanData);
  console.log("pricing data from pricingplans page", pricingData);

  useEffect(() => {
    dispatch(fetchPricingPlans());
  }, []);

  useEffect(() => {
    setPricingData(pricingPlanData);
  }, [pricingPlanData]);

  const deletePlan = async (planId) => {
    console.log("planId", planId);
    try {
      let response = await axios.delete(
        `${api}/pricing-plans/delete?planID=${planId}`
      );
      if (response) {
        dispatch(fetchPricingPlans());
      }
    } catch (e) {
      console.log("error is", e);
    }
  };

  return (
    <View style={globalStyles.backgroundImage}>
      <View style={{ ...globalStyles.container }}>
        <View style={{ ...globalStyles.navBar, height: 45, marginTop: 5 }}>
          <Text
            style={{ marginLeft: "5%", fontWeight: "bold" }}
            onPress={() => props.navigation.navigate("adminScreen")}
          >
            Back
          </Text>
          <Text
            style={{ marginRight: "32%", fontWeight: "bold", fontSize: 18 }}
          >
            Pricing Plans
          </Text>
        </View>
        <View style={{ width: "100%" }}>
          <View style={{ width: "100%" }}>
            {pricingData.length == 0 ? (
              <Text>No pricing plans yet.Please add one</Text>
            ) : (
              <ScrollView
                style={{ width: "100%", paddingBottom: 10, height: "87%" }}
              >
                <View style={{ width: "100%", alignItems: "center" }}>
                  {pricingData.map((pricing) => {
                    return (
                      <View
                        style={{
                          width: "87%",
                          marginVertical: 10,
                          backgroundColor: "rgba(255, 251, 251, 0.28)",
                          borderRadius: 35,
                          borderWidth: 3,
                          borderColor: "rgba(0,0,0,0.05)",
                          paddingVertical: 13,
                          paddingHorizontal: 16,
                        }}
                        key={pricing._id}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: 10,
                            marginVertical: 5,
                            justifyContent: "space-around",
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 17,
                              textAlign: "center",
                            }}
                          >
                            {pricing.name}
                          </Text>
                          <Feather
                            name="trash-2"
                            size={20}
                            color="black"
                            onPress={() => deletePlan(pricing._id)}
                          />
                        </View>
                        <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
                          About plan :{" "}
                          <Text
                            style={{
                              fontWeight: "normal",
                              textAlign: "justify",
                            }}
                          >
                            {pricing.description}
                          </Text>{" "}
                        </Text>
                        <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
                          Price :{" "}
                          <Text style={{ fontSize: 16 }}>{pricing.price}</Text>{" "}
                        </Text>
                        <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
                          Expires On :{" "}
                          <Text style={{ fontWeight: "normal" }}>{`${new Date(
                            pricing.expiryDate
                          ).getDate()}/${
                            new Date(pricing.expiryDate).getMonth() + 1
                          }/${new Date(
                            pricing.expiryDate
                          ).getFullYear()}`}</Text>{" "}
                        </Text>
                        <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
                          Number of users :{" "}
                          <Text style={{ fontWeight: "normal" }}>
                            {pricing.numOfUsers}
                          </Text>{" "}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                ...globalStyles.buttonStyles,
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 20,
                marginTop: 9,
                elevation: 7,
              }}
              onPress={() => props.navigation.navigate("planForm")}
            >
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                Add new plan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
