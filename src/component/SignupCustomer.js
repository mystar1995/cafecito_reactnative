import React,{useEffect, useState} from 'react'
import {View,StyleSheet,Image,TouchableOpacity,Text,TextInput} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {validateemail} from '../utils/email'
import Modal from 'react-native-modal'
import { Alert } from 'react-native'
import {createuser,loginwithsocial} from '../service/userservice'
import GeoLocation from '@react-native-community/geolocation'
import GeoCoding from 'react-native-geocoding'
import config from '../config/config.json'
import AlertElement from '../component/AlertComponent'
import {GoogleSignin,statusCodes} from '@react-native-community/google-signin'
import Loading from 'react-native-loading-spinner-overlay'

export default function SignupCustomer({role,navigation})
{
    const [checked,setchecked] = useState(false)
    const [modal,setmodal] = useState(false)
    const [error,seterror] = useState("")
    const [loading,setloading] = useState(false)
    const [userinfo,setuserinfo] = useState({
        fullname:"",
        username:"",
        email:"",
        password:"",
        confirm_password:""
    })

    useEffect(()=>{
        GoogleSignin.configure({
            webClientId:config.webcliendid,
            offlineAccess:true
        })
    },[])

    const signup = () => {
        if(validate())
        {
            setloading(true)
            let user = {
                email:userinfo.email,
                password:userinfo.password,
                fullname:userinfo.fullname,
                username:userinfo.username,
                role:role
            }

            GeoCoding.init(config.api_key)

            GeoLocation.getCurrentPosition(position=>{
                user.latitude = position.coords.latitude
                user.longitude = position.coords.longitude

                fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + '&key=' + config.api_key)
                .then(res=>res.json())
                .then(json=>{
                    if(json.results.length > 0)
                    {
                        user.address = json.results[0].formatted_address
                        for(let item in json.results[0].address_components)
                        {
                            if(json.results[0].address_components[item].types.indexOf('street_number') > -1)
                            {
                                user.apartment = json.results[0].address_components[item].long_name
                            }
                            else if(json.results[0].address_components[item].types.indexOf('locality') > -1 || json.results[0].address_components[item].types.indexOf('administrative_area_level_3') > -1)
                            {
                                user.city = json.results[0].address_components[item].long_name
                            }
                            else if(json.results[0].address_components[item].types.indexOf('postal_code') > -1)
                            {
                                user.post_code = json.results[0].address_components[item].long_name
                            }
                            else if(json.results[0].address_components[item].types.indexOf('administrative_area_level_1') > -1)
                            {
                                user.state = json.results[0].address_components[item].long_name
                            }
                            else if(json.results[0].address_components[item].types.indexOf('country') > -1)
                            {
                                user.country = json.results[0].address_components[item].long_name
                            }
                        }
                    }

                    createuser(user).then(res=>{
                        if(res.data.success)
                        {
                            if(role == 'influencer')
                            {
                                setmodal(true)
                            }
                            else
                            {
                                seterror("You have registered successfully")
                                navigation.navigate('Login');
                            }
                        }
                        else
                        {
                            seterror(res.data.message)
                        }
                        setloading(false)
                    }).catch(err=>{setloading(false);console.log(err.response.data)})
                })
                .catch(err=>{setloading(false);console.log(err)})

            },err=>{
                setloading(false)
                console.log(err)
            })
        }
    }

    const googlesignup = async() => {
        try
        {
            let user = {role}
            GeoCoding.init(config.api_key)
            let userinfo = await GoogleSignin.signIn()
            user = {
                ...user,
                email:userinfo.user.email,
                fullname:userinfo.user.familyName + " " + userinfo.user.givenName,
                username:userinfo.user.name,
                profile:userinfo.user.photo
            }

            setloading(true)
            GeoLocation.getCurrentPosition(position=>{
                user.latitude = position.coords.latitude
                user.longitude = position.coords.longitude
                loginwithsocial(user).then(res=>{
                    if(res.data.success)
                    {
                        if(role == 'influencer')
                        {
                            setmodal(true)
                        }
                        else
                        {
                            seterror("You have registered successfully")
                            navigation.navigate('Login');
                        }
                    }

                    setloading(false)
                })
            })

        }
        catch(e)
        {
            console.log(e)
        }
    }

    const changetext = (name,text) => {
        setuserinfo({
            ...userinfo,
            [name]:text
        })
    }

    const validate = () => {
        if(!checked)
        {
            seterror("You have to check terms and conditions to sign up")
            return false;
        }

        for(let item in userinfo)
        {
            if(!userinfo[item])
            {
                seterror("Please fill all field")
                return false;
            }
        }

        if(!validateemail(userinfo.email))
        {
            seterror("Email is not valid")
            return false;
        }

        if(userinfo.password != userinfo.confirm_password)
        {
            seterror("Password has to be same as Confirm Password");
            return false;
        }
        return true;
    }

    return (
        <View style={style.container}>
             <View style={style.inputcontainer}>
                <Feather name="user" size={RFValue(25,580)} color="white"></Feather>
                <TextInput placeholder="Full Name" placeholderTextColor="white" style={style.input} value={userinfo.fullname} onChangeText={value=>changetext("fullname",value)}></TextInput>
            </View>
            <View style={style.inputcontainer}>
                <Feather name="user" size={RFValue(25,580)} color="white"></Feather>
                <TextInput placeholder="Username" placeholderTextColor="white" style={style.input} value={userinfo.username} onChangeText={value=>changetext("username",value)}></TextInput>
            </View>
            <View style={style.inputcontainer}>
                <EvilIcons name="envelope" size={RFValue(25,580)} color="white"></EvilIcons>
                <TextInput placeholder="Email" placeholderTextColor="white" style={style.input} value={userinfo.email} onChangeText={value=>changetext("email",value)}></TextInput>
            </View>
            <View style={style.inputcontainer}>
                <SimpleLineIcons name="lock" size={RFValue(22,580)} color="white"></SimpleLineIcons>
                <TextInput placeholder="Password" placeholderTextColor="white" style={style.input} secureTextEntry={true} value={userinfo.password} onChangeText={value=>changetext("password",value)}></TextInput>
            </View>
            <View style={style.inputcontainer}>
                <SimpleLineIcons name="lock" size={RFValue(22,580)} color="white"></SimpleLineIcons>
                <TextInput placeholder="Confirm Password" placeholderTextColor="white" style={style.input} secureTextEntry={true} value={userinfo.confirm_password} onChangeText={value=>changetext("confirm_password",value)}></TextInput>
            </View>
            <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginLeft:10,marginRight:10}}>
                <TouchableOpacity style={style.checkbox} onPress={()=>setchecked(!checked)}>
                    {
                        checked && (
                            <Feather name="check" color='#F6AA11' size={RFValue(25,580)}></Feather>
                        )
                    }
                </TouchableOpacity>
                <Text style={[style.termtext,{marginLeft:15}]}>I agree with </Text>
                <Text style={[style.termtext,{color:'#F6AA11',textDecorationColor:'#F6AA11',textDecorationLine:'underline'}]}>terms and conditions</Text>
            </View>
            <TouchableOpacity style={style.btncontainer} onPress={signup}>
                <View style={{width:RFValue(16,580)}}></View>
                <Text style={style.btntext}>Signup</Text>
                <Feather name="arrow-right" color="white" size={RFValue(16,580)}></Feather>
            </TouchableOpacity>
            <View style={{flexDirection:'row',display:'flex',alignItems:'center',marginTop:hp('2%')}}>
                <View style={{flex:1,height:1,backgroundColor:'#B6B6B6'}}></View>
                <Text style={{fontSize:RFValue(16,580),color:"#C2C2C2",marginLeft:10,marginRight:10,fontFamily:'din1451alt_G'}}>Quick signup in with</Text>
                <View style={{flex:1,height:1,backgroundColor:'#B6B6B6'}}></View>
            </View>
            <View style={{flexDirection:'row',marginTop:hp('2%'),justifyContent:'space-between',display:'flex',marginBottom:24}}>
                <TouchableOpacity style={[style.socialbtncontainer,{marginRight:15,backgroundColor:'#3D5C9E'}]}>
                    <Text style={[style.btntext,{fontSize:RFValue(14,580),fontFamily:'din1451alt_G'}]}>Signup with</Text>
                    <FontAwesome name="facebook" color="white" size={RFValue(25,580)}></FontAwesome>
                </TouchableOpacity>
                <TouchableOpacity style={[style.socialbtncontainer,{backgroundColor:'#F34336'}]} onPress={googlesignup}>
                    <Text style={[style.btntext,{fontSize:RFValue(14,580),fontFamily:'din1451alt_G'}]}>Signup with</Text>
                    <AntDesign name="google" color="white" size={RFValue(25,580)}></AntDesign>
                </TouchableOpacity>
            </View>

            <Modal 
                isVisible={modal}
                onBackdropPress={()=>setmodal(false)}
                >
                <View style={style.modalinside}>
                    <View style={style.securitylogo}>
                        <Image source={require('../assets/images/security.png')}></Image>
                    </View>
                    <Text style={style.description}>Wait Admin Need approve your Account.</Text>
                    <TouchableOpacity style={[style.btncontainer,{width:wp('34.54'),justifyContent:'center'}]} onPress={()=>{setmodal(false); navigation.navigate('Upload',{email:userinfo.email})}}>
                        <Text style={style.btntext}>Ok</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <AlertElement error={error} seterror={seterror}></AlertElement>
            <Loading visible={loading}></Loading>
        </View>
    );
}


const style = StyleSheet.create({
    container:{
        marginTop:10,
        marginBottom:24
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
        elevation:1,
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
        fontSize:RFValue(15,580),
        marginLeft:15,
        flex:1,
        fontFamily:'Montserrat-Regular',
        color:'white'
    },
    termtext:{
        fontSize:RFValue(14,580),
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
        marginTop:hp('2.5%')
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
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:25,
        paddingRight:25,
        alignItems:'center'
    },
    modalinside:{
        backgroundColor:'white',
        padding:20,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:17
    },
    securitylogo:{
        width:wp('27'),
        height:wp('27'),
        borderRadius:wp('13.5'),
        backgroundColor:'#FFF5F7',
        justifyContent:'center',
        alignItems:'center'
    },
    description:{
        fontSize:RFValue(18,580),
        fontFamily:'Quicksand-Medium',
        textAlign:'center',
        marginTop:16
    },
    checkbox:{
        width:wp('7.2'),
        height:wp('7.2'),
        backgroundColor:'#252525',
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
    }
})