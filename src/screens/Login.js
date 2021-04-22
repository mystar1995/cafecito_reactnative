import React,{useEffect, useState} from 'react';
import {View,AsyncStorage,StyleSheet,KeyboardAvoidingView,Image,TouchableOpacity,Text,TextInput,ScrollView,Alert} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {RFValue} from 'react-native-responsive-fontsize'
import {loginuser,loginwithsocial} from '../service/userservice'
import {setuserinfo} from '../redux/action/auth'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen' 
import Loading from 'react-native-loading-spinner-overlay'
import {useDispatch} from 'react-redux'
import AlertElement from '../component/AlertComponent'
import {GoogleSignin,statusCodes} from '@react-native-community/google-signin'
import config from '../config/config.json'
export default function Login({navigation})
{
    const dispatch = useDispatch()
    const [loading,setloading] = useState(false)
    const [error,seterror] = useState("")
    const [userinfo,setuser] = useState({
        email:"",
        password:""
    })

    const login = () => {
        setloading(true)
        loginuser(userinfo).then(res=>{
            if(res.data.success)
            {
                if(res.data.userinfo.role == 'influencer')
                {
                    if(!res.data.userinfo.active)
                    {   
                        navigation.navigate('Upload',{email:res.data.userinfo.email})
                    }   
                    else
                    {
                        AsyncStorage.setItem('token',res.data.token)
                        dispatch(setuserinfo(res.data.token,res.data.userinfo))
                        navigation.navigate('Permission')
                    }
                }
                else
                {
                    AsyncStorage.setItem('token',res.data.token)
                    dispatch(setuserinfo(res.data.token,res.data.userinfo))
                    navigation.navigate('Permission')
                }
                
            }
            else
            {
                seterror(res.data.message)
            }
            setloading(false)
            
        }).catch(err=>setloading(false))
    }

    useEffect(()=>{
        GoogleSignin.configure({
            webClientId:config.webcliendid,
            offlineAccess:true
        })
    },[])

    const googlelogin = async() => {
        try
        {
            await GoogleSignin.hasPlayServices()
            let userinfo = await GoogleSignin.signIn()

            let signininfo = {
                email:userinfo.user.email,
                fullname:userinfo.user.familyName + " " + userinfo.user.givenName,
                username:userinfo.user.name,
                profile:userinfo.user.photo
            }
            setloading(true)
            loginwithsocial(signininfo).then(res=>{
                if(res.data.success)
                {
                    AsyncStorage.setItem('token',res.data.token)
                    dispatch(setuserinfo(res.data.token,res.data.userinfo))
                    navigation.navigate('Permission')
                }
                setloading(false)
            }).catch(err=>setloading(false))
        }
        catch(e)
        {
            console.log(e)
        }
        
    }

    return (
            <View style={style.container}>
                <KeyboardAvoidingView style={{height:hp('100%')}} behavior="padding">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{marginBottom:24}}>
                            <View style={style.header}>
                                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                                    <Feather name="arrow-left" size={RFValue(25,580)} color='white'></Feather>
                                </TouchableOpacity>
                                <Text style={style.headertitle}>Login</Text>
                                <View style={{width:RFValue(25,580)}}></View>
                            </View>
                            <Image source={require('../assets/images/darkmode/carp.png')} style={style.logo}></Image>
                            <View style={{marginTop:hp('7%'),marginBottom:48}}>
                                <View style={style.inputcontainer}>
                                    <EvilIcons name="envelope" size={RFValue(25,580)} color='white'></EvilIcons>
                                    <TextInput placeholder="Email" placeholderTextColor='white' style={style.input} value={userinfo.email} onChangeText={value=>setuser({...userinfo,email:value})}></TextInput>
                                </View>
                                <View style={style.inputcontainer}>
                                    <SimpleLineIcons name="lock" size={RFValue(22,580)} color='white'></SimpleLineIcons>
                                    <TextInput placeholder="Password" placeholderTextColor='white'  style={style.input} secureTextEntry={true} value={userinfo.password} onChangeText={value=>setuser({...userinfo,password:value})}></TextInput>
                                </View>
                                <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>navigation.navigate('Forgot')}>
                                    <Text style={{fontSize:RFValue(16,580),color:'white',fontFamily:'Montserrat-Regular'}}>Forgot Password</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={style.btncontainer} onPress={login}>
                                    <View style={{width:RFValue(16,580)}}></View>
                                    <Text style={style.btntext}>Login</Text>
                                    <Feather name="arrow-right" color="white" size={RFValue(16,580)}></Feather>
                                </TouchableOpacity>
                                <View style={{flexDirection:'row',display:'flex',alignItems:'center',marginTop:hp('4%')}}>
                                    <View style={{flex:1,height:1,backgroundColor:'#B6B6B6'}}></View>
                                    <Text style={{fontSize:RFValue(16,580),color:'white',marginLeft:10,marginRight:10,fontFamily:'din1451alt_G'}}>Quick Sign in with</Text>
                                    <View style={{flex:1,height:1,backgroundColor:'#B6B6B6'}}></View>
                                </View>
                                <View style={{flexDirection:'row',marginTop:hp('4%'),justifyContent:'space-between',display:'flex'}}>
                                    <TouchableOpacity style={[style.socialbtncontainer,{marginRight:15,backgroundColor:'#3D5C9E'}]}>
                                        <Text style={[style.btntext,{fontSize:RFValue(14,580),fontFamily:'din1451alt_G'}]}>Sign in with</Text>
                                        <EvilIcons name="sc-facebook" color="white" size={RFValue(25,580)}></EvilIcons>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[style.socialbtncontainer,{backgroundColor:'#F34336'}]} onPress={googlelogin}>
                                        <Text style={[style.btntext,{fontSize:RFValue(14,580),fontFamily:'din1451alt_G'}]}>Sign in with</Text>
                                        <AntDesign name="google" color="white" size={RFValue(25,580)}></AntDesign>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <Loading visible={loading}></Loading>
                    </ScrollView>
                </KeyboardAvoidingView>
                <AlertElement error={error} seterror={seterror}></AlertElement>
            </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#101010',
        padding:24
    },
    logo:{
        width:wp('25%'),
        height:wp('30%'),
        alignSelf:'center',
        marginTop:hp('4%')
    },
    header:{
        display:'flex',
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center'
    },
    headertitle:{
        fontSize:RFValue(22,580),
        fontFamily:'Quicksand-Medium',
        color:'white'
    },
    inputcontainer:{
        display:'flex',
        flexDirection:'row',
        backgroundColor:'#252525',
        shadowColor:'black',
        shadowOpacity:0.16,
        shadowRadius:5,
        shadowOffset:{
            height:3,
            width:0
        },
        borderRadius:32,
        elevation:2,
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:15,
        paddingRight:15,
        alignItems:'center',
        marginBottom:16,
        marginLeft:10,
        marginRight:10
    },
    input:{
        fontSize:RFValue(16,580),
        marginLeft:15,
        flex:1,
        fontFamily:'Montserrat-Regular',
        color:'white'
    },
    btncontainer:{
        display:'flex',
        justifyContent:'space-between',
        padding:15,
        backgroundColor:'#F6AA11',
        borderRadius:35,
        flexDirection:'row',
        alignItems:'center',
        marginTop:hp('4%')
    },
    btntext:{
        color:'white',
        fontSize:RFValue(18,580),
        fontFamily:'Montserrat-Medium'
    },
    socialbtncontainer:{
        display:'flex',
        justifyContent:'space-between',
        flex:1,
        borderRadius:30,
        flexDirection:'row',
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:10,
        alignItems:'center'
    }
    
})