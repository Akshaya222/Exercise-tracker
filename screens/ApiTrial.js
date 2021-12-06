import React , { useState, useEffect } from "react";
import { StyleSheet, Text, View,Image,Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import base64 from 'react-native-base64'

const ApiTrial = () => {
    const [image, setImage] = useState(null);

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
    }

    const uploadImage=()=>{
        // let formData=new FormData();
        // let imageParts=image.split("ImagePicker/")
        // let imageName=imageParts[1];
        // let newImage={
        //  uri:image,
        //  type:"image/jpeg",
        //  name:imageName
        // }
        // formData.append("file",newImage)
        // console.log("from homescrren",newImage)
        // const config = {
        //   method: 'POST',
        //   body: formData,
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        // };
        //  fetch(`http://20.115.37.217:5003/files/`,config).then(data=>
        //   {
        //     return data.text()
        // }).then(data=>{
        //     console.log(data)
        // }).catch((e)=>{
        //   console.log("error is",e)
        // })
       
         fetch(`http://20.115.37.217:5003/image_return/`).then(data=>
          {
              //console.log("data first",data)
            // let output= base64.encode(data);
            return data.text()
        }).then((data)=>{
         // console.log(data)
           let output= base64.encode(data);
           let decoded=base64.decode(output)
           console.log(output);
           console.log("*********************");
           console.log(decoded)
        }).
        catch((e)=>{
          console.log("error is",e)
        })

      }
    

    return (
        <View>
            <Text>Image is here</Text>
            {image? <Image source={{ uri: image}} resizeMode="cover" style={{width:300,height:300}} /> : null}
           <Button title="pick" onPress={()=>pickImage()} />
           <View style={{marginTop:20}} >
               <Button title="upload" onPress={()=>uploadImage()}  />
           </View>
        </View>
    )
}

export default ApiTrial

const styles = StyleSheet.create({})
