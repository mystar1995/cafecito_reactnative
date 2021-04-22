import React,{useEffect, useState} from 'react'
import {View,StyleSheet,ImageBackground,TextInput,Text,Image,TouchableOpacity,ScrollView} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Fontiso from 'react-native-vector-icons/Fontisto'
import IonIcons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import Video from 'react-native-video'
import config from '../config/config.json'
import {setvideo} from '../redux/action/video'
import {likevideo,islikevideo,getvideo} from '../service/videoservice'
import {useSelector,useDispatch} from 'react-redux'
export default function VideoView({navigation,route})
{
    let source = route.params.source
    let creater = route.params.creater
    let id = route.params.id
    const [pause,setpause] = useState(false)
    const [liked,setliked] = useState(false)
    const dispatch = useDispatch()
    const {token} = useSelector(state=>state.auth)
    useEffect(()=>{
        islikevideo(token,id).then(res=>{
            if(res.data.success)
            {
                setliked(res.data.liked)
            }
        })
    },[id])

    const like = () => {
        likevideo(token,id).then(res=>{
            if(res.data.success)
            {
                setliked(res.data.liked)
            }

            getvideo(token).then(res=>{
                if(res.data.success)
                {
                    dispatch(setvideo(res.data.video))
                }
            })
        })
    }
   
    return (
        <View style={style.container}>
            <Video source={{uri:config.apiurl + "/" + source}} style={{width:wp('100'),height:hp('100'),position:'absolute'}} repeat={true} resizeMode="contain" paused={pause}></Video>
            <View style={{flex:1}}>
                <View style={{flex:1,padding:24}}>
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                            <Feather name="arrow-left" size={RFValue(25,580)} color="white"></Feather>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={like}>
                            <FontAwesome name={liked?"heart":"heart-o"} size={RFValue(25,580)} color="#F6AA11"></FontAwesome>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,justifyContent:'center'}}>
                        <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>setpause(!pause)}>
                            <Feather name={pause?"play-circle":"pause-circle"} color="white" size={RFValue(66,580)}></Feather>
                        </TouchableOpacity>
                    </View>
                    <View style={{display:'flex',flexDirection:'row',marginBottom:10,alignItems:'center'}}>
                        <Image source={!creater.profile?require('../assets/images/darkmode/carp.png'):{uri:config.apiurl + "/" + creater.profile}} style={style.profile}></Image>
                        <Text style={style.name}>{creater.fullname}</Text>
                    </View>
                    
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'black'
    },
    profile:{
        width:wp('11.6'),
        height:wp('11.6'),
        borderRadius:wp('5.8'),
        marginRight:3,
        position:'relative'
    },
    name:{
        fontSize:RFValue(16,580),
        fontFamily:'arial',
        color:'white',
        fontWeight:'bold',
        marginLeft:5
    }
})