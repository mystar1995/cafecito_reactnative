import React, { useState } from 'react';
import {ImageBackground,Text,StyleSheet, View,TouchableOpacity,Image} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import OctIcons from 'react-native-vector-icons/Octicons'
import {setvideo} from '../redux/action/video'
import {useDispatch,useSelector} from 'react-redux'
import Modal from 'react-native-modal'
import config from '../config/config.json'
import {deletevideo,getvideo} from '../service/videoservice'
export default function VideoDetail({title,coverimage,creater,likes,id,source,navigation,me,setloading})
{
    const {token} = useSelector(state=>state.auth)
    const [visible,setvisible] = useState(false)
    const dispatch = useDispatch()
    const removevideo = () => {
        setloading(true)
        deletevideo(token,id).then(res=>{
            if(res.data.success)
            {
                getvideo(token).then(res=>{
                    if(res.data.success)
                    {
                        setvisible(false)
                        dispatch(setvideo(res.data.video))
                    }
                })
            }
            setloading(false)
        }).catch(err=>{setloading(false);console.log(err)})
    }

    return (
        <TouchableOpacity style={{width:wp('41'),marginBottom:10}}>
            <ImageBackground source={{uri:config.apiurl + "/" + coverimage}} style={{width:wp('41'),height:wp('41'),borderRadius:14,display:'flex',justifyContent:'center',alignItems:'center',position:'relative',overflow:'hidden'}}>
                <TouchableOpacity onPress={()=>navigation.navigate('VideoView',{source:source,creater,id})}><EvilIcons name="play" color="#F6AA11" size={RFValue(45,580)}></EvilIcons></TouchableOpacity>
                <View style={{display:'flex',position:'absolute',bottom:5,right:5,flexDirection:'row',alignItems:'center'}}>
                    <Entypo color="#F6AA11" size={RFValue(15,580)} name="heart"></Entypo>
                    <Text style={{color:'#F6AA11',fontSize:RFValue(15,580),fontFamily:'Quicksand-Medium'}}>{likes}</Text>
                </View>
                {
                    me && (
                        <TouchableOpacity style={style.remove} onPress={()=>setvisible(true)}>
                            <OctIcons name="trashcan" color="white" size={RFValue(17,580)}></OctIcons>
                        </TouchableOpacity>
                    )
                }
            </ImageBackground>
            <Text style={style.title}>{title}</Text>
            {
                !me && (
                    <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:4}}>
                        <Image source={!creater.profile?require('../assets/images/darkmode/carp.png'):{uri:config.apiurl + "/" + creater.profile}} style={style.profile}></Image>
                        <Text style={style.description} numberOfLines={1}>{creater.fullname}</Text>
                    </View>
                )
            }
            
            <Modal isVisible={visible} onBackdropPress={()=>setvisible(false)}>
                <View style={style.modalinside}>
                    <Image source={require('../assets/images/icon.png')} style={style.logo}></Image>
                    <Text style={style.descriptionmodal}>We Will remove this video?</Text>
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:20}}>
                        <TouchableOpacity style={[style.button,{backgroundColor:'#F6AA11',marginRight:20}]} onPress={removevideo}>
                            <Text style={style.buttontxt}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[style.button,{backgroundColor:'black'}]} onPress={()=>setvisible(false)}>
                            <Text style={style.buttontxt}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </TouchableOpacity>
    )
}


const style = StyleSheet.create({
    title:{
        fontSize:RFValue(16,580),
        marginTop:9,
        fontFamily:'Quicksand-Medium',
        color:'white'
    },
    description:{
        fontSize:RFValue(15,580),
        color:'#D5D5D5',
        marginLeft:5,
        fontFamily:'Quicksand-Medium'
    },
    profile:{
        width:wp('10%'),
        height:wp('10%'),
        borderRadius:wp('5%')
    },
    remove:{
        position:'absolute',
        width:wp('17.4'),
        height:wp('17.4'),
        borderRadius:wp('8.7'),
        right:-wp('8.7'),
        top:-wp('8.7'),
        backgroundColor:'#F6AA11',
        alignItems:'flex-start',
        justifyContent:'flex-end',
        padding:wp('2.5'),
        paddingLeft:wp('3.5'),
        paddingTop:wp('3.5')
    },
    modalinside:{
        backgroundColor:'white',
        paddingLeft:wp('12.07'),
        paddingRight:wp('12.07'),
        paddingTop:wp('4.83'),
        paddingBottom:wp('4.83'),
        alignItems:'center',
        justifyContent:'center',
        borderRadius:17
    },
    logo:{
        width:wp('26.56'),
        height:wp('28.15')
    },
    descriptionmodal:{
        fontSize:RFValue(18,580),
        fontFamily:'Quicksand-Medium',
        textAlign:'center',
        marginTop:16
    },
    button:{
        flex:1,
        padding:10,
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center'
    },
    buttontxt:{
        color:'white',
        fontSize:RFValue(18,580),
        fontFamily:'Montserrat-Medium'
    }
})