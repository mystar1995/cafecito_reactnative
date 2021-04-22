import React from 'react';
import {View,StyleSheet,TouchableOpacity,Image,Text} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import config from '../config/config.json'
import moment from 'moment'
import {accept,reject} from '../service/messageservice'
import {useSelector} from 'react-redux'
export default function ChatItem({userinfo,navigation,last,updatedata})
{
    const {token} = useSelector(state=>state.auth)

    const acceptuser = () => {
        accept(userinfo.id,token).then(res=>{
            if(res.data.success)
            {
                updatedata();
                navigation.navigate('Chating',{user:userinfo})
            }
        })
    }

    const rejectuser = () => {
        reject(userinfo.id,token).then(res=>{
            if(res.data.success)
            {
                updatedata()
            }
        })
    }

    return (
        <TouchableOpacity style={last?style.containerlast:style.container} onPress={()=>{if(!userinfo.is_invite){navigation.navigate('Chating',{user:userinfo})}}}>
            <View style={{position:'relative'}}>
                <Image source={userinfo.profile?{uri:config.apiurl + "/" + userinfo.profile}:require('../assets/images/darkmode/carp.png')} style={style.profile}></Image>
                {
                    userinfo.isonline && (
                        <TouchableOpacity style={style.badge}></TouchableOpacity>
                    )
                }
            </View>
            <View style={{marginLeft:15,flex:1,marginRight:15}}>
                <Text style={style.name}>{userinfo.fullname}</Text>
                <Text style={[style.message,{color:last?'white':'#C9C9C9',opacity:last?1:style.message.opacity}]} numberOfLines={1}>{userinfo.message}</Text>
            </View>
            {
                userinfo.is_invite ? (
                    <View>
                        <TouchableOpacity style={style.accept} onPress={acceptuser}>
                            <Text style={style.btntext}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[style.reject,{marginTop:8}]} onPress={rejectuser}>
                            <Text style={style.btntext}>Reject</Text>
                        </TouchableOpacity>
                    </View>
                ):<Text style={[style.received,{color:last?'white':'#C9C9C9',opacity:last?1:style.received.opacity}]}>{userinfo.sended?moment(new Date(userinfo.sended)).format('YYYY-MM-DD hh:mm:ss'):''}</Text>
            }
        </TouchableOpacity>
    )
}


const style = StyleSheet.create({
    container:{
        paddingLeft:24,
        paddingRight:24,
        paddingTop:17,
        paddingBottom:17,
        backgroundColor:'#252525',
        borderBottomColor:'#707070',
        borderBottomWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    containerlast:{
        paddingLeft:18,
        paddingRight:18,
        paddingTop:17,
        paddingBottom:17,
        backgroundColor:'#F6AA11',
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    profile:{
        width:wp('13.28'),
        height:wp('13.28'),
        borderRadius:wp('6.64')
    },
    badge:{
        width:11,
        height:11,
        borderRadius:6,
        backgroundColor:'#84C857',
        position:'absolute',
        right:0,
        top:5
    },
    name:{
        fontSize:RFValue(16,580),
        color:'white',
        fontWeight:'bold',
        fontFamily:'arial'
    },
    message:{
        marginTop:9,
        fontSize:RFValue(13,580),
        color:'#C9C9C9',
        opacity:0.4,
        fontWeight:'100',
        fontFamily:'arial'
    },
    accept:{
        width:61,
        height:21,
        backgroundColor:'#47B437',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:11,
        fontFamily:'Quicksand-Medium'
    },
    reject:{
        width:61,
        height:21,
        backgroundColor:'black',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:11,
        fontFamily:'Quicksand-Medium'
    },
    btntext:{
        fontSize:12,
        color:'white'
    },
    received:{
        color:'#C9C9C9',
        opacity:0.3,
        fontSize:RFValue(13,580),
        fontFamily:'arial'
    }
})