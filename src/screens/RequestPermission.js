import React,{useState,useEffect} from 'react';
import {PERMISSIONS,check,RESULTS,checkNotifications,request,requestNotifications} from 'react-native-permissions'
import {View,StyleSheet,Image,TouchableOpacity,Text,Platform} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen' 
import {getproducts,getcart} from '../service/productservice'
import {getpodcasts} from '../service/podcastservice'
import {getvideo} from '../service/videoservice'
import {getinfluencers,getcard} from '../service/userservice'
import {getlivestream} from '../service/livestreamservice'
import {setpodcast} from '../redux/action/podcast'
import {setproduct} from '../redux/action/product'
import {setvideo} from '../redux/action/video'
import {setcart} from '../redux/action/cart'
import {setcardinfo} from '../redux/action/auth'
import {setinfluencers} from '../redux/action/influencers'
import {useDispatch,useSelector} from 'react-redux'
import {setlivestream} from '../redux/action/livestream'
export default function RequestPermission({navigation})
{
    const {userinfo,token} = useSelector(state=>state.auth)
    const dispatch = useDispatch()
    const logoimages = [
        require('../assets/images/darkmode/Character.png'),
        require('../assets/images/darkmode/notification.png')
    ];

    const influencer_logoimages = [
        require('../assets/images/influencer_location.png'),
        require('../assets/images/influencer_notification.png')
    ]

    const influencer_description = [
        'Enable location to customers show \n you on the app.',
        'Allow Notification to get new requests,\n messages, feedback and news.'
    ]

    const description = [
        "See shows you influencers and \n celebrities nearby.\n Enable your location to see them.",
        "We will notify you about new podcasts,\n live streams, videos and chat."
    ]

    const [index,setindex] = useState(0)

    const requestpermission = () => {
        if(index == 0)
        {
            setindex(1);
        }
        else
        {
            if(userinfo.role == 'influencer')
            {
                navigation.navigate('Pricing')
            }
            else
            {
                navigation.navigate('Home')
            }
            
        }
    }

    useEffect(()=>{
        if(index == 0)
        {
            check(Platform.OS == "android"?PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION:PERMISSIONS.IOS.LOCATION_ALWAYS).then(result=>{
                if(result == RESULTS.GRANTED)
                {
                    requestpermission()
                }
            })
        }
        else
        {
            checkNotifications().then(({status,settings})=>{
                if(status == RESULTS.GRANTED)
                {
                    requestpermission()
                }
            })
        }
    },[index])

    useEffect(()=>{
        getpodcasts(token).then(res=>{
            if(res.data.success)
            {
                dispatch(setpodcast(res.data.data))
            }
        }).catch(err=>console.log(err))

        getvideo(token).then(res=>{
            if(res.data.success)
            {
                dispatch(setvideo(res.data.video))
            }
        })

        getproducts(token).then(res=>{
            if(res.data.success)
            {
                dispatch(setproduct(res.data.product))
            }
        }).catch(err=>console.log(err))

        if(userinfo.role == 'customer')
        {
            getinfluencers(token).then(res=>{
                if(res.data.success)
                {
                    dispatch(setinfluencers(res.data.data))
                }
            }).catch(err=>console.log(err))

            getlivestream(token).then(res=>{
                if(res.data.success)
                {
                    dispatch(setlivestream(res.data.livestream))
                }
            })
        }

        getcard(token).then(res=>{
            if(res.data.success)
            {
                dispatch(setcardinfo(res.data.paymentmethod))
            }
        })

        getcart(token).then(res=>{
            if(res.data.success)
            {
                dispatch(setcart(res.data.carts))
            }
        })
    },[])

    const nextstate = () => {
        if(index == 0)
        {
            request(Platform.OS == "android"?PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION:PERMISSIONS.IOS.LOCATION_ALWAYS).then(result=>{
                if(result == RESULTS.GRANTED)
                {
                    requestpermission()
                }
            })
        }
        else if(index == 1)
        {
            requestNotifications(["sound","alert"]).then((status,setting)=>{
                if(status == RESULTS.GRANTED)
                {
                    requestpermission()
                }
            })
        }
    }

    return (
        <View style={style.container}>
            <View style={{flex:1}}>
                <Image source={userinfo.role == 'influencer'?influencer_logoimages[index]:logoimages[index]} style={index == 0?style.logo1:style.logo2}></Image>
                <Text style={style.description}>{userinfo.role == 'influencer'?influencer_description[index]:description[index]}</Text>
            </View>
            <View>
                <TouchableOpacity style={style.btncontainer} onPress={nextstate}>
                    <View style={{width:RFValue(16,580)}}></View>
                    <Text style={style.btntext}>{index == 0?'Enable Location':'Allow Notifications'}</Text>
                    {
                        index == 0?<MaterialIcons name="my-location" color="white" size={RFValue(16,580)}></MaterialIcons>:<Feather name="bell" color="white" size={RFValue(16,580)}></Feather>
                    }
                </TouchableOpacity>
                <TouchableOpacity style={{alignSelf:'center',marginTop:17}} onPress={requestpermission}>
                    <Text style={{fontSize:RFValue(16,580),color:"white",fontFamily:'Montserrat-Regular'}}>Not now</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#101010',
        padding:24,
        flexDirection:'column'
    },
    logo1:{
        alignSelf:'center',
        marginTop:hp('5%')
    },
    logo2:{
        alignSelf:'center',
        marginTop:hp('4%')
    },
    description:{
        fontSize:RFValue(16,580),
        color:'white',
        textAlign:'center',
        marginTop:43,
        fontFamily:'Montserrat-Regular'
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
    }
})