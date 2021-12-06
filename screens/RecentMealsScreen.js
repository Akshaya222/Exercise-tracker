import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View,ImageBackground,Image,ScrollView,TouchableOpacity } from 'react-native';
import { fetchImages,selectMeal } from "../store/actions/images";
import { useDispatch,useSelector } from "react-redux";
import { fetchUser, logout } from "../store/actions/auth";
import { api } from "../store/api";
import { globalStyles } from '../styles/GlobalStyles';
import AntDesign from "react-native-vector-icons/AntDesign";
import meshBg from "../assets/mesh-bg.png";
import foodImage from "../assets/food.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import loadingSpinner from "../assets/loading-new.gif";

const RecentMealsScreen = (props) => {
  const dispatch=useDispatch()
  const imageData=useSelector((state)=>state.image.images);
  const selectedMeal=useSelector((state)=>state.image.selectedMeal)
  const [images,setImages]=useState(imageData);
  const userInfo=useSelector((state)=>state.auth.userObj);
  const [userDetails,setUserDetails]=useState(userInfo);
  const [message,setMessage]=useState(false);
  const [loading,setLoading]=useState(false)
  console.log("selectedMeal is ",selectedMeal);

  let userID;
  
  const getUserID=async()=>{
    const userDFS=await AsyncStorage.getItem("userData");
    const transformedData=JSON.parse(userDFS);
    userID=transformedData.userId;  
  }
  getUserID();


  useEffect(() => {
   dispatch(fetchImages())
   dispatch(fetchUser(userID))
  }, []);

  useEffect(()=>{
    if(userInfo?.freeLimit==0 && !userInfo?.pricingPlan){
      setMessage(true);
    }
    if(userInfo?.pricingPlan){
      setMessage(false);
    }
    setUserDetails(userInfo);
},[userInfo])

  useEffect(()=>{
    setImages(imageData);
  },[imageData])

  const uploadImage=(image)=>{
    if(message){
      props.navigation.navigate("paymentScreen")
    }
    else if(!image){
      return;
    }
    else{
      dispatch(selectMeal(image));
      setLoading(true);
      let formData=new FormData();
    let imageParts=image.url.split("/")
    let imageName=imageParts[3];
    let newImage={
     uri:image.url,
     type:"image/jpeg",
     name:imageName
    }
    console.log("newImage",newImage)
    formData.append("file",newImage)
    const config = {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    fetch(`http://20.115.37.217:5003/files/`,config).then(data=>
          {
            return data.text()
        }).then(async(data)=>{
            setTimeout(()=>{setLoading(false), props.navigation.navigate("calorieScreen")},5000)
        }).catch((e)=>{
          console.log("error is",e)
        })
    }
  }

  const renderUI=()=>{
    if(loading){
      return  <View style={{height:"100%",width:"100%"}}>
      <Image source={loadingSpinner} style={{height:"100%",width:"100%"}}  />
     </View>
    }
    else{
      return   <View style={globalStyles.container}>
        <View style={{...globalStyles.navBar,paddingLeft:"8%",paddingRight:"32%"}}>
          <Text style={{fontWeight:"bold",fontSize:16}} onPress={()=>props.navigation.navigate("uploadScreen")} >Back</Text>
          <Text style={{fontWeight:"bold",fontSize:18}}>Recent Meals</Text>
        </View>
        {
          images.length==0?<Text style={{marginTop:30,fontWeight:"bold"}} >No Recent Meals Yet.</Text>:
          <ScrollView style={{width:"100%",height:"100%",paddingHorizontal:"5%"}}>
          <View style={styles.mealBox}>
            {
              images.reverse().map((image)=>{
                return  <TouchableOpacity style={{...styles.meal,width:150}} onPress={()=>{ uploadImage(image)}} key={image._id} >
                <View
                  style={{...globalStyles.outerContainer,width: 110,height: 110,borderRadius: 60,marginBottom: -26,zIndex: 10}}
                >
                  <ImageBackground
                    source={meshBg}
                    style={globalStyles.imageBackgroundInner}
                  >
                    <View
                      style={{...globalStyles.innerContainer}}>
                      <Image source={{uri:image.url}} style={{width:"100%",height:"100%"}} />
                    </View>
                  </ImageBackground>
                </View>
                <View
                  style={{...globalStyles.outerContainer,width: 150,height: 180,marginVertical:0}}>
                  <ImageBackground
                    source={meshBg}
                    style={globalStyles.imageBackgroundInner}
                  >
                    <View
                      style={{
                        ...globalStyles.innerContainer,padding:20}}>
                      <Text style={{color:"black",fontWeight:"bold"}}>{image.name}</Text>
                      <Text style={{color:"rgba(0,0,0,0.5)",fontWeight:"bold"}}>{image.calories} cal</Text>
                      {
                   image.isFavorite? <AntDesign name="heart" size={16} color="black"  style={{marginTop:3}} />:null 
                 }
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
              })
            }
            </View>
          </ScrollView>
        }
      </View>
    }
  }

    return (
      <ImageBackground source={meshBg} style={globalStyles.backgroundImage}>
      {
        renderUI()
      }
    </ImageBackground>
    )
}

export default RecentMealsScreen

const styles = StyleSheet.create({
    meal: {
        alignItems: "center",
        position: "relative",
        marginRight:"3%"
      },
      mealBox:{
        paddingBottom:14,
          flexDirection:"row",
          flexWrap:"wrap",
          alignItems:"center"
      }
})
