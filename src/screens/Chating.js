import React,{useEffect, useState,useRef} from 'react'
import {View,ScrollView,ImageBackground,StyleSheet,TouchableOpacity,Image,Text,TextInput,KeyboardAvoidingView} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {setstream} from '../redux/action/videocall'
import MessageReceived from '../component/MessageReceived'
import MessageSend from '../component/MessageSend'
import config from '../config/config.json'
import {useSelector,useDispatch} from 'react-redux'
import {getmessage,createmessage} from '../service/messageservice'
import Chat from '../component/Chart'
export default function Charting({navigation,route})
{
    const [message,setmessage] = useState([])
    const [update,setupdate] = useState(false)
    const {token,userinfo} = useSelector(state=>state.auth)
    const {videocall,jsep} = useSelector(state=>state.videocall)
    const dispatch = useDispatch()
    const messageref = useRef(null)
    let user = route.params.user;

    useEffect(()=>{
        getmessage(user.id,token).then(res=>{
            console.log('data',res.data.success)
            if(res.data.success)
            {
                setmessage(res.data.message)
            }
        })
    },[user.id,update])

    // useEffect(()=>{
    //     messageref.current.scrollToEnd({animated:true})
    // },[message])
    const create = (message) => {
        message.to = user.id
        createmessage(message,token).then(res=>{
            console.log(res.data)
            if(res.data.success)
            {
                setupdate(!update)
            }
        }).catch(err=>console.log(err.response.data))
   }

   const callaudio = () => {
      videocall.createOffer({
          media:{data:true,videoSend:false,videoRecv:false,audioSend:true,audioRecv:true,removeVideo:true,replaceVideo:true},
          success:function(jsep){
              dispatch(setstream(null))
              videocall.send({message:{request:'set',video:false}})
              videocall.send({message:{request:'call',username:user.id + "_videocall"},jsep})
              navigation.navigate('VideoCall',{id:user.id})
          }
      })
   }

   const callvideo = () => {
       videocall.createOffer({
           media:{data:true},
           success:function(jsep){
               videocall.send({message:{request:'set',video:true}})
               console.log(user.id + "_videocall")
               videocall.send({message:{request:'call',username:user.id + "_videocall"},jsep})
               videocall.changeLocalCamera()
               navigation.navigate('VideoCall',{id:user.id})
           }
       })
   }
    return (
        <KeyboardAvoidingView behavior="height" style={style.container}>
            <View style={{flex:1}}>
            
                <View style={{flex:1}}>
                    <View style={style.header}>
                        <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity onPress={()=>navigation.goBack()}>
                                <Feather name="arrow-left" size={RFValue(25,580)} color="white"></Feather>
                            </TouchableOpacity>
                            <Image source={user.profile?{uri:config.apiurl + '/' + user.profile}:require('../assets/images/darkmode/carp.png')} style={{width:wp('11.11'),height:wp('11.11'),marginLeft:15}} resizeMode="contain"></Image>
                            <Text style={style.profile}>{user.fullname}</Text>
                        </View>
                        <View style={{display:'flex',flexDirection:'row'}}>
                            <TouchableOpacity onPress={callvideo}>
                                <FontAwesome5 name="video" color="#F6AA11" size={RFValue(23,580)}></FontAwesome5>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:10}} onPress={callaudio}>
                                <FontAwesome5 name="phone-alt" color="#11D177" size={RFValue(23,580)}></FontAwesome5>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:10}}>
                                <FontAwesome name="user-circle" color="white" size={RFValue(23,580)}></FontAwesome>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView ref={messageref} style={style.content} contentContainerStyle={{padding:24,flexDirection:'column-reverse'}} onContentSizeChange={()=>messageref.current.scrollToEnd({animated:true})}>
                        {
                            message.map((item,index)=>{
                                if(item.from == userinfo.id)
                                {
                                    return <MessageSend message={item} receiver={user} key={index}></MessageSend>
                                }
                                else
                                {
                                    return (
                                        <MessageReceived message={item} key={index} userinfo={user}></MessageReceived>
                                    )
                                }
                            })
                        }
                    </ScrollView>
                    <Chat channelid={1234} onsendmessage={create} onmessage={(data)=>{console.log(data); setupdate(!update)}}/>
                    {/* <View style={style.chatcontainer}>
                        <Fontiso color="#BFC4D3" size={RFValue(23,580)} name="smiley"></Fontiso>
                        <TextInput style={{flex:1,marginLeft:15,marginRight:15,color:'white'}} placeholder="Type something" placeholderTextColor="#C9C9C9"></TextInput>
                        <TouchableOpacity>
                            <IonIcons name="send" color="#F6AA11" size={RFValue(23,580)}></IonIcons>
                        </TouchableOpacity>
                    </View> */}
                </View>
        </View>
    </KeyboardAvoidingView>
    )
}



const style = StyleSheet.create({
    header:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        padding:24,
        justifyContent:'space-between'
    },
    profile:{
        fontSize:RFValue(16,580),
        color:'white',
        fontWeight:'bold',
        fontFamily:'arial',
        marginLeft:15
    },
    content:{
        flex:1
    },
    chatcontainer:{
        backgroundColor:'#252525',
        display:'flex',
        flexDirection:'row',
        paddingLeft:15,
        paddingRight:15,
        paddingTop:5,
        paddingBottom:5,
        alignItems:'center'
    },
    container:{
        flex:1,
        backgroundColor:'#101010'
    }
})