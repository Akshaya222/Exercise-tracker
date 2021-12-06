import {api} from "../api";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserID=async()=>{
    const userDFS=await AsyncStorage.getItem("userData");
    const transformedData=JSON.parse(userDFS);
    id=transformedData.userId;
    return id;
}

export const fetchPayment=()=>{
    return async(dispatch)=>{
        try{
            const userID=await getUserID();
            let data=await axios.get(`${api}/payments/list?userID=${userID}`);
            dispatch({type:"FETCH_PAYMENT",payload:data.data.data})
        }
        catch(e){
            console.log("error",e)
        }
    }
}


export const fetchPricingPlans=()=>{
    return async(dispatch)=>{
        try{
            const userID=await getUserID();
            let data=await axios.get(`${api}/pricing-plans/list`);
            dispatch({type:"FETCH_PRICINGPLANS",payload:data.data.data})
        }
        catch(e){
            console.log("error",e)
        }
    }
}
