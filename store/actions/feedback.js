import {api} from "../api";
import axios from 'axios';

export const fetchFeedBacks=()=>{
    return async(dispatch)=>{
        try{
            let data=await axios.get(`${api}/feedback/all`);
            dispatch({type:"FETCH_FEEDBACKS",payload:data.data.data})
        }
        catch(e){
            console.log("error",e)
        }
    }
}

