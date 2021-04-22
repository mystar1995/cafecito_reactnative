import React,{useEffect,useState} from 'react'
import {View,StyleSheet,ImageBackground,TouchableOpacity,Text,Image,ScrollView,FlatList,TextInput, KeyboardAvoidingView} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import {useSelector,useDispatch} from 'react-redux'
import config from '../config/config.json'
import {setprofileinfo} from '../redux/action/auth'
import ImagePicker from 'react-native-image-crop-picker'
import AlertElement from '../component/AlertComponent'
import {updateprofile} from '../service/userservice'
import Loading from 'react-native-loading-spinner-overlay'
export default function InfluencerEdit({navigation})
{
    const {userinfo,token} = useSelector(state=>state.auth)
    const [loading,setloading] = useState(false)
    const dispatch = useDispatch()
    const [user,setuser] = useState(userinfo)
    const [image,setimage] = useState(null)
    const [error,seterror] = useState("")

    useEffect(()=>{
        setuser(userinfo)
    },[userinfo])
    const pickimage = () => {
        ImagePicker.openPicker({quantity:0.5}).then(imageinfo=>{
            setimage({
                uri:imageinfo.path,
                type:imageinfo.mime,
                name:imageinfo.path.split('/').pop()
            })
        }).catch(err=>console.log(err))
    }

    const validate = () => {
        if(!user.fullname)
        {
            seterror('Full Name is required');
            return false;
        }

        if(!user.username)
        {
            seterror("User Name is required")
            return false;
        }

        if(!user.address)
        {
            seterror('Address is required');
            return false;
        }

        return true;
    }

    const submit = () => {
        if(validate())
        {
            let userinfo = {
                fullname:user.fullname,
                username:user.username,
                job:user.job,
                description:user.description,
                address:user.address,
                apartment:user.apartment,
                city:user.city,
                state:user.state,
                country:user.country,
                post_code:user.post_code,
                videoprice:user.videoprice,
                cafecitoprice:user.cafecitoprice
            }

            if(image)
            {
                userinfo.profile = image;
            }

            setloading(true)

            updateprofile(userinfo,token).then(res=>{
                console.log(res.data)
                if(res.data.success)
                {
                    seterror('You have successfully update your profile')
                    dispatch(setprofileinfo(res.data.user))
                }
                else
                {
                    seterror(res.data.message)
                }
                setloading(false)
            }).catch(err=>setloading(false))
        }
    }

    return (
        <KeyboardAvoidingView style={{flex:1}} behavior="height">
            <View style={style.container}>
                <View style={style.header}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <Feather name="arrow-left" size={RFValue(25,580)} color="white"></Feather>
                    </TouchableOpacity>
                    <Text style={style.title}>Edit Profile</Text>
                    <TouchableOpacity style={style.righticon}>
                        
                    </TouchableOpacity>
                </View>
                <ScrollView style={{marginTop:15}}>
                    <View style={{marginBottom:24}}>
                        <View style={[style.profileimg,{alignSelf:'center'}]}>
                            <Image source={image?{uri:image.uri}:user.profile?{uri:config.apiurl + "/" + user.profile}:require('../assets/images/darkmode/carp.png')} style={style.profileimg}></Image>
                            <TouchableOpacity style={[style.editbtn,{position:'absolute',right:10,bottom:0}]} onPress={pickimage}>
                                <Image source={require('../assets/images/edit.png')} style={{width:wp('3.79'),height:wp('3.79')}}></Image>
                                {/* <FontAwesome name="edit" color="white" size={wp('3.79')}></FontAwesome> */}
                            </TouchableOpacity>
                        </View>
                        <View style={{margin:30}}>
                            <View>
                                <Text style={style.label}>Full Name :</Text>
                                <View style={style.inputcontainer}>
                                    <TextInput style={style.input} placeholder="Full Name" placeholderTextColor="#FFFFFFAD" value={user.fullname} onChangeText={text=>setuser({...user,fullname:text})}></TextInput>
                                </View>
                            </View>
                            <View style={{marginTop:16}}>
                                <Text style={style.label}>User Name :</Text>
                                <View style={style.inputcontainer}>
                                    <TextInput style={style.input} placeholder="User Name" placeholderTextColor="#FFFFFFAD" value={user.username} onChangeText={text=>setuser({...user,username:text})}></TextInput>
                                </View>
                            </View>
                            <View style={{marginTop:16}}>
                                <Text style={style.label}>Job :</Text>
                                <View style={style.inputcontainer}>
                                    <TextInput style={style.input} placeholder="Job" placeholderTextColor="#FFFFFFAD" value={user.job} onChangeText={text=>setuser({...user,job:text})}></TextInput>
                                </View>
                            </View>
                            <View style={{marginTop:16}}>
                                <Text style={style.label}>Description :</Text>
                                <View style={[style.inputcontainer,{borderRadius:15}]}>
                                    <TextInput style={style.input} placeholder="Description" placeholderTextColor="#FFFFFFAD" value={user.description} onChangeText={text=>setuser({...user,description:text})} numberOfLines={5} textAlignVertical="top" multiline={true}></TextInput>
                                </View>
                            </View>
                            <View style={{marginTop:16}}>
                                <Text style={style.label}>Address :</Text>
                                <View style={style.inputcontainer}>
                                    <TextInput style={style.input} placeholder="Full Address" placeholderTextColor="#FFFFFFAD" value={user.address} onChangeText={text=>setuser({...user,address:text})}></TextInput>
                                </View>
                                <View style={style.inputcontainer}>
                                    <TextInput style={style.input} placeholder="Apartment, Suite ,etc (Optional)" placeholderTextColor="#FFFFFFAD" value={user.apartment} onChangeText={text=>setuser({...user,apartment:text})}></TextInput>
                                </View>
                                <View style={{display:'flex',flexDirection:'row'}}>
                                    <View style={[style.inputcontainer,{marginRight:15,flex:1}]}>
                                        <TextInput style={style.input} placeholder="City" placeholderTextColor="#FFFFFFAD" value={user.city} onChangeText={text=>setuser({...user,city:text})}></TextInput>
                                    </View>
                                    <View style={[style.inputcontainer,{flex:1}]}>
                                        <TextInput style={style.input} placeholder="State" placeholderTextColor="#FFFFFFAD" value={user.state} onChangeText={text=>setuser({...user,state:text})}></TextInput>
                                    </View>
                                </View>
                                <View style={{display:'flex',flexDirection:'row'}}>
                                    <View style={[style.inputcontainer,{marginRight:15,flex:1}]}>
                                        <TextInput style={style.input} placeholder="Country" placeholderTextColor="#FFFFFFAD" value={user.country} onChangeText={text=>setuser({...user,country:text})}></TextInput>
                                    </View>
                                    <View style={[style.inputcontainer,{flex:1}]}>
                                        <TextInput style={style.input} placeholder="PostalCode" placeholderTextColor="#FFFFFFAD" value={user.post_code} onChangeText={text=>setuser({...user,post_code:text})}></TextInput>
                                    </View>
                                </View>
                            </View>
                            <View style={style.pricecontainer}>
                                <Text style={[style.label,{fontSize:RFValue(18,580)}]}>Price</Text>
                                <View style={{display:'flex',flexDirection:'row',marginTop:15}}>
                                    <View style={{flex:1,marginRight:9}}>
                                        <Text style={style.pricelabel}>Video Message</Text>
                                        <View style={[style.inputcontainer,{backgroundColor:'black'}]}>
                                            <Text style={[style.input,{flex:0}]}>$</Text>
                                            <TextInput style={style.input} placeholder="Video Message" keyboardType="number-pad" placeholderTextColor="#FFFFFFAD" value={user.videoprice + ""} onChangeText={text=>setuser({...user,videoprice:text})}></TextInput>
                                        </View>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text style={style.pricelabel}>Cafecito</Text>
                                        <View style={[style.inputcontainer,{backgroundColor:'black'}]}>
                                            <Text style={[style.input,{flex:0}]}>$</Text>
                                            <TextInput style={style.input} placeholder="Cafecito" keyboardType="number-pad" placeholderTextColor="#FFFFFFAD" value={user.cafecitoprice + ""} onChangeText={text=>setuser({...user,cafecitoprice:text})}></TextInput>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={style.save_btn} onPress={submit}>
                                <View style={{width:RFValue(25,580)}}></View>
                                <Text style={style.btntext}>Save</Text>
                                <AntDesign color="white" size={RFValue(25,580)} name="check"></AntDesign>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <AlertElement error={error} seterror={seterror}></AlertElement>
                <Loading visible={loading}></Loading>
            </View>
    </KeyboardAvoidingView>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#101010'
    },
    header:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:24,
        paddingRight:24,
        paddingTop:24
    },
    righticon:{
        width:wp('9%'),
        height:wp('9%'),
        borderRadius:wp('5%'),
        justifyContent:'center',
        alignItems:'center',
    },
    headertitle:{
        fontSize:RFValue(22,580)
    },
    title:{
        fontSize:RFValue(18,580),
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    inputcontainer:{
        display:'flex',
        flexDirection:'row',
        paddingLeft:25,
        paddingRight:25,
        paddingTop:3,
        paddingBottom:3,
        backgroundColor:'#252525',
        borderRadius:100,
        alignItems:'center',
        shadowColor:'black',
        shadowOpacity:0.16,
        elevation:1,
        shadowOffset:{
            height:3,
            width:0
        },
        shadowRadius:5,
        marginTop:10
    },
    profileimg:{
        width:wp('28.5'),
        height:wp('28.5'),
        borderRadius:wp('14')
    },
    editbtn:{
        width:wp('7.72'),
        height:wp('7.72'),
        borderRadius:wp('3.8'),
        backgroundColor:'#F6AA11',
        justifyContent:'center',
        alignItems:'center'
    },
    label:{
        fontSize:RFValue(13,580),
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    input:{
        fontSize:RFValue(14,580),
        fontFamily:'Quicksand-Medium',
        color:'white',
        flex:1
    },
   save_btn:{
       borderRadius:35,
       backgroundColor:'#F6AA11',
       paddingTop:15,
       paddingBottom:15,
       paddingLeft:24,
       paddingRight:24,
       display:'flex',
       flexDirection:'row',
       justifyContent:'space-between',
       alignItems:'center',
       marginTop:28
   },
   btntext:{
       color:'white',
       fontSize:RFValue(18,580),
       fontFamily:'Montserrat-Medium'
   },
   pricecontainer:{
       borderRadius:29,
       backgroundColor:'#252525',
       padding:20,
       paddingTop:16,
       paddingBottom:16,
       marginTop:15
   },
   pricelabel:{
       fontSize:RFValue(12,580),
       color:'#F6AA11',
       fontFamily:'Quicksand-Medium'
   }
})