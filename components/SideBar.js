import React,{useEffect,useState} from 'react'
import { StyleSheet, Text, View ,ScrollView,Image,ImageBackground,Button,TouchableOpacity} from 'react-native';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { useDispatch ,useSelector} from 'react-redux';
import { logout } from "../store/actions/auth";
import bgImage from "../assets/bg-2.jpg";
import profilePic from "../assets/user-image.png";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUser } from '../store/actions/auth';

const SideBar = (props) => {
    const dispatch=useDispatch();
    const userInfo=useSelector((state)=>state.auth);
    const [ready,setReady]=useState(false);

    let userID;
  
    const getUserID=async()=>{
      const userDFS=await AsyncStorage.getItem("userData");
      const transformedData=JSON.parse(userDFS);
      userID=transformedData.userId;  
    }
    getUserID();

    useEffect(()=>{
      dispatch(fetchUser(userID));
      setTimeout(()=>{
         setReady(true)
      },1000)
    },[])
    
    return (
       <ScrollView>
           <ImageBackground source={bgImage} style={{width:undefined,padding:16,paddingTop:48}}>
             <TouchableOpacity onPress={()=>props.navigation.navigate("userScreen")} style={{marginLeft:25}}  >
              {
                 !ready ? <Image source={profilePic}  style={{width:100,height:100,borderRadius:50,borderWidth:2,borderColor:"#fff"}} />:
                 userInfo?.userObj?.photo ? <Image source={{uri:userInfo.userObj.photo}} style={{width:100,height:100,borderRadius:50,borderWidth:2,borderColor:"#fff"}} /> : 
                 <Image source={profilePic}  style={{width:100,height:100,borderRadius:50,borderWidth:2,borderColor:"#fff"}} />
              }
              </TouchableOpacity>
               {
                  !ready ? <Text style={{color:"#fff",fontSize:20,fontWeight:"800",marginBottom:8,marginTop:4,marginLeft:40}} >Loading...</Text> : 
                  userInfo?.userObj?.name  ?   <Text style={{color:"#fff",fontSize:20,fontWeight:"800",marginBottom:8,marginTop:4,marginLeft:40}} >{userInfo.userObj.name}</Text> :   <Text style={{color:"#fff",fontSize:20,fontWeight:"800",marginBottom:8,marginTop:4,marginLeft:25}}>Loading...</Text>
               }
               </ImageBackground>
            <View style={{flex:1}}>
                <DrawerNavigatorItems {...props} />
               <View style={{marginTop:15}} >
               {
                  userInfo?.userObj?.role=="admin" ||  userInfo.userId =="61865a7d773ead165da8def8" ?
                  <TouchableOpacity style={{height:45,backgroundColor:"rgba(242,145,152,0.6)",marginHorizontal:15,borderRadius:50,justifyContent:"center",marginBottom:10}} onPress={()=>props.navigation.navigate("adminScreen")}  >
                     <Text style={{textAlign:"center",textAlignVertical:"center",fontWeight:"bold"}} >Admin Panel</Text>
                  </TouchableOpacity>:null
               }
                <TouchableOpacity onPress={()=>{dispatch(logout());props.navigation.navigate("start")}}  style={{height:45,backgroundColor:"rgba(242,145,152,0.6)",marginHorizontal:15,borderRadius:50,justifyContent:"center",marginBottom:10}}  >
                     <Text style={{textAlign:"center",textAlignVertical:"center",fontWeight:"bold"}} >Logout</Text>
                  </TouchableOpacity>
               </View>
            </View>
       </ScrollView>
    )
}

export default SideBar

const styles = StyleSheet.create({})