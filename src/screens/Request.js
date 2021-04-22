import React, { useState , useEffect} from 'react'
import {View,StyleSheet,ImageBackground,ScrollView,TouchableOpacity,Text,TextInput,Image} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import IonIcons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Fontiso from 'react-native-vector-icons/Fontisto'
import config from '../config/config.json'
import Icon from '../component/OccasionIcon'
import Dropdown from 'react-native-dropdown-picker'
import {useSelector} from 'react-redux'
import {validateemail} from '../utils/email'

export default function Request({navigation,route})
{
    const {userinfo} = useSelector(state=>state.auth)
    const info = route.params.info
    const [request,setrequest] = useState({
        type:"video",
        for:"self",
        influencer:info.id,
        to:"",
        from:userinfo.fullname,
        pronoun:"",
        occasion:"",
        instruction:"",
        email:"",
        phone:"",
        hidevideo:false,
        quantity:1
    })

    const [error,seterror] = useState({})

    const occasions = [
        {label:"None",value:'',icon:'block-helper'},
        {label:"Birthday",value:'birthday',icon:"birthday-cake"},
        {label:"Gift",value:"gift",icon:"gift"},
        {label:"Pop talk",value:"talk",icon:"chart-line-variant"},
        {label:"Question",value:"question",icon:"chat-bubble-outline"},
        {label:"Get advice",value:"advice",icon:"flag-triangle"},
        {label:"Roast",value:'roast',icon:"gripfire"},
        {label:"Announcement",value:'announcement',icon:"smiley"},
        {label:"Wedding",value:'wedding',icon:"hearto"},
        {label:"Anniversary",value:'anniversary',icon:"users"},
        {label:"Just cuz",value:'cuz',icon:"star"}
    ]

    const gettotal = () => {
        if(request.type == 'video')
        {
            return info.videoprice;
        }
        else
        {
            return info.cafecitoprice;
        }
    }

    const validate = () => {
        let optional_field = ["hidevideo","phone","occasion","pronoun"]
        let validate_error = {}
        for(let item in request)
        {
            if(optional_field.indexOf(item) > -1 || item == 'from')
            {
                continue;
            }

            if(!request[item])
            {
                validate_error[item] = "This field is required"
            }
        }

        if(!request.from && request.for == "someone")
        {
            validate_error.from = "This field is required"
        }
        
        if(!validate_error.email && !validateemail(request.email))
        {
            validate_error.email = "Email is invalid"
        }

        seterror(validate_error)

        return Object.keys(validate_error).length == 0
        
    }

    const continuebtn = () => {
        if(validate())
        {
            navigation.navigate("Payment",{request:request,total:gettotal()})
        }
    }
 

    useEffect(()=>{
        setrequest({
            ...request,
            influencer:info.id
        })
    },[info.id])

    return (
        <View style={style.container}>
            <View style={style.header}>
                <View style={style.topheader}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <AntDesign name="arrowleft" color="white" size={RFValue(25,580)}></AntDesign>
                    </TouchableOpacity>
                    <Text style={style.headertitle}>Request</Text>
                    <View style={{width:RFValue(25,580)}}></View>
                </View>
            </View>
            <ScrollView style={{flex:1}}>
                <View>
                    <View style={style.contentprofile}>
                        <View style={{alignItems:'center'}}>
                            <Image source={info.profile?{uri:config.apiurl + "/" + info.profile}:require('../assets/images/darkmode/carp.png')} style={{borderRadius:15,width:wp('24.15'),height:wp('24.15')}}></Image>
                            <Text style={style.title}>New Request for {info.fullname}</Text>
                        </View>
                        <View style={{flexDirection:'row',display:'flex',marginTop:10}}>
                            <View style={{flex:1,borderRightColor:'#000000',borderRightWidth:1}}>
                                <Text style={style.infotitle}>What will you request?</Text>
                                <View style={{flexDirection:'row',display:'flex',marginTop:10}}>
                                    <View style={{flex:1,alignItems:'center'}}>
                                        <TouchableOpacity style={[style.btninfo,request.type == 'video'?{backgroundColor:'#F6AA11'}:{}]} onPress={()=>setrequest({...request,type:'video'})}>
                                            <FontAwesome5 size={RFValue(25,580)} color={request.type == 'video'?"white":'#F6AA11'} name="video"></FontAwesome5>
                                        </TouchableOpacity>
                                        <Text style={style.iteminfo}>Video (${info.videoprice})</Text>
                                    </View>
                                    <View style={{flex:1,alignItems:'center'}}>
                                        <TouchableOpacity style={[style.btninfo,request.type == 'cafecito'?{backgroundColor:'#F6AA11'}:{}]} onPress={()=>setrequest({...request,type:'cafecito'})}>
                                            <Image source={request.type == 'video'?require('../assets/images/coffee-hot.png'):require('../assets/images/coffee-hot-disable.png')} style={{width:RFValue(25,580),height:RFValue(25,580)}}></Image>
                                        </TouchableOpacity>
                                        <Text style={style.iteminfo}>Cafecito (${info.cafecitoprice})</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{flex:1}}>
                                <Text style={style.infotitle}>Who is this for?</Text>
                                <View style={{flexDirection:'row',display:'flex',marginTop:10}}>
                                    <View style={{flex:1,alignItems:'center'}}>
                                        <TouchableOpacity style={[style.btninfo,request.for == 'someone'?{backgroundColor:'#F6AA11'}:{}]} onPress={()=>setrequest({...request,for:"someone"})}>
                                            <IonIcons size={RFValue(25,580)} color={request.for == "someone"?"white":"#F6AA11"} name="person"></IonIcons>                                    
                                        </TouchableOpacity>
                                        <Text style={style.iteminfo}>Someone else</Text>
                                    </View>
                                    <View style={{flex:1,alignItems:'center'}}>
                                        <TouchableOpacity style={[style.btninfo,request.for == 'self'?{backgroundColor:'#F6AA11'}:{}]} onPress={()=>setrequest({...request,for:"self"})}>
                                            <MaterialCommunityIcons name="face" size={RFValue(25,580)} color={request.for == 'self'?"white":"#F6AA11"}></MaterialCommunityIcons>
                                        </TouchableOpacity>
                                        <Text style={style.iteminfo}>Myself</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={style.content}>
                        <View>
                            <Text style={style.label}>To</Text>
                            <View style={style.inputcontainer}>
                                <TextInput style={style.input} onChangeText={value=>setrequest({...request,to:value})} value={request.to}></TextInput>
                            </View>
                            {
                                error.to && (
                                    <Text style={style.error}>{error.to}</Text>
                                )
                            }
                        </View>
                        {
                            request.for == 'someone' && (
                                <View style={{marginTop:15}}>
                                    <Text style={style.label}>From</Text>
                                    <View style={style.inputcontainer}>
                                        <TextInput style={style.input} onChangeText={text=>setrequest({...request,from:text})} value={request.from}></TextInput>
                                    </View>
                                    {
                                        error.from && (
                                            <Text style={style.error}>{error.from}</Text>
                                        )
                                    }
                                </View>
                            )
                        }
                        {
                            request.type == 'cafecito'?(
                                <View style={{marginTop:15}}>
                                    <Text style={style.label}>Quantity</Text>
                                    <View style={[style.inputcontainer,{width:wp('40'),paddingTop:15,paddingBottom:15}]}>
                                        <TouchableOpacity onPress={()=>setrequest({...request,quantity:Math.max(request.quantity - 1,1)})}>
                                            <AntDesign name="minus" color="#F6AA11" size={RFValue(20,580)}></AntDesign>
                                        </TouchableOpacity>
                                        <Text style={[style.input,{textAlign:'center'}]}>{request.quantity}</Text>
                                        <TouchableOpacity onPress={()=>setrequest({...request,quantity:request.quantity + 1})}>
                                            <AntDesign name="plus" color="#F6AA11" size={RFValue(20,580)}></AntDesign>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ):(
                                <View style={{marginTop:15}}>
                                    <Text style={style.label}>Pronoun</Text>
                                    <Dropdown 
                                        style={[style.inputcontainer,{borderColor:'#252525',alignItems:'center'}]}
                                        labelStyle={[style.input,{fontSize:RFValue(11,580)}]}
                                        containerStyle={{borderRadius:28,alignItems:'center'}}
                                        placeholder="Select...."
                                        defaultValue={request.pronoun}
                                        arrowColor="white"
                                        arrowSize={28}
                                        dropDownStyle={{backgroundColor:'#252525'}}
                                        items={[
                                            {label:'They/Them:"Wish them a happy birthday!"',value:'They/Them'},
                                            {label:'She/Her:"Wish her a happy birthday!"',value:'She/Her'},
                                            {label:'He/Him:"Wish him a happy birthday!"',value:'He/Him'},
                                            {label:'Pronoun not listed: will clarify in request',value:'not listed'}
                                        ]}
                                        onChangeItem={item=>setrequest({...request,pronoun:item.value})}
                                    ></Dropdown>
                                    {/* <View style={style.inputcontainer}>
                                        <TextInput style={style.input}></TextInput>
                                    </View> */}
                                </View>
                            )
                        }
                        <Text style={[style.infotitle,{fontSize:RFValue(14,580),textAlign:'left',marginTop:15}]}>Select an occasion</Text>
                        <View style={{flexDirection:'row',display:'flex',flexWrap:'wrap',marginTop:10}}>
                            {
                                occasions.map((item,index)=>(
                                    <View style={{alignItems:'center',marginRight:15,marginBottom:15,width:wp('20') - 25}} key={index}>
                                        <TouchableOpacity style={[style.btninfo,request.occasion == item.value?{backgroundColor:'#F6AA11'}:{}]} onPress={()=>setrequest({...request,occasion:item.value})}>
                                            <Icon color={request.occasion == item.value?"white":"#F6AA11"} size={RFValue(25,580)} name={item.icon}></Icon>
                                        </TouchableOpacity>
                                        <Text style={style.iteminfo}>{item.label}</Text>
                                    </View>
                                ))
                            }
                        </View>
                        <Text style={[style.infotitle,{fontSize:RFValue(15,580),textAlign:'left'}]}>Instructions</Text>
                        <Text style={style.description}>My instructions for "{info.fullname}" are</Text>
                        <View style={[style.inputcontainer,{marginTop:5}]}>
                            <TextInput style={style.input} multiline={true} numberOfLines={5} onChangeText={text=>setrequest({...request,instruction:text})} textAlignVertical="top"></TextInput>
                        </View>
                        {
                            error.instruction && (
                                <Text style={style.error}>{error.instruction}</Text>
                            )
                        }
                        <Text style={[style.description,{marginTop:5,fontSize:RFValue(13,580)}]}>
                        If this is a gift don't forget to add pronunciation, it really helps
                        </Text>
                        <View style={[style.inputcontainer,{marginTop:10}]}>
                            <Fontiso name="email" size={RFValue(25,580)} color="#A2A2A2"></Fontiso>
                            <TextInput style={style.input} placeholder="My Email" placeholderTextColor='white' onChangeText={text=>setrequest({...request,email:text})}></TextInput>
                        </View>
                        {
                            error.email && (
                                <Text style={style.error}>{error.email}</Text>
                            )
                        }
                        <Text style={style.description}>Text me order updates (optional)</Text>
                        <View style={[style.inputcontainer,{marginTop:5}]}>
                            <TextInput style={style.input} value={request.phone} ></TextInput>
                        </View>
                        <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity style={style.checkbox} onPress={()=>setrequest({...request,hidevideo:!request.hidevideo})}>
                                {
                                    request.hidevideo && (
                                        <Feather name="check" color="#F6AA11" size={RFValue(25,580)}></Feather>
                                    )
                                }
                            </TouchableOpacity>
                            <Text style={[style.description,{marginLeft:5}]}>Hide this video from "{info.fullname}" a profile</Text>
                        </View>
                        <TouchableOpacity style={style.continuebtn} onPress={continuebtn}>
                            <View style={{width:RFValue(25,580)}}></View>
                            <Text style={style.btntext}>Continue</Text>
                            <AntDesign name="arrowright" color="white" size={RFValue(25,580)}></AntDesign>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#101010'
    },
    header:{
        padding:24,
        paddingBottom:10
    },
    topheader:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    contentprofile:{
        paddingLeft:24,
        paddingRight:24,
        paddingBottom:10,
    },
    headertitle:{
        fontSize:RFValue(18,580),
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    title:{
        fontSize:RFValue(19,580),
        color:'#C9C9C9',
        fontFamily:'Quicksand-Medium',
        marginTop:5
    },
    infotitle:{
        color:'white',
        fontSize:RFValue(12,580),
        fontFamily:"Quicksand-Medium",
        textAlign:'center'
    },
    btninfo:{
        width:wp('13.28'),
        height:wp('13.28'),
        borderRadius:wp('6.64'),
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#F6AA11',
        borderWidth:1
    },
    iteminfo:{
        fontSize:RFValue(9,580),
        color:'#C9C9C9',
        fontFamily:"Quicksand-Medium",
        marginTop:5,
        textAlign:'center'
    },
    content:{
        padding:24,
        paddingTop:10
    },
    label:{
        fontSize:RFValue(15,580),
        color:'white',
        fontFamily:'Quicksand-Medium',
        marginBottom:9
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
        borderRadius:28,
        paddingLeft:15,
        paddingRight:15,
        alignItems:'center',
        marginBottom:5
    },
    input:{
        fontSize:RFValue(16,580),
        flex:1,
        fontFamily:'Montserrat-Regular',
        color:'white'
    },
    description:{
        fontSize:RFValue(15,580),
        color:'white',
        fontFamily:'Quicksand-Regular'
    },
    continuebtn:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#F6AA11',
        paddingLeft:24,
        paddingRight:24,
        paddingTop:15,
        paddingBottom:15,
        borderRadius:35,
        marginTop:15,
        marginBottom:40
    },
    btntext:{
        fontSize:RFValue(18,580),
        color:'white',
        fontFamily:'Montserrat-Medium',
    },
    checkbox:{
        width:wp('7.2'),
        height:wp('7.2'),
        backgroundColor:'#252525',
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
    },
    error:{
        color:'red'
    }
})