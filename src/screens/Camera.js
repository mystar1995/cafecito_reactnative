import React,{useRef, useState} from 'react'
import {View,StyleSheet,Alert,TextInput,Text,Image,TouchableOpacity,ScrollView} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {useSelector,useDispatch} from 'react-redux'
import IonIcons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {RNCamera} from 'react-native-camera'
import Modal from 'react-native-modal'
import {addvideo,getvideo} from '../service/videoservice'
import AlertComponent from '../component/AlertComponent'
import Loading from 'react-native-loading-spinner-overlay'
import { setvideo } from '../redux/action/video'
export default function Camera({navigation})
{
   let camera = useRef(null)
   const dispatch = useDispatch()
   const [record,setrecord] = useState(false)
   const [visible,setvisible] = useState(false)
   const [state,setstate] = useState({
       path:"",
       title:"",
       coverimage:""
   })

   const [loading,setloading] = useState(false)
   const {token} = useSelector(state=>state.auth)
   const [error,seterror] = useState("")
   const recordcamera = async() => {
       if(camera)
       {
           if(!record)
           {
               let coverimage = await camera.takePictureAsync({quality:0.5,base64:true});
               let data =  await camera.recordAsync()
               console.log(data.uri)
               console.log(coverimage.uri)
               setstate({
                    ...state,
                    path:data.uri,
                    coverimage:coverimage.uri
               })
           }
           else
           {
                stopcamera()
           }
       }
       
   }

   const stopcamera = async() => {
       if(camera)
       {
           await camera.stopRecording()
       }
   }

   const uploadvideo = () => {
       if(state.path)
       {
         setvisible(true)
       }
       else
       {
            seterror('Please Record video first before uploading')
       }
   }

   const upload = () => {
       if(state.title)
       {
           let coverimage = {
               uri:state.coverimage,
               type:"image/jpg",
               name:state.coverimage.split('/').pop()
           }

           let source = {
               uri:state.path,
               type:"video/mpg",
               name:state.path.split('/').pop()
           }

           setloading(true)
           setvisible(false)
            addvideo(source,state.title,coverimage,token).then(res=>{
                setloading(false)
                console.log(res.data)
                if(res.data.success)
                {
                    getvideo(token).then(res=>{
                        if(res.data.success)
                        {
                            dispatch(setvideo(res.data.video))        
                        }
                    })
                    navigation.goBack()
                }
                else
                {

                }
            }).catch(err=>{ setloading(false); console.log(err.response);})
       }
       else
       {
           seterror('Title has to be not empty')
       }
   }
   
    return (
        <View style={style.container}>
            <RNCamera style={{width:wp('100'),height:hp('100')}} captureAudio={true} ref={ref=>camera = ref} onRecordingStart={()=>setrecord(true)} onRecordingEnd={()=>setrecord(false)}>
                <View style={{flex:1,padding:24}}>
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                            <Feather name="arrow-left" size={RFValue(25,580)} color="black"></Feather>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,display:'flex',flexDirection:'row'}}>
                        <View style={{flex:1}}></View>
                        <View>
                            <TouchableOpacity style={[style.btn,{width:wp('11.11'),height:wp('11.11')}]}>
                                <FontAwesome5 name="user-alt" color="white" size={RFValue(18,580)}></FontAwesome5>
                            </TouchableOpacity>
                            <TouchableOpacity style={[style.btn,{width:wp('11.11'),height:wp('11.11'),marginTop:15}]}>
                                <Feather name="crop" color="white" size={RFValue(18,580)}></Feather>
                            </TouchableOpacity>
                            <TouchableOpacity style={[style.btn,{width:wp('11.11'),height:wp('11.11'),marginTop:15}]}>
                                <IonIcons name="color-wand" color="white" size={RFValue(18,580)}></IonIcons>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                    <View style={{display:'flex',flexDirection:'row',marginBottom:10,alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity style={[style.btn,{marginRight:15}]}>
                            <FontAwesome name="microphone" color="white" size={RFValue(24,580)}></FontAwesome>
                        </TouchableOpacity>
                        <TouchableOpacity style={[style.btn,{backgroundColor:record?'#BE0000':'#F6AA11',marginRight:15,width:wp('21.98'),height:wp('21.98')}]} onPress={recordcamera}>
                            <FontAwesome5 name={record?"stop":"video"} color="white" size={record?RFValue(25,580):RFValue(43,580)}></FontAwesome5>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.btn} onPress={uploadvideo}>
                            <AntDesign name="upload" color="white" size={RFValue(24,580)}></AntDesign>
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </RNCamera>
            <Modal isVisible={visible}>
                <View style={style.modalinside}>
                    <Text style={style.description}>Add Title of your video</Text>
                    <TextInput style={[style.input,{width:wp('80.9'),marginTop:15}]} placeholder="Title" placeholderTextColor="#A2A2A2" onChangeText={value=>setstate({...state,title:value})}></TextInput>
                    <TouchableOpacity style={[style.btncontainer,{width:wp('34.54'),justifyContent:'center'}]} onPress={upload}>
                        <Text style={style.btntext}>Post</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <AlertComponent error={error} seterror={seterror}></AlertComponent>

            <Loading visible={loading} textContent="Loading" textStyle={{color:'white'}}></Loading>
        </View>
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
        backgroundColor:'#0000008F',
        width:wp('17.15'),
        height:wp('17.15'),
        justifyContent:'center',
        alignItems:'center'
    },
    modalinside:{
        backgroundColor:'white',
        padding:20,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:17
    },
    description:{
        fontSize:RFValue(18,580),
        fontFamily:'Quicksand-Medium',
        textAlign:'center',
        marginTop:16
    },
    input:
    {
        borderRadius:5,
        borderColor:'#BFBFBF',
        borderWidth:1,
        backgroundColor:'white',
        fontSize:RFValue(14,580),
        color:'black',
        paddingLeft:10,
        paddingRight:10
    },
    btncontainer:{
        display:'flex',
        justifyContent:'space-between',
        padding:15,
        backgroundColor:'#F6AA11',
        borderRadius:35,
        flexDirection:'row',
        alignItems:'center',
        marginTop:hp('2.5%')
    },
    btntext:{
        color:'white',
        fontSize:RFValue(18,580),
        fontFamily:'Montserrat-Medium'
    },
})