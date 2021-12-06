import React , { useState,useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import {FontAwesome5} from "@expo/vector-icons";
import { useDispatch,useSelector } from "react-redux";
import { fetchFavorites } from "../store/actions/images";
import axios from 'axios';
import {fetchFeedBacks} from "../store/actions/feedback";
import { api } from "../store/api";
import { globalStyles } from "../styles/GlobalStyles"; 
import meshBg from "../assets/mesh-bg.png";
import foodImage from "../assets/food.jpg";

export default function ImageScreen(props) {
  const dispatch=useDispatch();
  const data=useSelector((state)=>state.image.favorites);
  const [favorites,setFavorites]=useState(data);

  useEffect(() => {
   dispatch(fetchFavorites())
  }, []);

  useEffect(()=>{
    setFavorites(data);
  },[data])
  
  return (
    <ImageBackground source={meshBg} style={globalStyles.backgroundImage}>
      <View style={globalStyles.container}>
        <View style={{...globalStyles.navBar, backgroundColor: "rgb(242,145,152)",
      borderRadius:30,
      marginTop:15,
      elevation:8,
      width: "83.5%",
      height: 60}}>
        <TouchableOpacity style={{margin:1}} onPress={()=>props.navigation.openDrawer()} >
                    <FontAwesome5 name="bars" size={24} color="black" />
                </TouchableOpacity>
          <Text style={{marginLeft:"-5%",fontWeight:"bold",fontSize:16}} >Favourites</Text>
        </View>
        <View style={{width:"100%"}} >
          {
            favorites.length==0?<Text style={{marginTop:30,fontWeight:"bold",textAlign:"center"}} >No favorites yet.</Text>:
            <ScrollView style={{marginBottom:20,height:"90%",width:"90%"}} >
              <View style={{width:"100%",alignItems:"center"}} >
              {
                favorites.reverse().map((favorite)=>{
                  return <View style={{height:230,width:"70%",margin:14,borderColor:"rgba(0,0,0,0.04)",backgroundColor:"rgba(255, 251, 251, 0.28)",borderWidth:2,borderRadius:30,paddingVertical:13}} key={favorite._id} >
                      <View style={{width:"100%",height:"75%",alignItems:"center"}} > 
                      <Image source={{uri:favorite.url}} style={{height:"100%",width:"77%",borderRadius:50}} />
                      </View>
                      <View style={{width:"100%"}} >
                      <Text style={{textAlign:"center",color:"rgba(0,0,0,0.7)",fontWeight:"bold"}} >{favorite.name}</Text>
                      <Text style={{textAlign:"center",color:"rgba(0,0,0,0.7)",fontWeight:"bold"}}>{favorite.calories} calories</Text>
                      </View>
                  </View>
                })
              }
              </View>
            </ScrollView>
          }
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  button:{
    backgroundColor:"rgba(0,0,0,0.7)",
    borderColor:"#000",
    borderWidth:1,
    width: "60%",
    paddingVertical:"3.5%",
    borderRadius:23
},
  text:{
    fontWeight:"bold",
    fontSize:17,
    color:"rgba(0,0,0,0.7)"
  },
  content:{
    flexDirection:"row",
    justifyContent:"space-between",
    paddingVertical:"3%"
  },
  comments:{
    width:"100%"
  }
});