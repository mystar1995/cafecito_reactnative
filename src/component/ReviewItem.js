import React from 'react';
import {View,StyleSheet,Image,Text,TouchableOpacity} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'
import config from '../config/config.json'
export default function ReviewItem({review,reply = ()=>{},me = false})
{
    const gettime = () => {
        let date = new Date(review.created_at);
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

    const renderreview = () => {
        let list = []

        for(let index = 0;index<review.reviews;index++)
        {
            list.push(<AntDesign color="#E9C448" size={RFValue(12,580)} name="star"></AntDesign>)
        }

        for(let index = review.reviews;index<5;index++)
        {
            list.push(<AntDesign color="#E9C448" size={RFValue(12,580)} name="staro"></AntDesign>)
        }

        return list;
    }

    return (
        <View style={style.container}>
            <View style={style.header}>
                <View style={style.profile}>
                    <Image source={review.customer.profile?{uri:config.apiurl + "/" + review.customer.profile}:require('../assets/images/darkmode/carp.png')} style={style.profileimg}></Image>
                    <View style={{marginLeft:10}}>
                        <Text style={style.title}>{review.customer.fullname}</Text>
                        <Text style={style.reviewcount}>{review.customer.reviews} Reviews</Text>
                    </View>
                </View>
                <View>
                    <View style={{display:'flex',flexDirection:'row'}}>
                        {renderreview()}
                    </View>
                    <Text style={style.time}>{gettime()}</Text>
                </View>
            </View>
            <Text style={style.description}>{review.description}</Text>
            {
                me && (
                    <TouchableOpacity style={{marginTop:10}} onPress={reply}>
                        <Text style={style.reviewcount}>Reply</Text>
                    </TouchableOpacity>
                )
            }
            
        </View>
    )
}


const style = StyleSheet.create({
    container:{
        borderBottomColor:'black',
        borderBottomWidth:1,
        backgroundColor:'#252525',
        padding:24
    },
    header:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    profile:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    profileimg:{
        width:wp('13.28'),
        height:wp('13.28'),
        borderRadius:wp('6.64')
    },
    title:{
        fontSize:RFValue(17,580),
        fontFamily:'arial',
        color:'white'
    },
    reviewcount:{
        fontFamily:'Quicksand-Medium',
        color:'#F6AA11',
        fontSize:RFValue(12,580)
    },
    time:{
        fontFamily:'Quicksand-Medium',
        color:'#888888',
        fontSize:RFValue(8,580)
    },
    description:{
        fontFamily:'Quicksand-Medium',
        color:'white',
        fontSize:RFValue(12,580),
        marginTop:5
    }
})