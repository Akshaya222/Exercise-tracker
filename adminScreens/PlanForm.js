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

const PlanForm = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState("");
  const [inputObj, setInputObj] = useState({
    name: "",
    description: "",
    price: 0,
  });
  const [expiryMonths, setExpiryMonths] = useState("");
  const [array, setArray] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [coupon, setCoupon] = useState({
    name: "",
    amount: 0,
  });

  const submitHandler = async () => {
    const d = new Date();
    const dateInUtc = new Date(
      d.getFullYear(),
      d.getMonth() + Number(expiryMonths),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds()
    );
    const newDate = new Date(
      dateInUtc.getTime() - dateInUtc.getTimezoneOffset() * 60 * 1000
    );
    const data = {
      name: inputObj.name,
      benefits: array,
      couponCodes: coupons,
      expiryDate: newDate.toString(),
      description: inputObj.description,
      price: Number(inputObj.price),
    };
    const config = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(`${api}/pricing-plans/add`, config)
      .then((data) => data.json())
      .then((res) => {
        if (res.status == "failure") {
          console.log(res);
        } else {
          console.log("output is", res);
          dispatch(fetchPricingPlans());
          props.navigation.navigate("adminPriScreen");
        }
      })
      .catch((e) => {
        setError(e);
        console.log("error is", e);
      });
  };

  return (
    <View style={globalStyles.backgroundImage}>
      <View style={{ ...globalStyles.container }}>
        <View style={globalStyles.navBar}>
          <Text
            style={{ marginLeft: "5%", fontWeight: "bold" }}
            onPress={() => props.navigation.navigate("adminPriScreen")}
          >
            Back
          </Text>
        </View>
        <ScrollView style={{ width: "100%" }}>
          <View
            style={{
              height: 550,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                height: "100%",
                width: "85%",
                backgroundColor: "rgba(255, 251, 251, 0.28)",
                borderRadius: 40,
                borderWidth: 3,
                borderColor: "rgba(0,0,0,0.04)",
                alignItems: "center",
                paddingVertical: 22,
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}
              >
                Add Pricing Plan
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="name of plan"
                  value={inputObj.name}
                  onChangeText={(e) => setInputObj({ ...inputObj, name: e })}
                  style={{ fontWeight: "bold" }}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="about plan.."
                  value={inputObj.description}
                  onChangeText={(e) =>
                    setInputObj({ ...inputObj, description: e })
                  }
                  style={{ fontWeight: "bold" }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "80%",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <View
                    style={{
                      ...styles.inputContainer,
                      width: 65,
                      paddingVertical: 2,
                    }}
                  >
                    <TextInput
                      placeholder="price"
                      onChangeText={(e) =>
                        setInputObj({ ...inputObj, price: e })
                      }
                      style={{ fontWeight: "bold" }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <View
                    style={{
                      ...styles.inputContainer,
                      width: 80,
                      paddingVertical: 2,
                      paddingLeft: 2,
                    }}
                  >
                    <TextInput
                      placeholder="expires in"
                      value={expiryMonths}
                      onChangeText={(e) => setExpiryMonths(e)}
                      style={{ fontWeight: "bold" }}
                    />
                  </View>
                  <Text style={{ marginLeft: 4, fontWeight: "bold" }}>
                    months
                  </Text>
                </View>
              </View>
              <View style={{ width: "80%", marginTop: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Benefits:</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      ...styles.inputContainer,
                      width: "85%",
                      marginRight: 10,
                    }}
                  >
                    <TextInput
                      placeholder="benefit"
                      value={data}
                      style={{ fontWeight: "bold" }}
                      onChangeText={(e) => setData(e)}
                    />
                  </View>
                  <Feather
                    name="plus-circle"
                    size={26}
                    color="rgba(0,0,0,0.6)"
                    onPress={() => {
                      setArray([...array, data]);
                      setData("");
                    }}
                  />
                </View>
                <ScrollView style={{ height: 55 }}>
                  {array.length == 0 ? (
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(0,0,0,0.5)",
                        fontWeight: "bold",
                      }}
                    >
                      Added benefits{" "}
                    </Text>
                  ) : (
                    <View>
                      {array.map((bene) => {
                        return (
                          <Text
                            style={{
                              marginVertical: 2,
                              fontWeight: "bold",
                              color: "rgba(0,0,0,0.6)",
                            }}
                            key={bene}
                          >
                            {bene}
                          </Text>
                        );
                      })}
                    </View>
                  )}
                </ScrollView>
              </View>
              <View style={{ width: "80%", marginTop: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Coupons:</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      ...styles.inputContainer,
                      width: 115,
                      paddingLeft: 5,
                    }}
                  >
                    <TextInput
                      value={coupon.name}
                      placeholder="coupon code"
                      onChangeText={(e) => setCoupon({ ...coupon, name: e })}
                      style={{ fontWeight: "bold" }}
                    />
                  </View>
                  <View
                    style={{
                      ...styles.inputContainer,
                      width: 65,
                      paddingLeft: 1,
                    }}
                  >
                    <TextInput
                      value={coupon.amount}
                      placeholder="amount"
                      keyboardType="numeric"
                      onChangeText={(e) => setCoupon({ ...coupon, amount: e })}
                      style={{ fontWeight: "bold" }}
                    />
                  </View>
                  <Feather
                    name="plus-circle"
                    size={26}
                    color="rgba(0,0,0,0.6)"
                    onPress={() => {
                      setCoupons([
                        ...coupons,
                        { name: coupon.name, amount: Number(coupon.amount) },
                      ]);
                      setCoupon({ amount: 0, name: "" });
                    }}
                  />
                </View>
                <ScrollView style={{ height: 55 }}>
                  {coupons.length == 0 ? (
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(0,0,0,0.5)",
                        fontWeight: "bold",
                      }}
                    >
                      Added Coupons{" "}
                    </Text>
                  ) : (
                    <View>
                      {coupons.map((coupon) => {
                        return (
                          <View
                            style={{ marginVertical: 2, flexDirection: "row" }}
                            key={coupon.name}
                          >
                            <Text
                              style={{
                                fontWeight: "bold",
                                color: "rgba(0,0,0,0.6)",
                                marginRight: 20,
                              }}
                            >
                              {coupon.name}
                            </Text>
                            <Text
                              style={{
                                fontWeight: "bold",
                                color: "rgba(0,0,0,0.6)",
                              }}
                            >
                              {coupon.amount}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </ScrollView>
              </View>
              <TouchableOpacity
                onPress={() => submitHandler()}
                style={{
                  ...globalStyles.buttonStyles,
                  paddingVertical: 7,
                  paddingHorizontal: 25,
                  borderRadius: 20,
                  marginTop: 11,
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                  Proceed
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default PlanForm;

const styles = StyleSheet.create({
  inputContainer: {
    width: "80%",
    backgroundColor: "pink",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
    paddingLeft: 10,
    marginVertical: 7,
    borderRadius: 10,
    paddingVertical: 3,
  },
});
