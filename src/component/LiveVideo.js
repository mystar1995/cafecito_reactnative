import React from 'react';
import {View,StyleSheet,Image,TouchableOpacity,Text} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'
import RNFetchBlob from 'rn-fetch-blob'
export default function LiveVideo({id,title,duration,navigation,audiourl,onplay})
{
    const download = () => {
        let dir = RNFetchBlob.fs.dirs
        if(audiourl)
        {
            console.log(audiourl)
            RNFetchBlob.config({fileCache:true,addAndroidDownloads : {
                // Show notification when response data transmitted
                notification : true,
                useDownloadManager:true,
                // Make the file scannable  by media scanner
                mediaScannable : true,
              }}).fetch('GET',audiourl,{}).then(res=>{
                console.log(res.path())
            })
        }
        
    }
    return (
        <TouchableOpacity style={style.container} onPress={()=>navigation.navigate('Episode',{id:id})}>
            <TouchableOpacity style={style.camerabtn}>
                <FontAwesome5 name="video" color="white" size={RFValue(25,580)}></FontAwesome5>
            </TouchableOpacity>
            <View style={style.content}>
                <TouchableOpacity><Text style={style.title} numberOfLines={1}>{title}</Text></TouchableOpacity>
                <Text style={style.time}>{duration}</Text>
            </View>
            <TouchableOpacity onPress={onplay}>
                <Feather name="play-circle" color="#2DA84E" size={RFValue(25,580)}></Feather>
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft:15}} onPress={download}>
                <Feather name="download" color="#7F7F7F" size={RFValue(25,580)}></Feather>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    container:{
        backgroundColor:'#252525',
        shadowColor:'black',
        shadowOpacity:0.16,
        shadowRadius:5,
        shadowOffset:{
            height:3,
            width:0
        },
        borderRadius:44,
        padding:20,
        marginBottom:16,
        marginTop:5,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    camerabtn:{
        backgroundColor:'#F6AA11',
        borderRadius:wp('5.8'),
        width:wp('11.6'),
        height:wp('11.6'),
        justifyContent:'center',
        alignItems:'center'
    },
    content:{
        flex:1,
        marginLeft:17,
        marginRight:17
    },
    title:{
        fontSize:RFValue(15,580),
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    time:{
        fontSize:RFValue(10,580),
        color:'#F6AA11',
        fontFamily:'Quicksand-Medium'
    }
})