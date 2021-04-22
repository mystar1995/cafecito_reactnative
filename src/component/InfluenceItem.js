import React from 'react';
import {ImageBackground,Text,StyleSheet, View,Image} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {RFValue} from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import config from '../config/config.json'
export default function InfluenceItem({fullname,profile,videoprice,cafecitoprice,reviews,job,navigation})
{
    const getreview = () => {
        let review = 0
        for(let item in reviews)
        {
            review += reviews[item].reviews
        }

        if(reviews.length > 0)
        {
            return review / reviews.length;
        }
        else
        {
            return 0;
        }
    }
    return (
        <View style={{width:wp('23.18'),marginRight:14}}>
            <ImageBackground source={profile?{uri:config.apiurl + "/" + profile}:require('../assets/images/darkmode/carp.png')} style={{width:wp('23.18'),height:wp('33.57'),flexDirection:'column',borderRadius:10,overflow:'hidden'}} resizeMode="cover">
                <View style={{flex:1}}></View>
                <View style={{marginBottom:5}}>
                    <TouchableOpacity style={style.camerabtn}>
                        <Image source={require('../assets/images/videoicon.png')} style={{opacity:1,width:wp('2.2'),height:wp('1.42')}}></Image>
                        <Text style={style.price}>$ {videoprice}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.camerabtn,{marginTop:5,backgroundColor:'#0000009B'}]}>
                        <Image source={require('../assets/images/coffee.png')} style={{opacity:1,width:wp('2.2'),height:wp('1.42')}}></Image>
                        <Text style={style.price}>$ {cafecitoprice}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            <TouchableOpacity onPress={()=>navigation.navigate('InfluenceProfile')}><Text style={style.title} numberOfLines={1}>{fullname}</Text></TouchableOpacity>
            <View style={{flexDirection:'row',justifyContent:'space-between',display:'flex',marginTop:4}}>
                <Text style={style.description}>{job}</Text>
                <View style={{display:'flex',flexDirection:'row'}}>
                    <FontAwesome name="star" color="#E9C448" size={RFValue(8,580)}></FontAwesome>
                    <Text style={[style.description,{marginLeft:5}]}>{getreview()}({reviews.length})</Text>
                </View>
            </View>
            
        </View>
    )
}


const style = StyleSheet.create({
    title:{
        fontSize:RFValue(12,580),
        marginTop:9,
        fontFamily:'Quicksand-Medium',
        color:'#D5D5D5'
    },
    description:{
        fontSize:RFValue(8,580),
        color:'#A4A4A4',
        fontFamily:'Quicksand-Medium'
    },
    camerabtn:{
        backgroundColor:'#F6AA119B',
        borderRadius:11,
        paddingTop:7,
        paddingBottom:7,
        paddingLeft:15,
        paddingRight:15,
        alignSelf:'center',
        flexDirection:'row',
        alignItems:'center'
    },
    price:{
        marginLeft:5,
        fontSize:RFValue(7,580),
        color:'white',
        fontWeight:'bold',
        fontFamily:'Quicksand-Medium'
    }
})