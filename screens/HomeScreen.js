import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUser, logout } from "../store/actions/auth";
import { fetchImages, selectMeal } from "../store/actions/images";
import { FontAwesome5 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import meshBg from "../assets/mesh-bg.png";
import foodImage from "../assets/food.jpg";
import { api } from "../store/api";
import { globalStyles } from "../styles/GlobalStyles";
import loadingSpinner from "../assets/loading-new.gif";
import axios from "axios";
import OuterContainer from "../components/OuterContainer";

export default function ImageScreen(props) {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const imageData = useSelector((state) => state.image.images);
  const [images, setImages] = useState(imageData);
  const selectedMeal = useSelector((state) => state.image.selectedMeal);
  const [mealSelected, setMealSelected] = useState(selectedMeal);
  const userInfo = useSelector((state) => state.auth.userObj);
  const [userDetails, setUserDetails] = useState(userInfo);
  const [message, setMessage] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  let userID;

  const getUserID = async () => {
    const userDFS = await AsyncStorage.getItem("userData");
    const transformedData = JSON.parse(userDFS);
    userID = transformedData.userId;
  };
  getUserID();

  useEffect(() => {
    setImage(null);
    dispatch(fetchImages());
    dispatch(fetchUser(userID));
    setTimeout(() => {
      initialRecommendations();
    }, 2000);
  }, []);

  const initialRecommendations = async () => {
    try {
      let res = await axios.get(
        `${api}/recommendations/initial/recom?userId=${userID}`
      );
      setRecommendations(res.data.data);
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (userInfo?.freeLimit == 0 && !userInfo?.pricingPlan) {
      setMessage(true);
    }
    if (userInfo?.pricingPlan) {
      setMessage(false);
    }
    setUserDetails(userInfo);
  }, [userInfo]);

  useEffect(() => {
    setImages(imageData);
  }, [imageData]);

  useEffect(() => {
    setMealSelected(selectedMeal);
  }, [selectedMeal]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  const clickImage = async () => {
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!image.cancelled) {
      console.log(image);
      setImage(image.uri);
    }
  };

  const uploadImage = () => {
    if (userDetails.freeLimit == 0 && !userDetails.pricingPlan) {
      setMessage(true);
      return;
    } else if (!image) {
      return;
    } else {
      console.log("uploading......");
      setLoading(true);
      let formData = new FormData();
      let imageParts = image.split("ImagePicker/");
      let imageName = imageParts[1];
      let newImage = {
        uri: image,
        type: "image/jpeg",
        name: imageName,
      };
      formData.append("file", newImage);
      const config = {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      fetch(`${api}/images/add?userID=${userID}`, config)
        .then((data) => data.json())
        .then(async (imageD) => {
          dispatch(selectMeal(imageD.data));
          dispatch(fetchImages());
          fetch(`http://20.115.37.217:5003/files/`, config)
            .then((data) => {
              return data.text();
            })
            .then(async (data) => {
              let dataM = JSON.parse(data);
              if (dataM.classes.length != 0) {
                let outputImage = await axios.put(`${api}/images/name`, {
                  imageID: imageD.data._id,
                  name: dataM.classes[0],
                });
                dispatch(selectMeal(outputImage.data.data));
                dispatch(fetchImages());
              }
            })
            .catch((e) => {
              console.log("error is", e);
            });
          fetch(
            `https://caloriepredictioniiitdharwad.herokuapp.com/files/`,
            config
          )
            .then((data) => {
              return data.text();
            })
            .then(async (data) => {
              let dataM = JSON.parse(data);
              let outputImage = await axios.put(`${api}/images/calories`, {
                imageID: imageD.data._id,
                calories: dataM.total_calories,
              });
              dispatch(selectMeal(outputImage.data.data));
              dispatch(fetchImages());
            })
            .catch((e) => {
              console.log("error is", e);
            });
          if (!userDetails.pricingPlan) {
            await axios.get(`${api}/user/dec-limits?userID=${userID}`);
          }
          dispatch(fetchUser(userID));
          setImage(null);
          setTimeout(() => {
            setLoading(false), props.navigation.navigate("calorieScreen");
          }, 12000);
        })
        .catch((e) => {
          console.log("error is", e);
        });
    }
  };

  const uploadImageForRecentMeal = (image) => {
    if (userDetails.freeLimit == 0 && !userDetails.pricingPlan) {
      props.navigation.navigate("paymentScreen");
    } else if (!image) {
      return;
    } else {
      dispatch(selectMeal(image));
      setLoading(true);
      let formData = new FormData();
      let imageParts = image.url.split("/");
      let imageName = imageParts[3];
      let newImage = {
        uri: image.url,
        type: "image/jpeg",
        name: imageName,
      };
      console.log("newImage", newImage);
      formData.append("file", newImage);
      const config = {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      fetch(`http://20.115.37.217:5003/files/`, config)
        .then((data) => {
          return data.text();
        })
        .then(async (data) => {
          setTimeout(() => {
            setLoading(false), props.navigation.navigate("calorieScreen");
          }, 5000);
        })
        .catch((e) => {
          console.log("error is", e);
        });
    }
  };

  const renderUI = () => {
    if (loading) {
      return (
        <View style={{ height: "100%", width: "100%" }}>
          <Image
            source={loadingSpinner}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
      );
    } else {
      return (
        <ScrollView style={{ height: "100%", width: "100%", marginBottom: 10 }}>
          <View
            style={{
              ...globalStyles.container,
              backgroundColor: showImage ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0)",
              opacity: showImage ? 0.9 : 1,
            }}
          >
            <View style={globalStyles.navBar}>
              <TouchableOpacity
                style={{ alignItems: "flex-start", margin: 16 }}
                onPress={() => props.navigation.openDrawer()}
              >
                <FontAwesome5 name="bars" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.uploadButton, ...globalStyles.buttonStyles }}
              >
                <Text
                  onPress={() => setShowImage(true)}
                  style={{ color: "#fff" }}
                >
                  Upload Image
                </Text>
              </TouchableOpacity>
            </View>
            <OuterContainer
              styles={{
                ...globalStyles.outerContainer,
                width: "85%",
                height: 270,
              }}
            >
              <View style={globalStyles.innerContainer}>
                {message ? (
                  <Text style={{ color: "black", marginHorizontal: 30 }}>
                    Free limits exceeded.
                    <Text style={{ fontWeight: "bold" }}>
                      Please updrage plan
                    </Text>{" "}
                    <Text
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: 16,
                        textDecorationLine: "underline",
                      }}
                      onPress={() => {
                        props.navigation.navigate("paymentScreen");
                      }}
                    >
                      View Plans
                    </Text>{" "}
                  </Text>
                ) : image ? (
                  <Image
                    source={{ uri: image }}
                    resizeMode="cover"
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : mealSelected?.url ? (
                  <Image
                    source={{ uri: selectedMeal.url }}
                    resizeMode="cover"
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Text style={{ color: "black" }}>
                    Image uploaded would be here
                  </Text>
                )}
                {/* { image || mealSelected ? <Image source={{ uri: image || selectedMeal.url }} resizeMode="cover" style={{width:"100%",height:"100%"}} /> : <Text style={{color:"black"}}>Image uploaded would be here</Text>  } */}
              </View>
            </OuterContainer>
            <View
              style={{
                width: "100%",
                height: images.length == 0 ? 80 : 300,
                position: "relative",
              }}
            >
              <Text style={{ fontWeight: "bold", marginLeft: "9%" }}>
                Recent Meals
              </Text>
              {images.length == 0 ? (
                <Text style={{ marginTop: 20, textAlign: "center" }}>
                  No Recent Meals yet
                </Text>
              ) : (
                <View style={styles.meals}>
                  {images[images.length - 1] ? (
                    <TouchableOpacity
                      style={{ ...styles.meal, marginLeft: -10 }}
                      onPress={() => {
                        uploadImageForRecentMeal(images[images.length - 1]);
                      }}
                    >
                      <OuterContainer
                        styles={{
                          ...globalStyles.outerContainer,
                          width: 150,
                          height: 150,
                          borderRadius: 70,
                          marginBottom: -26,
                          zIndex: 10,
                        }}
                      >
                        <View style={{ ...globalStyles.innerContainer }}>
                          <Image
                            source={{ uri: images[images.length - 1].url }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </View>
                      </OuterContainer>
                      <OuterContainer
                        styles={{
                          ...globalStyles.outerContainer,
                          width: 142,
                          height: "47%",
                          marginVertical: 0,
                        }}
                      >
                        <View
                          style={{
                            ...globalStyles.innerContainer,
                            padding: 20,
                          }}
                        >
                          <Text style={{ color: "black", fontWeight: "bold" }}>
                            {images[images.length - 1].name}
                          </Text>
                          <Text
                            style={{
                              color: "rgba(0,0,0,0.5)",
                              fontWeight: "bold",
                            }}
                          >
                            {images[images.length - 1].calories} cal
                          </Text>
                          {images[images.length - 1].isFavorite ? (
                            <AntDesign
                              name="heart"
                              size={16}
                              color="black"
                              style={{ marginTop: 3 }}
                            />
                          ) : null}
                        </View>
                      </OuterContainer>
                    </TouchableOpacity>
                  ) : null}
                  {images[images.length - 2] ? (
                    <TouchableOpacity
                      style={{ ...styles.meal, zIndex: -5, marginLeft: -10 }}
                      onPress={() => {
                        uploadImageForRecentMeal(images[images.length - 2]);
                      }}
                    >
                      <OuterContainer
                        styles={{
                          ...globalStyles.outerContainer,
                          width: 150,
                          height: 150,
                          borderRadius: 70,
                          marginBottom: -26,
                          zIndex: 10,
                        }}
                      >
                        <View style={{ ...globalStyles.innerContainer }}>
                          <Image
                            source={{ uri: images[images.length - 2].url }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </View>
                      </OuterContainer>
                      <OuterContainer
                        styles={{
                          ...globalStyles.outerContainer,
                          width: 142,
                          height: "48%",
                          marginVertical: 0,
                        }}
                      >
                        <View
                          style={{
                            ...globalStyles.innerContainer,
                            padding: 20,
                          }}
                        >
                          <Text style={{ color: "black", fontWeight: "bold" }}>
                            {images[images.length - 2].name}
                          </Text>
                          <Text
                            style={{
                              color: "rgba(0,0,0,0.5)",
                              fontWeight: "bold",
                            }}
                          >
                            {images[images.length - 2].calories} cal
                          </Text>
                          {images[images.length - 2].isFavorite ? (
                            <AntDesign
                              name="heart"
                              size={16}
                              color="black"
                              style={{ marginTop: 3 }}
                            />
                          ) : null}
                        </View>
                      </OuterContainer>
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate("recentMealsScreen")
                    }
                    style={{
                      marginTop: 150,
                      position: "absolute",
                      right: 0,
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      ...globalStyles.buttonStyles,
                    }}
                  >
                    <MaterialIcons
                      name="arrow-forward"
                      color="black"
                      size={30}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={{ height: 260 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  marginLeft: "9%",
                  marginBottom: 4,
                }}
              >
                Recommendations
              </Text>
              <View>
                {recommendations.length == 0 ? (
                  <Text style={{ textAlign: "center" }}>Loading..</Text>
                ) : (
                  <ScrollView horizontal={true}>
                    {recommendations.slice(0, 10).map((rec) => {
                      return (
                        <View
                          key={rec._id}
                          style={{
                            marginHorizontal: 15,
                            marginVertical: 10,
                            width: 180,
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={{ uri: rec.imageUrl }}
                            style={{
                              height: 150,
                              width: 150,
                              marginBottom: 10,
                              borderRadius: 75,
                            }}
                          />
                          <Text
                            style={{
                              paddingHorizontal: 4,
                              fontWeight: "bold",
                              fontSize: 12,
                              textAlign: "center",
                            }}
                          >
                            {rec.name}
                          </Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                )}
              </View>
            </View>
            {showImage && (
              <OuterContainer
                styles={{
                  ...globalStyles.outerContainer,
                  width: "100%",
                  height: 120,
                  marginVertical: 0,
                  marginTop: -27,
                  borderTopEndRadius: 30,
                  borderTopRightRadius: 30,
                  position: "absolute",
                  top: "3%",
                  left: 0,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-around",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    onPress={clickImage}
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <MaterialIcons name="camera-alt" color="black" size={30} />
                    <Text style={{ fontSize: 12 }}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={pickImage}
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <MaterialIcons
                      name="drive-folder-upload"
                      color="black"
                      size={30}
                    />
                    <Text style={{ fontSize: 12 }}>Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setImage(null);
                      setShowImage(false);
                    }}
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <MaterialIcons name="cancel" color="black" size={30} />
                    <Text style={{ fontSize: 12 }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setShowImage(false);
                    uploadImage();
                  }}
                  style={{
                    flexDirection: "row",
                    elevation: 6,
                    marginTop: 4,
                    paddingVertical: 8,
                    paddingHorizontal: 15,
                    borderRadius: 15,
                    backgroundColor: "rgb(242,145,152)",
                  }}
                >
                  <MaterialIcons name="file-upload" color="black" size={25} />
                  <Text>upload</Text>
                </TouchableOpacity>
              </OuterContainer>
            )}
          </View>
        </ScrollView>
      );
    }
  };

  return <View style={globalStyles.backgroundImage}>{renderUI()}</View>;
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
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
  meals: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  meal: {
    alignItems: "center",
    position: "relative",
  },
  mealImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: -40,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    zIndex: 40,
  },
});
