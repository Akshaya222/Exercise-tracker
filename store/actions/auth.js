export const SIGNUP="SIGNUP";
export const LOGIN="LOGIN";
import axios from "axios";
import {api} from "../api";
let timer;
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserID=async()=>{
    const userDFS=await AsyncStorage.getItem("userData");
    const transformedData=JSON.parse(userDFS);
    id=transformedData.userId;
    return id;
}

export const authenticate=(userId,token,expiryTime)=>{
    return dispatch=>{
        dispatch(setLogoutTimer(expiryTime));
        dispatch({
            type:"AUTHENTICATE",
            userId:userId,
            token:token
        })
    }
}

export const logout=()=>{
    clearLogoutTimer();
    AsyncStorage.removeItem('userData')
    return {
        type:"LOGOUT"
    }
}

const clearLogoutTimer=()=>{
    if(timer){
        clearTimeout(timer);
    }
}

const setLogoutTimer=expirationDate=>{
  return dispatch=>{
  timer= setTimeout(()=>{
        dispatch(logout())
    },expirationDate)
  }
}

export const saveDataToStorage=(token,userId,expirationDate)=>{
    AsyncStorage.setItem('userData',JSON.stringify(
        {
        token:token,
        userId:userId,
        expiryDate:expirationDate.toISOString()
        }
    ))
}

export const fetchUser=(userId)=>{
    return async(dispatch)=>{
        try{
            if(!userId){
                userId=await getUserID();
            }
            let data=await axios.get(`${api}/user/me?userID=${userId}`);
            dispatch({type:"FETCH_USER",payload:data.data.data})
        }
        catch(e){
            console.log("error",e)
        }
    }
}


export const fetchAllUsers=()=>{
    return async(dispatch)=>{
        try{
            let data=await axios.get(`${api}/user/all-users`);
            dispatch({type:"FETCH_ALL_USERS",payload:data.data.data})
        }
        catch(e){
            console.log("error",e)
        }
    }
}