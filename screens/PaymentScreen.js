import React, { useState, useEffect } from "react";
import { PaymentView } from "../components/Payment";
import CountDown from "react-native-countdown-component";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import meshBg from "../assets/mesh-bg.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "react-native-vector-icons/AntDesign";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { globalStyles } from "../styles/GlobalStyles";
import { fetchPayment, fetchPricingPlans } from "../store/actions/payment";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../store/api";
import { fetchUser } from "../store/actions/auth";

const Payment = (props) => {
  const dispatch = useDispatch();
  const [response, setResponse] = useState();
  const [makePayment, setMakePayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const paymentDetails = useSelector((state) => state.payment.payments);
  const [pytdetails, setPytdetails] = useState(paymentDetails);
  const pricingPlanData = useSelector((state) => state.payment.pricingPlans);
  const [pricingData, setPricingData] = useState(pricingPlanData);
  const [isPaid, setIsPaid] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [pricingPlanId, setPricingPlanId] = useState("");
  const [value, setValue] = useState(0);
  const userInfo = useSelector((state) => state.auth);
  const [cartInfo, setCartInfo] = useState({
    id: "5eruyt35eggr76476236523t3",
    description: "Ultra Premium Plan",
    amount: 500,
  });
  const [couponCode, setCouponCode] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [coins, setCoins] = useState(false);
  const [useCoupons, setUseCoupons] = useState(false);

  let userID;

  const getUserID = async () => {
    const userDFS = await AsyncStorage.getItem("userData");
    const transformedData = JSON.parse(userDFS);
    userID = transformedData.userId;
  };
  getUserID();

  useEffect(() => {
    dispatch(fetchPayment());
    dispatch(fetchPricingPlans());
    dispatch(fetchUser(userID));
  }, []);

  useEffect(() => {
    setPricingData(pricingPlanData);
  }, [pricingPlanData]);

  useEffect(() => {
    setPytdetails(paymentDetails);
    if (Object.keys(paymentDetails).length == 0) {
      setIsPaid(false);
    } else {
      console.log("starting..");
      setIsPaid(true);
    }
  }, [paymentDetails]);

  const couponHandler = (index) => {
    if (coins) {
      return;
    } else {
      setValue(index + 1);
      setUseCoupons(true);
    }
  };

  const coinsHandler = (planId, index) => {
    if (useCoupons) {
      return;
    } else {
      setValue(index + 1);
      useCoins(planId);
    }
  };

  const applyCouponCode = async (planId) => {
    if (!couponCode || coins) {
      return;
    } else {
      console.log("applying...", planId);
      try {
        const response = await axios.put(`${api}/pricing-plans/apply-coupon`, {
          planID: planId,
          userID,
          couponCode,
        });
        if (response) {
          setNewAmount(response.data.data.updatedPrice);
        }
      } catch (e) {
        console.log("error in applying coupon is", e);
      }
    }
  };

  const useCoins = async (planId) => {
    try {
      const response = await axios.put(`${api}/refferals/use-coins`, {
        planID: planId,
        userID,
      });
      if (response) {
        setNewAmount(response.data.data.updatedPrice);
      }
    } catch (e) {
      console.log("error in applying coupon is", e);
    }
  };

  const activatePlan = async (planId) => {
    console.log("applying...", planId);
    try {
      const response = await axios.put(`${api}/pricing-plans/activate-plan`, {
        planID: planId,
        userID,
      });
      if (response) {
        console.log("actived successfully");
      }
    } catch (e) {
      console.log("error in activating plan is", e);
    }
  };

  const onCheckStatus = async (paymentResponse) => {
    setPaymentStatus("Please wait while confirming your payment!");
    setResponse(paymentResponse);

    let jsonResponse = JSON.parse(paymentResponse);
    // perform operation to check payment status

    try {
      const stripeResponse = await axios.post(`${api}/payments/add`, {
        email: userInfo?.userObj?.email,
        product: cartInfo,
        authToken: jsonResponse,
        userID,
        pricingPlanID: pricingPlanId,
      });

      if (stripeResponse) {
        const { paid } = stripeResponse.data;
        if (paid === true) {
          setPaymentStatus("Payment Success");
          setTimeout(() => {
            dispatch(fetchPayment());
          }, 1000);
        } else {
          setPaymentStatus("Payment failed due to some issue");
        }
      } else {
        setPaymentStatus("Payment failed due to some issue");
      }
    } catch (error) {
      console.log(error);
      setPaymentStatus("Payment failed due to some issue");
    }
  };

  const paymentUI = () => {
    if (isPaid) {
      return (
        <View style={{ ...globalStyles.backgroundImage }}>
          <View style={{ ...globalStyles.container }}>
            <View style={globalStyles.navBar}>
              <TouchableOpacity
                style={{ margin: 16 }}
                onPress={() => props.navigation.openDrawer()}
              >
                <FontAwesome5 name="bars" size={24} color="black" />
              </TouchableOpacity>
              <Text
                style={{ marginLeft: "5%", fontWeight: "bold" }}
                onPress={() => props.navigation.navigate("userScreen")}
              >
                Back
              </Text>
            </View>
            <View
              style={{
                ...globalStyles.outerContainer,
                width: "90%",
                height: "78%",
              }}
            >
              <ImageBackground
                source={meshBg}
                style={globalStyles.imageBackgroundInner}
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
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 24,
                      fontWeight: "bold",
                      marginVertical: 5,
                    }}
                  >
                    {pytdetails.pricingPlan.name}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>
                    Amount paid :{" "}
                    <Text style={{ fontSize: 18 }}>
                      {pytdetails.payment.amount}
                    </Text>{" "}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>
                    About Plan :{" "}
                    <Text
                      style={{ textAlign: "justify", fontWeight: "normal" }}
                    >
                      {pytdetails.pricingPlan.description}
                    </Text>
                  </Text>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                    Benefits :{" "}
                  </Text>
                  {pytdetails.pricingPlan.benefits.map((benefit) => {
                    return (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                        key={benefit}
                      >
                        <AntDesign
                          style={{ marginRight: 10 }}
                          name="star"
                          size={12}
                          color="black"
                        />
                        <Text>{benefit}</Text>
                      </View>
                    );
                  })}
                  <Text style={{ marginTop: 5, fontWeight: "bold" }}>
                    Payment Method:{" "}
                    <Text style={{ fontWeight: "normal" }}>
                      {" "}
                      {pytdetails.payment.paymentMethod}
                    </Text>{" "}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>
                    Registered On :{" "}
                    <Text style={{ fontWeight: "normal" }}>{`${new Date(
                      pytdetails.payment.date
                    ).getDate()}/${
                      new Date(pytdetails.payment.date).getMonth() + 1
                    }/${new Date(
                      pytdetails.payment.date
                    ).getFullYear()}`}</Text>{" "}
                  </Text>
                  <Text style={{ fontWeight: "bold", marginTop: 6 }}>
                    Plan expires in :{" "}
                  </Text>
                  <View style={{ marginTop: 20 }}>
                    <CountDown
                      digitStyle={{ backgroundColor: "pink" }}
                      digitTxtStyle={{ color: "#fff" }}
                      until={
                        (new Date(pytdetails.pricingPlan.expiryDate) -
                          new Date()) /
                        1000
                      }
                      onFinish={() => {
                        alert("finished");
                        setIsExpired(true);
                      }}
                      size={22}
                    />
                  </View>
                  {isExpired ? (
                    <View
                      style={{
                        width: "100%",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setIsPaid(false)}
                        style={{
                          ...styles.uploadButton,
                          width: 200,
                          ...globalStyles.buttonStyles,
                        }}
                      >
                        <Text
                          style={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          Take Subscription
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </ImageBackground>
            </View>
          </View>
        </View>
      );
    } else if (!makePayment) {
      return (
        <View style={{ ...globalStyles.backgroundImage }}>
          <View style={{ ...globalStyles.container }}>
            <View style={globalStyles.navBar}>
              <TouchableOpacity
                style={{ margin: 16 }}
                onPress={() => props.navigation.openDrawer()}
              >
                <FontAwesome5 name="bars" size={24} color="black" />
              </TouchableOpacity>
              <Text
                style={{ marginLeft: "5%", fontWeight: "bold" }}
                onPress={() => props.navigation.navigate("userScreen")}
              >
                Back
              </Text>
            </View>
            <View style={{ width: "100%", marginLeft: "22%" }}>
              <Text
                style={{
                  backgroundColor: "rgba(255, 251, 251, 0.28)",
                  width: 150,
                  textAlign: "center",
                  paddingVertical: 10,
                  fontSize: 15,
                  fontWeight: "bold",
                  borderRadius: 30,
                }}
              >
                Subscription
              </Text>
            </View>
            <View
              style={{ width: "100%", alignItems: "center", marginTop: 10 }}
            >
              {pricingData.length == 0 ? (
                <Text>No pricing plans yet.</Text>
              ) : (
                <FlatList
                  style={{ width: "100%", height: "82%" }}
                  data={pricingData}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ width: "100%", alignItems: "center" }}>
                        <View
                          style={{
                            ...globalStyles.outerContainer,
                            width: "85%",
                            marginBottom: 20,
                          }}
                        >
                          <ImageBackground
                            source={meshBg}
                            style={globalStyles.imageBackgroundInner}
                          >
                            <View
                              style={{
                                width: "100%",
                                //alignItems: "center",
                                padding: 15,
                                height: "100%",
                                backgroundColor: "rgba(255, 255, 255, 0.5)",
                                //justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "left",
                                  marginLeft: 15,
                                  fontWeight: "bold",
                                  fontSize: 17,
                                }}
                              >
                                {item.name}
                              </Text>
                              <Text
                                style={{
                                  textAlign: "left",
                                  marginLeft: 15,
                                  fontWeight: "bold",
                                  fontSize: 13,
                                  marginVertical: 3,
                                }}
                              >
                                {item.description}
                              </Text>
                              {index + 1 == value && newAmount ? (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    paddingHorizontal: 35,
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      textAlign: "center",
                                      marginLeft: 15,
                                      fontWeight: "bold",
                                      fontSize: 18,
                                      marginTop: 12,
                                      fontStyle: "italic",
                                      textDecorationLine: "line-through",
                                      textDecorationStyle: "solid",
                                    }}
                                  >
                                    {item.price}/-
                                  </Text>
                                  <Text
                                    style={{
                                      textAlign: "center",
                                      marginLeft: 15,
                                      fontWeight: "bold",
                                      fontSize: 30,
                                      marginTop: 12,
                                    }}
                                  >
                                    {newAmount}/-
                                  </Text>
                                </View>
                              ) : (
                                <Text
                                  style={{
                                    textAlign: "center",
                                    marginLeft: 15,
                                    fontWeight: "bold",
                                    fontSize: 30,
                                    marginTop: 12,
                                    fontStyle: "italic",
                                  }}
                                >
                                  {item.price}/-
                                </Text>
                              )}
                              <Text
                                style={{
                                  marginLeft: 20,
                                  fontSize: 14,
                                  marginBottom: 5,
                                }}
                              >
                                Benefits
                              </Text>
                              <ScrollView>
                                {item.benefits.length == 0 ? (
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
                                    {item.benefits.map((bene) => {
                                      return (
                                        <View
                                          style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginLeft: 12,
                                          }}
                                          key={bene}
                                        >
                                          <AntDesign
                                            style={{ marginRight: 10 }}
                                            name="star"
                                            size={12}
                                            color="black"
                                          />
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
                                        </View>
                                      );
                                    })}
                                  </View>
                                )}
                              </ScrollView>
                              <Text
                                style={{ fontWeight: "bold", marginLeft: 12 }}
                              >
                                Expires On :{" "}
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    color: "rgba(0,0,0,0.6)",
                                  }}
                                >{`${new Date(item.expiryDate).getDate()}/${
                                  new Date(item.expiryDate).getMonth() + 1
                                }/${new Date(
                                  item.expiryDate
                                ).getFullYear()}`}</Text>{" "}
                              </Text>
                              <Text
                                style={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  color: "rgba(0,0,0,0.8)",
                                  fontSize: 13,
                                  marginVertical: 4,
                                }}
                                onPress={() => couponHandler(index)}
                              >
                                Have a Coupon Code ?{" "}
                              </Text>
                              {value == index + 1 && useCoupons ? (
                                <View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: "100%",
                                    }}
                                  >
                                    <View
                                      style={{
                                        ...styles.inputContainer,
                                        width: 150,
                                      }}
                                    >
                                      <TextInput
                                        placeholder="coupon code"
                                        value={couponCode}
                                        onChangeText={(e) => setCouponCode(e)}
                                        style={{ fontWeight: "bold" }}
                                      />
                                    </View>
                                    <TouchableOpacity
                                      onPress={() => applyCouponCode(item._id)}
                                      style={{
                                        paddingHorizontal: 10,
                                        backgroundColor: "rgba(242,145,152,1)",
                                        paddingVertical: 6,
                                        borderWidth: 1,
                                        borderLeftWidth: 0,
                                        borderColor: "rgba(0,0,0,0.3)",
                                      }}
                                    >
                                      <Text>Apply</Text>
                                    </TouchableOpacity>
                                  </View>
                                  {index + 1 == value && newAmount ? (
                                    <Text
                                      style={{
                                        color: "green",
                                        textAlign: "center",
                                        fontStyle: "italic",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Code {couponCode} applied
                                    </Text>
                                  ) : (
                                    <Text
                                      style={{
                                        textAlign: "center",
                                        marginTop: -5,
                                      }}
                                      onPress={() => {
                                        setValue(0);
                                        setCouponCode("");
                                        setUseCoupons(false);
                                      }}
                                    >
                                      Cancel
                                    </Text>
                                  )}
                                </View>
                              ) : null}
                              <Text style={{ textAlign: "center" }}>Or</Text>
                              <Text
                                style={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                                onPress={() => coinsHandler(item._id, index)}
                              >
                                {" "}
                                Use coins in payment ?{" "}
                              </Text>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  width: "100%",
                                  marginTop: 4,
                                  borderRadius: 30,
                                  overflow: "hidden",
                                  marginBottom: 6,
                                }}
                              >
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: 17,
                                    marginTop: 4,
                                    width: 150,
                                    backgroundColor: "rgba(242,145,152,1)",
                                    borderRadius: 30,
                                    textAlign: "center",
                                    paddingVertical: 5,
                                    textAlignVertical: "center",
                                  }}
                                  onPress={() => {
                                    activatePlan(item._id);
                                    setPricingPlanId(item._id);
                                    setCartInfo({
                                      ...cartInfo,
                                      description: item.name,
                                      amount:
                                        index + 1 == value && newAmount
                                          ? newAmount
                                          : item.price,
                                    });
                                    setMakePayment(true);
                                  }}
                                >
                                  Proceed
                                </Text>
                              </View>
                            </View>
                          </ImageBackground>
                        </View>
                      </View>
                    );
                  }}
                />
              )}
            </View>
          </View>
        </View>
      );
      // show to make payment
    } else {
      if (response !== undefined) {
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: 300,
              marginTop: 90,
            }}
          >
            <Text style={{ fontSize: 25, margin: 10, color: "pink" }}>
              {paymentStatus}{" "}
            </Text>
            {/* <Text style={{ fontSize: 16, margin: 10}}> { response} </Text> */}
          </View>
        );
      } else {
        return (
          <PaymentView
            onCheckStatus={onCheckStatus}
            product={cartInfo.description}
            amount={cartInfo.amount}
          />
        );
      }
    }
  };

  return <View style={styles.mainContainer}>{paymentUI()}</View>;
};

export default Payment;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    position: "relative",
  },
  navBar: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "8%",
    justifyContent: "space-between",
    width: "100%",
    height: 70,
  },
  uploadButton: {
    elevation: 6,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  inputContainer: {
    width: "80%",
    backgroundColor: "pink",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
    paddingLeft: 10,
    marginVertical: 7,
    // borderRadius:10,
    paddingVertical: 3,
  },
});
