import React from 'react';
import {View,StyleSheet,Text,TouchableOpacity,Image} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {useDarkMode} from 'react-native-dark-mode'
export default function NotificationItem({notification})
{
    const gettime = () => {
        let date = new Date(notification.created_at);
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
        <View style={[style.container,{backgroundColor:'#252525'}]}>
            <TouchableOpacity style={!notification.is_read?style.latestalert:style.alert}>
                <MaterialCommunityIcons name="bell-ring-outline" color={'white'} size={wp('5.55')}></MaterialCommunityIcons>
            </TouchableOpacity>
            <View style={{flex:1,marginLeft:12,marginRight:12}}>
                <Text style={style.title}>{notification.title}</Text>
                <Text style={style.message}>{notification.description}</Text>
            </View>
            <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                <Image source={require('../assets/images/darkmode/calendar.png')}></Image>
                <Text style={style.received}>{gettime()}</Text>
            </View>
        </View>
    )
    
}

const style = StyleSheet.create({
    container:{
        paddingLeft:24,
        paddingRight:24,
        paddingTop:16,
        paddingBottom:16,
        borderBottomColor:'black',
        borderBottomWidth:1,
        display:'flex',
        flexDirection:'row'
    },
    latestalert:{
        width:wp('13.28'),
        height:wp('13.28'),
        backgroundColor:'#F6AA11',
        borderRadius:wp('6.64'),
        justifyContent:'center',
        alignItems:'center'
    },
    alert:{
        width:wp('13.28'),
        height:wp('13.28'),
        backgroundColor:'#101010',
        borderRadius:wp('6.64'),
        justifyContent:'center',
        alignItems:'center'
    },
    title:{
        fontSize:RFValue(15,580),
        fontFamily:'arial',
        color:'white'
    },
    message:{
        fontSize:RFValue(11,580),
        fontFamily:'arial',
        color:'#FFFFFF66'
    },
    received:{
        fontSize:RFValue(12,580),
        fontFamily:'arial',
        color:'#FFFFFFC7',
        marginLeft:5
    }

})