import React , { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
  TouchableOpacity,
  Button,Platform,FlatList
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import userImage from "../assets/user-image.png";
import { fetchUser } from "../store/actions/auth";
import { useDispatch,useSelector } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {FontAwesome5} from "@expo/vector-icons"; 
import meshBg from "../assets/mesh-bg.png";
import { globalStyles } from "../styles/GlobalStyles";
import foodImage from "../assets/food.jpg";
import axios from "axios";
import {api} from "../store/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ImageScreen(props) {
  const [image,setImage]=useState("");
  const dispatch=useDispatch();
  const userData=useSelector((state)=>state.auth.userObj);
  const [userObject,setUserObject]=useState(userData);
  let userID;
  
  const getUserID=async()=>{
    const userDFS=await AsyncStorage.getItem("userData");
    const transformedData=JSON.parse(userDFS);
    userID=transformedData.userId;  
  }
  getUserID();

  useEffect(()=>{
      dispatch(fetchUser(userID));
  },[])

  useEffect(()=>{
      setUserObject(userData)
  },[userData])

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);
  const pickImage=async()=>{
    console.log("clicked")
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
      let formData=new FormData();
      let imageParts=image.split("ImagePicker/")
      let imageName=imageParts[1];
      let newImage={
       uri:image,
       type:"image/jpeg",
       name:imageName
      }
      formData.append("image",newImage)
      const config = {
        method: 'PUT',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      fetch(`${api}/user/image?userID=${userID}`,config).then(data=>
         data.json()
      ).then((data)=>{
      //console.log("data while uploading is",data)
      console.log(data)
      dispatch(fetchUser(userID));
      setImage("")
      }) .catch((e)=>{
        console.log("error is",e)
      })
}

  return (
    <ImageBackground source={meshBg} style={globalStyles.backgroundImage}>
      <View style={{...globalStyles.container}}>
        <View style={globalStyles.navBar}>
         <TouchableOpacity style={{margin:16}} onPress={()=>props.navigation.openDrawer()} >
                    <FontAwesome5 name="bars" size={24} color="black" />
                </TouchableOpacity> 
                <Text style={{marginLeft:"5%",fontWeight:"bold"}} onPress={()=>props.navigation.navigate("homeScreen")} >Back</Text>
        </View>
        {
          Object.keys(userObject)?.length==0 ? <Text style={{textAlign:"center",fontWeight:"bold"}} >Loading...</Text> :
       <View style={{width:"100%",alignItems:"center",height:"100%"}} >
          <View
          style={{
           ...globalStyles.outerContainer, width: "85%",
           height: "34%"
          }}
        >
          <ImageBackground
            source={meshBg}
            style={globalStyles.imageBackgroundInner}
          >
            <View
              style={{
                ...globalStyles.innerContainer
              }}
            >
               {/* <Image source={image?foodImage:userImage}  style={{height:"70%",width:"60%",marginVertical:"5%",borderRadius:image?60:0}} resizeMode="contain"  /> */}
              <TouchableOpacity onPress={pickImage}  >
              {image ? <Image source={{ uri:image}} style={{width:160,height:160,borderRadius:80}} /> :  
              userObject.photo ? <Image source={{uri:userObject.photo}} style={{width:160,height:160,borderRadius:80}} />:
              <Image source={userImage}  style={{height:140,width:140}} /> }
              </TouchableOpacity>
                <Text style={{fontWeight:'bold',marginTop:6,fontSize:15}} >{userObject.name}</Text>
            </View>
          </ImageBackground>
        </View>
        <View
          style={{...globalStyles.outerContainer,marginVertical:0,
            width: "85%",
            height: "47%",
            marginTop:15
          }}
        >
          <ImageBackground
            source={meshBg}
            style={globalStyles.imageBackgroundInner}
          >
            <View
              style={{
                ...globalStyles.innerContainer,
                paddingHorizontal:"12%",
                alignItems:"stretch"
              }}
            >
            <View style={styles.content} >
              <Text style={styles.text} >Coins</Text>
              <Text style={{...styles.text,marginRight:"3%"}} >{userObject.coins}</Text>
            </View>
            <View style={styles.content} >
              <Text style={styles.text} >Code</Text>
              <Text style={{...styles.text,marginRight:"3%"}} >{userObject.code}</Text>
            </View>
            <TouchableOpacity style={styles.content} >
              <Text style={styles.text}>Free Trial</Text>
              <MaterialIcons name="keyboard-arrow-right" color="black" size={35} onPress={()=>props.navigation.navigate("paymentScreen")} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.content}>
              <Text style={styles.text}>Recent Meals</Text>
              <MaterialIcons name="keyboard-arrow-right" color="black" size={35} onPress={()=>props.navigation.navigate("recentMealsScreen")}  />
            </TouchableOpacity>
            <View style={styles.content}>
              <Text style={styles.text}>Contact Us</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.text}>FAQs</Text>
            </View>
            </View>
          </ImageBackground>
        </View>
        </View>
        }
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  text:{
    fontWeight:"bold",
    fontSize:17,
    color:"rgba(0,0,0,0.7)"
  },
  content:{
    flexDirection:"row",
    justifyContent:"space-between",
    paddingVertical:"3%"
  }
});