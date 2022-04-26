import {
  Button,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import OuterContainer from "../components/OuterContainer";
import { FontAwesome5 } from "@expo/vector-icons";
import { globalStyles } from "../styles/GlobalStyles";
import { Audio, Video } from "expo-av";
import axios from "axios";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import loader from "../assets/orange-loader.gif";
import loadingSpinner from "../assets/loading-new.gif";

const print = async (html) => {
  await Print.printAsync({
    html,
    //  printerUrl: selectedPrinter?.url, // iOS only
  });
};

const VideoPicker = ({ props }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
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
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  const submitVideo = () => {
    console.log("submittin.....");
    setLoading(true);
    let formData = new FormData();
    let imageName = "exercise-video";
    let newImage = {
      uri: image,
      type: "video/mp4",
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
    fetch("https://e6c3-103-217-239-132.in.ngrok.io/uploadfile/", config)
      .then((data) => data.json())
      .then((data) => {
        console.log("data data is....", data);

        const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pdf Content</title>
        <style>
            body {
                font-size: 16px;
                color: rgb(255, 255, 255);
            }

            p {
               color:yellow;
            }
        </style>
    </head>
    <body>
        <p>Calories burnt : ${data.calories_burnt}</p>
        <p>Reps : ${data.reps}</p>
        <p>Predictions : </p>
        <p>${data.predictions[0]}</p>
        <p>${data.predictions[1]}</p>
    </body>
    </html>
`;
        print(htmlContent);
        setLoading(false);
      })
      .catch((e) => {
        console.log("error is...", e);
      });
  };
  return (
    <View style={globalStyles.backgroundImage}>
      <View style={{ ...globalStyles.container }}>
        <View style={globalStyles.navBar}>
          <TouchableOpacity
            style={{ margin: 16 }}
            onPress={() => props.navigation.openDrawer()}
          >
            <FontAwesome5 name="bars" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickImage}
            style={{ ...styles.uploadButton, ...globalStyles.buttonStyles }}
          >
            <Text style={{ color: "#fff" }}>Upload Video</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: "100%", alignItems: "center", height: "100%" }}>
          <OuterContainer
            styles={{
              ...globalStyles.outerContainer,
              width: "85%",
              height: "34%",
            }}
          >
            <View
              style={{
                ...globalStyles.innerContainer,
              }}
            >
              {image ? (
                <Video
                  style={{ width: "100%", height: "100%", marginBottom: 5 }}
                  source={{
                    uri: image,
                  }}
                  isLooping
                  shouldPlay
                  useNativeControls
                  resizeMode="cover"
                />
              ) : (
                <Text>Upload Video</Text>
              )}
            </View>
          </OuterContainer>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "82%",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              onPress={submitVideo}
              style={{ ...styles.uploadButton, ...globalStyles.buttonStyles }}
            >
              <Text style={{ color: "#fff" }}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setImage(null);
                setLoading(false);
              }}
              style={{ ...styles.uploadButton, ...globalStyles.buttonStyles }}
            >
              <Text style={{ color: "#fff" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: "82%", marginTop: 20 }}>
            {loading && (
              <Image
                source={loadingSpinner}
                style={{ height: 200, width: "100%" }}
              />
            )}
          </View>
        </View>
      </View>
    </View>
    // <View style={styles.container}>
    //   <Button onPress={pickImage} title="Pick Image" />
    //   <View style={{ marginVertical: 10 }}></View>
    //   {image && (
    //     <Video
    //       style={{ width: "100%", height: 200, marginBottom: 5 }}
    //       source={{
    //         uri: image,
    //       }}
    //       isLooping
    //       shouldPlay
    //       useNativeControls
    //       resizeMode="cover"
    //     />
    //   )}
    //   <Button onPress={submitVideo} title="Submit" />
    //   {loading && <Image source={loader} style={{ height: 100, width: 100 }} />}
    // </View>
  );
};

export default VideoPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  uploadButton: {
    elevation: 6,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
});
