import React,{useEffect, useRef, useState} from 'react'
import {View,StyleSheet,ImageBackground,TextInput,Text,Image,TouchableOpacity,ScrollView} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'
import {useSelector} from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LinearGradient from 'react-native-linear-gradient'
import {RTCView} from 'react-native-webrtc'

let timer = null
export default function VideoCall({navigation,route})
{
    const {userinfo} = useSelector(state=>state.auth)
    const videoref = useRef(null)
    const remoteref = useRef(null)
    const {videocall,stream,remotestream,state,jsep} = useSelector(state=>state.videocall)
    
    const hangup = () => {
        videocall.send({message:{request:'hangup'}})
        //videocall.hangup()
    }

    useEffect(()=>{
        clearTimeout(timer)
        if(state != 'accepted')
        {
            timer = setTimeout(()=>{
                hangup()
            },10000)
        }
    },[state])

    const accept = () => {
        videocall.createAnswer({
            jsep,
            media:{data:true},
            success:function(result){
                videocall.send({message:{request:'accept'},jsep:result})
            }
        })
    }
    
    const render = () => {
          if(state == 'incomingcall')
          {
              return (
                  <View style={style.actioncontainer}>
                      <TouchableOpacity style={[style.btn,{backgroundColor:'green'}]} onPress={accept}>
                            <MaterialCommunityIcons name="phone" color="white" size={RFValue(36,580)}></MaterialCommunityIcons>
                      </TouchableOpacity>
                      <TouchableOpacity style={style.btn} onPress={hangup}>
                        <MaterialCommunityIcons name="phone-hangup" size={RFValue(36,580)} color="white"></MaterialCommunityIcons>
                      </TouchableOpacity>
                  </View>
              )
          }
          else if(state == 'accepted')
          {
              return (
                  <>
                    <Text style={style.time}>05:30</Text>
                    <View style={{display:'flex',flexDirection:'row',marginBottom:10,alignItems:'center',justifyContent:'center'}}>
                        
                        {
                            stream && (
                                <>
                                    <TouchableOpacity style={style.btn} onPress={()=>videocall.changeLocalCamera()}>
                                        <Image source={require('../assets/images/flip.png')} style={{width:RFValue(33,580),height:RFValue(33.580)}}></Image>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={style.btn}>
                                        <FontAwesome5 name="video" size={RFValue(18,580)} color="white"></FontAwesome5>
                                    </TouchableOpacity>
                                </>
                            )
                        }
                        
                        <TouchableOpacity style={style.btn}>
                            <FontAwesome5 name="microphone-alt-slash" size={RFValue(25,580)} color="white"></FontAwesome5>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.btn}>
                            <MaterialCommunityIcons name="phone-hangup" size={RFValue(36,580)} color="white"></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                  </>
              )
          } 
          else
          {
            return (
                <View style={style.actioncontainer}>
                    <TouchableOpacity style={style.btn} onPress={hangup}>
                        <MaterialCommunityIcons name="phone-hangup" size={RFValue(36,580)} color="white"></MaterialCommunityIcons>
                      </TouchableOpacity>
                </View>
            )
          } 
    }

    return (
        <LinearGradient colors={["#690919","#F6AA11"]} start={{x:0,y:1}} end={{x:0,y:0}} locations={[0,1]} style={style.container}>
            {
                remotestream && (
                    <RTCView ref={videoref} streamURL={remotestream} style={style.videocall}></RTCView>
               )
            }
            <View style={{flex:1}}>
                <View style={{flex:1,padding:24}}>
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>{hangup();}}>
                            <Feather name="arrow-left" size={RFValue(25,580)} color="white"></Feather>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,display:'flex',flexDirection:'row'}}>
                        <View style={{flex:1,alignItems:'center'}}>
                            {
                                remotestream == null && (
                                    <>
                                        <View style={style.profileimage}>
                                            <Image source={userinfo.role == 'influencer'?require('../assets/images/profile/influencer_me.png'):require('../assets/images/profile.png')} style={style.image}></Image>
                                        </View>
                                    </>
                                )
                            }

                        </View>
                        {
                            stream && (
                                <RTCView streamURL={stream} style={style.remotecall} ref={remoteref}></RTCView>
                            )
                        }
                    </View>
                    {
                        render()
                    }
                    
                </View>
            </View>
        </LinearGradient>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1
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
    },
    btn:{
        borderRadius:71,
        backgroundColor:'#00000099',
        width:wp('13.52'),
        height:wp('13.52'),
        justifyContent:'center',
        alignItems:'center',
        marginRight:10
    },
    time:{
        fontFamily:'Quicksand-Medium',
        fontSize:RFValue(26,580),
        color:'white',
        textAlign:'center',
        marginBottom:20
    },
    videocall:{
        width:wp('100'),
        height:hp('100'),
        top:0,
        left:0,
        position:'absolute'
    },
    remotecall:{
        width:wp('16.18'),
        height:wp('21.98'),
        borderRadius:5,
        position:'absolute',
        top:hp('10'),
        right:10,
        zIndex:10
    },
    actioncontainer:{
        display:'flex',
        flexDirection:'row',
        marginBottom:10,
        alignItems:'center',
        justifyContent:'center'
    },
    profileimage:{
        width:wp('34.78'),
        height:wp('34.78'),
        borderRadius:wp('17.39'),
        backgroundColor:'#F6AA11',
        justifyContent:'center',
        alignItems:'center'
    },
    image:{
        width:wp('28.5'),
        height:wp('28.5'),
        borderRadius:wp('14.25')
    }
})