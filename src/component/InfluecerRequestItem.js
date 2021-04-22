import React from 'react'
import {View,TouchableOpacity,StyleSheet,Image,Text} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import config from '../config/config.json'

export default function InfluencerRequestItem({request,onrequest})
{
    const getcolor = () => {
        if(request.status == 'waiting')
        {
            return '#DBB419';
        }
        else if(request.status == 'completed')
        {
            return '#31CF3C';
        }
    }

    const gettime = () => {
        let date = new Date(request.created_at);
        let now = new Date()

        let time = Math.floor((now.getTime() - date.getTime())/1000)

        if(time < 60)
        {
            return time + ' seconds ago';
        }
        else if(time < 3600)
        {
            return Math.floor(time / 60) + " minutes ago"
        }
        else if(time < 3600 * 24)
        {
            return Math.floor(time / 3600) + " hours ago"
        }
        else
        {
            return Math.floor(time / 86400) + " days ago"
        }
    }

    return (
        <View style={style.container}>
            <Image source={request.customerinfo.profile?{uri:config.apiurl + "/" + request.customerinfo.profile}:require('../assets/images/darkmode/carp.png')} style={style.profile}></Image>
            <View style={{marginLeft:15,flex:1}}>
                <Text style={style.title}>{request.customerinfo.fullname}</Text>
                <View style={{marginTop:5}}>
                    <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginBottom:2}}>
                        {
                            request.type == 'video'?(
                                <TouchableOpacity style={style.camerabtn}>
                                    <FontAwesome5 name="video" color="#F6AA11" size={RFValue(12,580)}></FontAwesome5>
                                </TouchableOpacity>
                            ):(
                                <TouchableOpacity style={style.camerabtn}>
                                    <Image source={require('../assets/images/coffee-hot.png')} style={{width:RFValue(12,580),height:RFValue(12,580)}}></Image>
                                </TouchableOpacity>
                            )
                        }
                        <Text style={[style.info,{fontFamily:'Quicksand-Medium'}]}>(${request.price})</Text>
                    </View>
                    <Text style={[style.info,{fontFamily:'Quicksand-Regular'}]}>{gettime()}</Text>
                </View>
                {
                    request.status == 'waiting' && (
                        <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:5}}>
                            <TouchableOpacity style={[style.btn,{backgroundColor:'#F6AA11'}]} onPress={()=>onrequest("completed")}>
                                <Text style={style.btntext}>Send</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[style.btn,{backgroundColor:'black',marginLeft:6}]} onPress={()=>onrequest('canceled')}>
                                <Text style={style.btntext}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            </View>
            <Text style={[style.status,{color:getcolor()}]}>{request.status}</Text>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        backgroundColor:'#252525',
        padding:15,
        borderRadius:9,
        display:'flex',
        flexDirection:'row',
        marginBottom:15
    },
    profile:{
        width:wp('13.28'),
        height:wp('13.28'),
        borderRadius:wp('6.64')
    },
    title:{
        color:'white',
        fontSize:RFValue(16,580),
        fontFamily:'Quicksand-Bold'
    },
    camerabtn:{
        width:wp('5.8'),
        height:wp('5.8'),
        borderRadius:wp('2.9'),
        borderColor:'#F6AA11',
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center',
        marginRight:5
    },
    info:{
        fontSize:RFValue(9,580),
        color:'white'
    },
    btn:{
        width:wp('14.73'),
        height:wp('5.314'),
        borderRadius:100,
        justifyContent:'center',
        alignItems:'center'
    },
    btntext:{
        fontSize:RFValue(10,580),
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    status:{
        marginTop:30,
        fontSize:RFValue(12,580),
        fontFamily:'Quicksand-Medium'
    }
})