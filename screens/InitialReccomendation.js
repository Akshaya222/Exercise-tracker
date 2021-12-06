import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,ScrollView,Image,Button,Modal,ImageBackground } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SimpleModal from "./Modal";
import meshBg from "../assets/mesh-bg.png";
import { globalStyles } from "../styles/GlobalStyles";
import axios from "axios";
import { api } from '../store/api';

const InitialReccomendation = (props) => {
    const [ctype,setCtype]=useState("Healthy Food");
    const [isModalVisible,setIsModalVisible]=useState(true);
    const [vege,setVege]=useState('veg');
    const vegNon=['veg','non-veg'];
    const [counter,setCounter]=useState(0)
    const cTypes = ["Healthy Food","Snack","Dessert","Japanese","Indian","French","Mexican","Italian","Chinese","Beverage"]
    const [selectedItems,setSelectedItems]=useState([]);
    const [data,setData]=useState([]);
    const [filteredData,setFilteredData]=useState([])
    let userID;

    useEffect(()=>{
        fetchFoods()
    },[])
  
  const getUserID=async()=>{
    const userDFS=await AsyncStorage.getItem("userData");
    const transformedData=JSON.parse(userDFS);
    userID=transformedData.userId;  
  }
  getUserID();

  const changeModalVisibility = (bool) => {
        setIsModalVisible(bool)
    }

    const fetchFoods=async()=>{
        try{
            const res=await axios.get(`${api}/recommendations/list`)
            setData(res.data.data)
            let filtered=res.data.data.filter((fd)=>fd.c_type==ctype)
            setFilteredData(filtered.slice(0,10))
        }
        catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        let calData=data;
        const array=calData.filter((cal)=>cal.c_type==ctype)
        setFilteredData(array.slice(0,10))
        setSelectedItems([]);
        setCounter(0)
    },[vege,ctype])

    const clickHandler=(food)=>{
        if(counter>=3){
            return;
        }else{
            setCounter(counter=>counter+1);
            setSelectedItems([...selectedItems,food])
        }
    }

    const savePreferencesHandler=()=>{
        let selectedItemsIds=[];
        selectedItems.forEach((ele)=>{
            selectedItemsIds.push(ele._id)
        })
        const inputData={
            selectedItems:selectedItemsIds,
            userId:userID
        }
        const config = {
            method: 'PUT',
            body: JSON.stringify(inputData),
            headers: {
              'Content-Type': 'application/json',
            },
          }
          fetch(`${api}/user/preferences`,config).then(data=>
             data.json()
          ).then((res)=>{
            if(res.status=="failure"){
                console.log(res)
            }else{
                console.log("output is",res.data)
                props.navigation.navigate({
                    routeName:"uploadScreen",
                    params:{
                        keyyyy:"yes"
                    }
                })
            }
          }).catch((e)=>{
            console.log("error is",e)
          })
    }

    return (
        <ImageBackground source={meshBg} style={globalStyles.backgroundImage}>
        <View style={{position:"relative"}}>
             <Modal transparent={true} animationType="fade" visible={isModalVisible} 
               onRequestClose={() => changeModalVisibility(false)}>
             <SimpleModal changeModalVisibility={changeModalVisibility}/>
         </Modal>
            <Text style={{fontWeight:"bold",textAlign:"center",marginVertical:12,fontSize:20,marginRight:40}} >Recommendations</Text>
            <TouchableOpacity onPress={()=>props.navigation.navigate("uploadScreen")} style={{backgroundColor:"rgba(242,145,152,0.8)",height:30,width:60,alignItems:"center",justifyContent:"center",borderRadius:15,elevation:3,marginVertical:10,position:'absolute',right:10,top:5}}>
              <Text style={{fontWeight:"bold"}} >Skip</Text>
</TouchableOpacity>
            <View style={{width:"100%",alignItems:"center"}} >
            <Text style={{textAlign:"justify",width:300,marginBottom:10,color:"rgba(0,0,0,0.5)"}}>Please choose 3 preferences from the selected cuisine type</Text>
            </View>
            <View style={{width:"100%",paddingHorizontal:20,flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
                <Text style={{fontSize:15,fontWeight:"500"}} >Cuisine - </Text>
            <SelectDropdown 
	data={cTypes}
	onSelect={(selectedItem, index) => {
        setCtype(selectedItem)
	}}
    defaultButtonText={ctype}
    renderDropdownIcon={
        ()=> <AntDesign name="down" size={20} style={{marginRight:10,fontWeight:"bold"}} />
    }
	buttonTextAfterSelection={(selectedItem, index) => {
		return selectedItem
	}}
	rowTextForSelection={(item, index) => {
		return item
	}}
/>
</View>
<View style={{marginVertical:10,alignItems:"center"}}>
<View style={{width:"92%",marginVertical:10,backgroundColor:"rgba(255, 251, 251, 0.28)",borderRadius:35,borderWidth:3,borderColor:"rgba(0,0,0,0.05)",paddingHorizontal:14}}>
<ScrollView style={{marginTop:20,marginLeft:15,marginBottom:16,height:400,width:"100%"}} >
        <View style={{flexDirection:"row",flexWrap:'wrap'}} >
        {
            filteredData.map((food)=>{
                return <TouchableOpacity key={food.name} style={{width:"42%",height:190,backgroundColor:selectedItems.includes(food)?"#ccc":"transparent",opacity:selectedItems.includes(food)?0.5:1,marginHorizontal:"2%",alignItems:"center",borderRadius:10,marginVertical:10}} 
                disabled={selectedItems.includes(food)}
                onPress={()=>clickHandler(food)}>
                    <Image source={{uri:food.imageUrl}} style={{width:110,height:110,borderRadius:55}} />
                    <Text style={{paddingHorizontal:7,paddingVertical:3,textAlign:"left",fontWeight:"bold",color:"rgba(0,0,0,0.5)"}} >{food.name}</Text>
                </TouchableOpacity>
            })
        }
        </View>
</ScrollView>
</View>
</View>
<View style={{width:"100%",alignItems:"center"}} >
<TouchableOpacity onPress={savePreferencesHandler} style={{backgroundColor:"rgba(242,145,152,1)",height:40,width:170,alignItems:"center",justifyContent:"center",borderRadius:15,elevation:6,marginVertical:10}}>
              <Text style={{fontWeight:"bold"}} >Save Preferences</Text>
</TouchableOpacity>
</View>
        </View>
        </ImageBackground>
    )
}

export default InitialReccomendation

const styles = StyleSheet.create({})
