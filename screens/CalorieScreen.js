import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
  TouchableOpacity,
  Button,
  Platform,
  ScrollView,
} from "react-native";
import PieChart from "react-native-pie-chart";
import {
  fetchFavorites,
  fetchImages,
  selectMeal,
} from "../store/actions/images";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../store/api";
import { globalStyles } from "../styles/GlobalStyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import meshBg from "../assets/mesh-bg.png";
import { logout } from "../store/actions/auth";
import foodImage from "../assets/food.jpg";
import axios from "axios";

export default function ImageScreen(props) {
  const dispatch = useDispatch();
  const selectedMeal = useSelector((state) => state.image.selectedMeal);
  const [mealSelected, setMealSelected] = useState(selectedMeal);
  const [isIngre, setIsIngre] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  console.log("selectedMeal is ", selectedMeal);
  const [index, setIndex] = useState(null);
  const widthAndHeight = 140;
  const series = [123, 121, 123, 120];
  const sliceColor = [
    "rgba(13, 189, 183,0.5)",
    "rgba(204, 100, 14,0.5)",
    "rgba(68, 219, 31,0.5)",
    "rgba(244, 51, 248,0.5)",
  ];
  const size = 168;
  const strokeWidth = 30;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  let userID;

  const getUserID = async () => {
    const userDFS = await AsyncStorage.getItem("userData");
    const transformedData = JSON.parse(userDFS);
    userID = transformedData.userId;
  };
  getUserID();

  useEffect(() => {
    setMealSelected(selectedMeal);
    if (selectedMeal.url) {
      getIngredients();
    }
  }, [selectedMeal]);

  useEffect(() => {
    getRecommendations();
  }, []);

  const getRecommendations = async () => {
    try {
      let res = await axios.get(`${api}/recommendations/rec/image`);
      setRecommendations(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getIngredients = async () => {
    try {
      let res = await axios.get("http://20.115.37.217:5003/ingredients/");
      if (res.data.ingredients == "None") {
        setIsIngre(false);
      } else {
        setIsIngre(true);
        setIngredients(res.data.ingredients.split(","));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const favoriteHandler = async () => {
    let url = mealSelected.isFavorite
      ? `${api}/favourites/remove`
      : `${api}/favourites/add`;
    try {
      const response = await axios.put(url, {
        userID: userID,
        imageID: selectedMeal._id,
      });
      dispatch(fetchFavorites());
      setMealSelected(response.data.data);
    } catch (e) {
      console.log("error is", e);
    }
  };

  const colors = [
    {
      main: "rgba(13, 189, 183,0.7)",
      sideBox: "rgba(13, 189, 183,0.7)",
    },
    {
      main: "rgba(244, 51, 248,0.7)",
      sideBox: "rgba(244, 51, 248,1)",
    },
    {
      main: "rgba(242, 155, 5,0.7)",
      sideBox: "rgba(242, 155, 5,1)",
    },
    {
      main: "rgba(8, 178, 204,0.7)",
      sideBox: "rgba(8, 178, 204,1)",
    },
    {
      main: "rgba(204, 100, 14,0.7)",
      sideBox: "rgba(204, 100, 14,1)",
    },
    {
      main: "rgba(68, 219, 31,0.7)",
      sideBox: "rgba(68, 219, 31,1)",
    },
    {
      main: "rgba(165, 36, 224,0.7)",
      sideBox: "rgba(165, 36, 224,1)",
    },
    {
      main: "rgba(0, 128, 0,0.7)",
      sideBox: "rgba(0, 128, 0,1)",
    },
    {
      main: "rgba(26, 68, 161,0.7)",
      sideBox: "rgba(26, 68, 161,1)",
    },
    {
      main: "rgba(123, 126, 133,0.7)",
      sideBox: "rgba(123, 126, 133,1)",
    },
  ];
  const data = [
    {
      id: "123",
      title: "Panner",
      quantity: "250gm",
    },
    {
      id: "122",
      title: "Panner",
      quantity: "250gm",
    },
    {
      id: "121",
      title: "Panner",
      quantity: "250gm",
    },
    {
      id: "125",
      title: "Panner",
      quantity: "250gm",
    },
    {
      id: "124",
      title: "Panner",
      quantity: "250gm",
    },
    {
      id: "127",
      title: "Panner",
      quantity: "250gm",
    },
    {
      id: "128",
      title: "Panner",
      quantity: "250gm",
    },
  ];

  const clickHandler = (selectedIndex) => {
    console.log(selectedIndex);
    if (selectedIndex === index) {
      setIndex(null);
    } else {
      setIndex(selectedIndex);
    }
  };

  return (
    <View style={globalStyles.backgroundImage}>
      <View style={{ ...globalStyles.container, position: "relative" }}>
        <View
          style={{ ...globalStyles.navBar, height: 55, paddingRight: "10%" }}
        >
          <Text
            style={{ fontWeight: "bold", marginLeft: "5%" }}
            onPress={() => {
              props.navigation.navigate("uploadScreen");
            }}
          >
            Back
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            {mealSelected?.name}
          </Text>
          <AntDesign
            name={mealSelected.isFavorite ? "heart" : "hearto"}
            style={{ marginTop: 7, marginRight: 10 }}
            color="black"
            size={25}
            onPress={favoriteHandler}
          />
        </View>
        <ScrollView
          style={{ height: "80%", width: "100%", marginBottom: "18%" }}
        >
          <View style={{ width: "100%", width: "100%", alignItems: "center" }}>
            <View
              style={{
                ...globalStyles.outerContainer,
                width: "85%",
                height: 200,
              }}
            >
              <ImageBackground
                source={meshBg}
                style={globalStyles.imageBackgroundInner}
              >
                <View
                  style={{
                    ...globalStyles.innerContainer,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <PieChart
                    widthAndHeight={widthAndHeight}
                    series={series}
                    sliceColor={sliceColor}
                    doughnut={true}
                    coverRadius={0.6}
                    coverFill={"#FFF"}
                  />
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <View
                        style={{
                          height: 15,
                          width: 20,
                          backgroundColor: sliceColor[0],
                          marginRight: 4,
                        }}
                      ></View>
                      <Text style={{ fontWeight: "bold" }}>
                        <Text style={{ color: "rgba(0,0,0,0.5)" }}>Carbs</Text>{" "}
                        10%
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <View
                        style={{
                          height: 15,
                          width: 20,
                          backgroundColor: sliceColor[1],
                          marginRight: 4,
                        }}
                      ></View>
                      <Text style={{ fontWeight: "bold" }}>
                        <Text style={{ color: "rgba(0,0,0,0.5)" }}>
                          Proteins
                        </Text>{" "}
                        40%
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <View
                        style={{
                          height: 15,
                          width: 20,
                          backgroundColor: sliceColor[2],
                          marginRight: 4,
                        }}
                      ></View>
                      <Text style={{ fontWeight: "bold" }}>
                        <Text style={{ color: "rgba(0,0,0,0.5)" }}>Fats</Text>{" "}
                        50%
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <View
                        style={{
                          height: 15,
                          width: 20,
                          backgroundColor: sliceColor[3],
                          marginRight: 4,
                        }}
                      ></View>
                      <Text style={{ fontWeight: "bold" }}>
                        <Text style={{ color: "rgba(0,0,0,0.5)" }}>Fibers</Text>{" "}
                        50%
                      </Text>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </View>
            <View style={{ height: 280, width: "98%", marginBottom: 20 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  marginVertical: 10,
                  marginLeft: "9%",
                }}
              >
                Your meals Include:
              </Text>
              <View
                style={{ width: "100%", height: "100%", alignItems: "center" }}
              >
                <View
                  style={{
                    ...globalStyles.outerContainer,
                    width: "85%",
                    height: "90%",
                  }}
                >
                  <ImageBackground
                    source={meshBg}
                    style={globalStyles.imageBackgroundInner}
                  >
                    <View
                      style={{
                        ...globalStyles.innerContainer,
                        padding: 20,
                      }}
                    >
                      <View style={{ width: "100%", height: "100%" }}>
                        <View
                          style={{
                            width: "95%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 15,
                          }}
                        >
                          <Text
                            style={{
                              backgroundColor: "#E6E7E8",
                              paddingVertical: 8,
                              paddingHorizontal: 14,
                              borderRadius: 13,
                              elevation: 5,
                            }}
                          >
                            Items
                          </Text>
                          <Text
                            style={{
                              backgroundColor: "#E6E7E8",
                              paddingVertical: 8,
                              paddingHorizontal: 12,
                              borderRadius: 13,
                              elevation: 5,
                            }}
                          >
                            Quantity
                          </Text>
                        </View>
                        <View>
                          {!isIngre ? (
                            <Text style={{ marginLeft: 8, fontWeight: "bold" }}>
                              No Ingredients
                            </Text>
                          ) : (
                            <ScrollView
                              style={{ width: "100%", height: 210 }}
                              nestedScrollEnabled={true}
                            >
                              <View
                                style={{
                                  width: "100%",
                                  marginLeft: "7%",
                                  paddingBottom: 20,
                                  flexGrow: 1,
                                }}
                              >
                                {ingredients.map((dt, id) => {
                                  return (
                                    <View
                                      style={{ width: "100%", marginTop: -6 }}
                                      key={dt}
                                    >
                                      <TouchableOpacity
                                        onPress={() => clickHandler(id)}
                                        style={{
                                          flexDirection: "row",
                                          marginVertical: 9,
                                          width: "83%",
                                          justifyContent: "space-between",
                                          backgroundColor: "#fff",
                                          elevation: 5,
                                          paddingVertical: 12,
                                          paddingHorizontal: 10,
                                          borderRadius: 15,
                                        }}
                                      >
                                        <Text>{dt}</Text>
                                      </TouchableOpacity>
                                      {index == id && (
                                        <View
                                          style={{
                                            width: "100%",
                                            height: 120,
                                            marginLeft: -10,
                                            marginTop: -7,
                                            marginBottom: 9,
                                          }}
                                        >
                                          <View style={{ width: "100%" }}>
                                            <Text
                                              style={{
                                                textAlign: "left",
                                                paddingLeft: "10%",
                                                marginBottom: -12,
                                                color: "rgba(0,0,0,0.6)",
                                              }}
                                            >
                                              carbs
                                            </Text>
                                            <View
                                              style={{
                                                width: "90%",
                                                alignItems: "center",
                                                marginTop: -2,
                                              }}
                                            >
                                              <View
                                                style={{
                                                  width: "80%",
                                                  alignItems: "center",
                                                  marginTop: 15,
                                                  position: "relative",
                                                }}
                                              >
                                                <View
                                                  style={{
                                                    height: 15,
                                                    backgroundColor: "#E6E7E8",
                                                    width: "100%",
                                                    borderRadius: 50,
                                                  }}
                                                ></View>
                                                <View
                                                  style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    height: "100%",
                                                    width: "60%",
                                                    borderRadius: 30,
                                                    backgroundColor:
                                                      colors[1].main,
                                                    left: 0,
                                                    zIndex: 3,
                                                  }}
                                                ></View>
                                                <Text
                                                  style={{
                                                    position: "absolute",
                                                    top: -5,
                                                    height: 27,
                                                    width: 43,
                                                    borderRadius: 12,
                                                    backgroundColor:
                                                      colors[1].sideBox,
                                                    color: "#fff",
                                                    left: "55%",
                                                    zIndex: 3,
                                                    textAlign: "center",
                                                    textAlignVertical: "center",
                                                    fontSize: 12,
                                                  }}
                                                >
                                                  60%
                                                </Text>
                                              </View>
                                            </View>
                                          </View>
                                          <View style={{ width: "100%" }}>
                                            <Text
                                              style={{
                                                textAlign: "left",
                                                paddingLeft: "10%",
                                                marginBottom: -12,
                                                color: "rgba(0,0,0,0.6)",
                                              }}
                                            >
                                              proteins
                                            </Text>
                                            <View
                                              style={{
                                                width: "90%",
                                                alignItems: "center",
                                                marginTop: -2,
                                              }}
                                            >
                                              <View
                                                style={{
                                                  width: "80%",
                                                  alignItems: "center",
                                                  marginTop: 15,
                                                  position: "relative",
                                                }}
                                              >
                                                <View
                                                  style={{
                                                    height: 15,
                                                    backgroundColor: "#E6E7E8",
                                                    width: "100%",
                                                    borderRadius: 50,
                                                  }}
                                                ></View>
                                                <View
                                                  style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    height: "100%",
                                                    width: "35%",
                                                    borderRadius: 30,
                                                    backgroundColor:
                                                      colors[2].main,
                                                    left: 0,
                                                    zIndex: 3,
                                                  }}
                                                ></View>
                                                <Text
                                                  style={{
                                                    position: "absolute",
                                                    top: -5,
                                                    height: 27,
                                                    width: 43,
                                                    borderRadius: 12,
                                                    backgroundColor:
                                                      colors[2].sideBox,
                                                    color: "#fff",
                                                    left: "30%",
                                                    zIndex: 3,
                                                    textAlign: "center",
                                                    textAlignVertical: "center",
                                                    fontSize: 12,
                                                  }}
                                                >
                                                  35%
                                                </Text>
                                              </View>
                                            </View>
                                          </View>
                                          <View style={{ width: "100%" }}>
                                            <Text
                                              style={{
                                                textAlign: "left",
                                                paddingLeft: "10%",
                                                marginBottom: -12,
                                                color: "rgba(0,0,0,0.6)",
                                              }}
                                            >
                                              fats
                                            </Text>
                                            <View
                                              style={{
                                                width: "90%",
                                                alignItems: "center",
                                                marginTop: -2,
                                              }}
                                            >
                                              <View
                                                style={{
                                                  width: "80%",
                                                  alignItems: "center",
                                                  marginTop: 15,
                                                  position: "relative",
                                                }}
                                              >
                                                <View
                                                  style={{
                                                    height: 15,
                                                    backgroundColor: "#E6E7E8",
                                                    width: "100%",
                                                    borderRadius: 50,
                                                  }}
                                                ></View>
                                                <View
                                                  style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    height: "100%",
                                                    width: "80%",
                                                    borderRadius: 30,
                                                    backgroundColor:
                                                      colors[0].main,
                                                    left: 0,
                                                    zIndex: 3,
                                                  }}
                                                ></View>
                                                <Text
                                                  style={{
                                                    position: "absolute",
                                                    top: -5,
                                                    height: 27,
                                                    width: 43,
                                                    borderRadius: 12,
                                                    backgroundColor:
                                                      colors[0].sideBox,
                                                    color: "#fff",
                                                    left: "75%",
                                                    zIndex: 3,
                                                    textAlign: "center",
                                                    textAlignVertical: "center",
                                                    fontSize: 12,
                                                  }}
                                                >
                                                  80%
                                                </Text>
                                              </View>
                                            </View>
                                          </View>
                                        </View>
                                      )}
                                    </View>
                                  );
                                })}
                              </View>
                            </ScrollView>
                          )}
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              </View>
            </View>
            <View style={{ width: "100%", height: 250 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  marginVertical: 15,
                  marginLeft: "9.5%",
                }}
              >
                Recommendations
              </Text>
              <View
                style={{ width: "100%", height: "100%", alignItems: "center" }}
              >
                {recommendations.length == 0 ? (
                  <Text style={{ marginLeft: 17 }}>Loading...</Text>
                ) : (
                  <View style={{ width: "90%" }}>
                    {recommendations.map((fd) => {
                      return (
                        <View key={fd}>
                          <Text>{fd}</Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            ...globalStyles.outerContainer,
            width: "94%",
            marginHorizontal: "3%",
            height: "6.5%",
            borderRadius: 20,
            position: "absolute",
            bottom: 5,
            left: 0,
          }}
        >
          <ImageBackground
            source={meshBg}
            style={globalStyles.imageBackgroundInner}
          >
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "space-around",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "75%",
                }}
              >
                <Text style={{ fontWeight: "bold", color: "rgba(0,0,0,0.6)" }}>
                  Total Energy
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  {mealSelected.calories} calories
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  uploadButton: {
    backgroundColor: "rgba(242,145,152,0.7)",
    elevation: 6,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  meal: {
    width: "100%",
    alignItems: "center",
  },
});
