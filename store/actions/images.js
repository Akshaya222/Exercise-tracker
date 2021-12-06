import {api,userID} from "../api";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserID=async()=>{
    const userDFS=await AsyncStorage.getItem("userData");
    const transformedData=JSON.parse(userDFS);
    id=transformedData.userId;
    return id;
}

export const fetchImages=()=>{
    return async(dispatch)=>{
        try{
            let userID=await getUserID();
            let data=await axios.get(`${api}/images/list?userID=${userID}`);
            dispatch({type:"FETCH_IMAGES",payload:data.data.data})
        }
        catch(e){
            console.log("error",e)
        }
    }
}

export  const selectMeal=(meal)=>{
    return dispatch=>{
        dispatch({type:"SELECTED_MEAL",payload:meal})
    }
}

export const fetchFavorites=()=>{
    return  async(dispatch)=>{
        try{
            let userID=await getUserID();
            let data=await axios.get(`${api}/favourites/list?userID=${userID}`);
            dispatch({type:"FAVORITE_MEALS",payload:data.data.data})
        }
        catch(e){
            console.log("error",e)
        }
    }
}
