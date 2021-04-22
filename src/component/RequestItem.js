import React from 'react'
import {View,StyleSheet,Image,Text, TouchableOpacity} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import config from '../config/config.json'
export default function RequestItem({request,navigation})
{
    const getstatuscolor = () => {
        switch(request.status)
        {
            case 'waiting':
                return '#EEB408';
            case 'completed':
                return '#10A400';
            default:
                return '#101010';
        }
    }

    const getstatus = () => {
        switch(request.status)
        {
            case 'waiting':
                return 'Pending'
            case 'completed':
                return 'Approved'
            default:
                return 'Canceled'
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

    const getreview = () => {
        let review = 0;
        for(let item in request.influencerinfo.reviews)
        {
            review += Number(request.influencerinfo.reviews[item].reviews)
        }

        return request.influencerinfo.reviews.length > 0?Math.floor(review / request.influencerinfo.reviews.length * 10)/10:0
    }

    return (
        <View style={style.container}>
            <Image source={request.influencerinfo.profile?{uri:config.apiurl + "/" + request.influencerinfo.profile}:require('../assets/images/darkmode/carp.png')} style={style.profile}></Image>
            <View style={{flex:1,marginLeft:15,marginRight:15}}>
                <Text style={style.name}>{request.influencerinfo.fullname}</Text>
                <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <FontAwesome name="star" color="#F6AA11" size={RFValue(13,580)}></FontAwesome>
                    <Text style={[style.review,{marginLeft:5}]}>{getreview()}({request.influencerinfo.reviews.length})</Text>
                    <TouchableOpacity style={{marginLeft:5}} onPress={()=>navigation.navigate('InfluencerReview',{influencer:request.influencerinfo})}>
                        <Text style={style.see_review}>See all reviews</Text>
                    </TouchableOpacity>
                </View>
                <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Text style={style.sectionitem}>{request.type}</Text>
                    <Text style={[style.sectionitem,{paddingLeft:15}]}>${request.price}</Text>
                    <Text style={[style.sectionitem,{borderRightWidth:0,paddingLeft:15}]}>{gettime()}</Text>
                </View>
            </View>
            <View>
                <TouchableOpacity style={[style.statusbtn,{backgroundColor:getstatuscolor()}]}>
                    <Text style={style.btntext}>{getstatus()}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        paddingLeft:24,
        paddingRight:24,
        paddingTop:17,
        paddingBottom:17,
        borderBottomColor:'black',
        borderBottomWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#252525'
    },
    profile:{
        width:wp('13.28'),
        height:wp('13.28'),
        borderRadius:wp('6.64')
    },
    name:{
        fontFamily:'arial',
        fontSize:RFValue(17,580),
        color:'white'
    },
    review:{
        fontSize:RFValue(13,580),
        fontFamily:'Montserrat-Regular',
        color:'#C9C9C968'
    },
    see_review:{
        fontSize:RFValue(12,580),
        fontFamily:'Quicksand-Medium',
        color:'#F6AA11'
    },
    sectionitem:{
        fontSize:RFValue(11,580),
        fontFamily:'Quicksand-Medium',
        paddingRight:10,
        borderRightWidth:1,
        borderRightColor:'#FFFFFFB2',
        color:'#FFFFFFB2'
    },
    statusbtn:{
        width:wp('19.5'),
        justifyContent:'center',
        alignItems:'center',
        paddingTop:6,
        paddingBottom:6,
        borderRadius:11
    },
    btntext:{
        fontFamily:'Quicksand-Medium',
        fontSize:RFValue(10,580),
        color:'white'
    }
})