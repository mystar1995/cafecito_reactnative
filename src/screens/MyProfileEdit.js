import React,{useState} from 'react'
import {View,StyleSheet,ImageBackground,TouchableOpacity,Text,Image,ScrollView,FlatList,TextInput, KeyboardAvoidingView} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ScalingDrawer from 'react-native-scaling-drawer'
import {RFValue} from 'react-native-responsive-fontsize'
import Sidebar from '../component/Sidebar'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import {useSelector,useDispatch} from 'react-redux'
import config from '../config/config.json'
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-crop-picker'
import {updateprofile} from '../service/userservice'
import {setprofileinfo} from '../redux/action/auth'
import AlertComponent from '../component/AlertComponent'
import moment from 'moment';

export default function MyProfileEdit({navigation})
{
    const {userinfo,token} = useSelector(state=>state.auth)
    const [user,setuser] = useState(userinfo)
    const [image,setimage] = useState(false)
    const [error,seterror] = useState("")
    const dispatch = useDispatch()

    const openpicker = () => {
        ImagePicker.openPicker({quantity:0.5}).then(imageinfo=>{
            setimage({
                uri:imageinfo.path,
                type:imageinfo.mime,
                name:imageinfo.path.split('/').pop()
            })
        }).catch(err=>console.log(err))
    }

    const validate = () => {
        const required = ['fullname','username','email'];

        for(let item in required)
        {
            if(!user[required[item]])
            {
                seterror('Please Check Required Field');
                return false;
            }
        }
        return true;
    }

    const save = () => {
        if(validate())
        {
            let userinfo = {
                fullname:user.fullname,
                username:user.username,
                email:user.email,
                bio:user.bio,
                address:user.address,
                apartment:user.apartment,
                city:user.city,
                state:user.state,
                country:user.country,
                post_code:user.post_code,
                birthdate:user.birthdate
            }

            if(image)
            {
                userinfo.profile = image
            }
            
            updateprofile(userinfo,token).then(res=>{
                if(res.data.success)
                {
                    console.log(res.data.user)
                    seterror('You have updated successfully')
                    dispatch(setprofileinfo(res.data.user))
                }
            }).catch(err=>console.log(err.response.data))
        }
    }
    
    const curdate = new Date()
    curdate.setFullYear(curdate.getFullYear() - 25)
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
                            <TouchableOpacity style={[style.editbtn,{position:'absolute',right:10,bottom:0}]} onPress={openpicker}>
                                <Image source={require('../assets/images/edit.png')} style={{width:wp('3.79'),height:wp('3.79')}}></Image>
                                {/* <FontAwesome name="edit" color="white" size={wp('3.79')}></FontAwesome> */}
                            </TouchableOpacity>
                        </View>
                        <View style={{margin:30}}>
                            <View>
                                <Text style={style.label}>Full Name :</Text>
                                <View style={style.inputcontainer}>
                                    <TextInput style={style.input} placeholder="" placeholderTextColor="#929292" value={user.fullname} onChangeText={value=>setuser({...user,fullname:value})}></TextInput>
                                </View>
                            </View>
                            <View style={{marginTop:16}}>
                                <Text style={style.label}>User Name :</Text>
                                <View style={style.inputcontainer}>
                                    <TextInput style={style.input} placeholder="" placeholderTextColor="#929292" value={user.username} onChangeText={value=>setuser({...user,username:value})}></TextInput>
                                </View>
                            </View>
                            <View style={{marginTop:16}}>
                                <Text style={style.label}>Email ID :</Text>
                                <View style={style.inputcontainer}>
                                    <TextInput style={style.input} placeholder="" placeholderTextColor="#929292" value={user.email} onChangeText={value=>setuser({...user,email:value})}></TextInput>
                                </View>
                            </View>
                            <View style={{marginTop:16}}>
                                <Text style={style.label}>Bio :</Text>
                                <View style={style.inputcontainer}>
                                    <TextInput style={style.input} placeholder="" placeholderTextColor="#929292" value={user.bio} onChangeText={value=>setuser({...user,bio:value})}></TextInput>
                                </View>
                            </View>
                            <View style={{marginTop:16}}>
                                <Text style={style.label}>Address :</Text>
                                <View style={style.inputcontainer}>
                                    <TextInput style={style.input} placeholder="Full Address" placeholderTextColor="#929292" value={user.address} onChangeText={value=>setuser({...user,address:value})}></TextInput>
                                </View>
                                <View style={style.inputcontainer}>
                                    <TextInput style={style.input} placeholder="Apartment, Suite ,etc (Optional)" placeholderTextColor="#929292" value={user.apartment} onChangeText={value=>setuser({...user,apartment:value})}></TextInput>
                                </View>
                                <View style={{display:'flex',flexDirection:'row'}}>
                                    <View style={[style.inputcontainer,{marginRight:15,flex:1}]}>
                                        <TextInput style={style.input} placeholder="City" placeholderTextColor="#929292" value={user.city} onChangeText={value=>setuser({...user,city:value})}></TextInput>
                                    </View>
                                    <View style={[style.inputcontainer,{flex:1}]}>
                                        <TextInput style={style.input} placeholder="State" placeholderTextColor="#929292" value={user.state} onChangeText={value=>setuser({...user,state:value})}></TextInput>
                                    </View>
                                </View>
                                <View style={{display:'flex',flexDirection:'row'}}>
                                    <View style={[style.inputcontainer,{marginRight:15,flex:1}]}>
                                        <TextInput style={style.input} placeholder="Country" placeholderTextColor="#929292" value={user.country} onChangeText={value=>setuser({...user,country:value})}></TextInput>
                                    </View>
                                    <View style={[style.inputcontainer,{flex:1}]}>
                                        <TextInput style={style.input} placeholder="PostalCode" placeholderTextColor="#929292" value={user.post_code} onChangeText={value=>setuser({...user,post_code:value})}></TextInput>
                                    </View>
                                </View>
                            </View>
                            <View style={{marginTop:16}}>
                                <Text style={style.label}>Birthday :</Text>
                                <DatePicker
                                    style={{width:wp('100') - 48}}
                                    mode="date"
                                    date={user.birthdate?new Date(user.birthdate):curdate}
                                    customStyles={{dateInput:style.inputcontainer,dateText:style.input}}
                                    onDateChange={date=>setuser({...user,birthdate:date})}
                                ></DatePicker>
                                {/* <View style={style.inputcontainer}>
                                    <TextInput style={style.input} placeholder="" placeholderTextColor="#929292"></TextInput>
                                </View> */}
                            </View>
                            <TouchableOpacity style={style.save_btn} onPress={()=>save()}>
                                <View style={{width:RFValue(25,580)}}></View>
                                <Text style={style.btntext}>Save</Text>
                                <AntDesign color="white" size={RFValue(25,580)} name="check"></AntDesign>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <AlertComponent error={error} seterror={seterror}></AlertComponent>
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
        fontFamily:'arial'
    },
    input:{
        fontSize:RFValue(14,580),
        fontFamily:'Montserrat-Medium',
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
   }
})