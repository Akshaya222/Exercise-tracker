import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Camera } from "expo-camera";
import { Audio, Video } from "expo-av";
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";

export default function VideoRecorder() {
  const camera = useRef(null);
  const [values, setValues] = useState({
    hasPermission: [],
    cameraType: Camera.Constants.Type.back,
    isFlashLightOn: Camera.Constants.FlashMode.off,
    videoStatus: 0,
  });
  const { hasPermission, cameraType, isFlashLightOn, videoStatus } = values;
  useEffect(() => {
    getPermissions();
  }, []);
  const videoRecord = async () => {
    if (!videoStatus && camera.current) {
      setValues({
        ...values,
        videoStatus: 1,
        isFlashLightOn: isFlashLightOn
          ? Camera.Constants.FlashMode.torch
          : isFlashLightOn,
      });
      await camera.current
        .recordAsync()
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log(err));
    } else {
      try {
        await camera.current.stopRecording();
        setValues({
          ...values,
          videoStatus: 0,
          isFlashLightOn: Camera.Constants.FlashMode.off,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };
  const getPermissions = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const AudioStatus = await Audio.requestPermissionsAsync();
      setValues({ ...values, hasPermission: [status, AudioStatus.status] });
    } catch (err) {
      console.log(err);
    }
  };
  //   if (hasPermission.length == 0) {
  //     return <View />;
  //   }
  //   if (!hasPermission.every((element) => element == "granted")) {
  //     return (
  //       <View>
  //         <Text>Please allow all persmissions</Text>
  //       </View>
  //     );
  //   }
  return (
    // <View style={styles.container}>
    //   <Camera
    //     style={styles.camera}
    //     type={cameraType}
    //     ref={camera}
    //     flashMode={isFlashLightOn}
    //   />
    //   <View style={styles.icons}>
    //     <TouchableOpacity
    //       style={styles.icon}
    //       onPress={() => {
    //         if (!videoStatus) {
    //           setValues({
    //             ...values,
    //             isFlashLightOn: isFlashLightOn
    //               ? Camera.Constants.FlashMode.off
    //               : Camera.Constants.FlashMode.on,
    //           });
    //         }
    //       }}
    //     >
    //       <Ionicons
    //         name={isFlashLightOn ? "flash-off" : "flash"}
    //         color="white"
    //         size={50}
    //       />
    //     </TouchableOpacity>
    //     <TouchableOpacity
    //       style={styles.icon}
    //       onPress={() => {
    //         videoRecord();
    //       }}
    //     >
    //       <Entypo
    //         name={videoStatus ? "controller-stop" : "controller-record"}
    //         color="red"
    //         size={50}
    //       />
    //     </TouchableOpacity>
    //     <TouchableOpacity
    //       style={styles.icon}
    //       onPress={() => {
    //         if (!videoStatus) {
    //           setValues({
    //             ...values,
    //             cameraType: cameraType
    //               ? Camera.Constants.Type.back
    //               : Camera.Constants.Type.front,
    //           });
    //         }
    //       }}
    //     >
    //       <Ionicons name="camera-reverse-outline" color="white" size={50} />
    //     </TouchableOpacity>
    //   </View>
    // </View>
    <View style={styles.container}>
      <Video
        style={{ width: "100%", flex: 1, marginBottom: 5 }}
        source={{
          uri: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fproject-5f2fbcd2-24bc-4f4a-b74e-7c305ecd1c0e/Camera/c89f3998-0885-46f8-ab5a-c4dbd43cc782.mp4",
        }}
        useNativeControls
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  icons: {
    position: "absolute",
    bottom: 5,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  icon: {},
});
