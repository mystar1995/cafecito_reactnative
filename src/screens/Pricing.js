import React,{useState} from 'react'
import {View,KeyboardAvoidingView,TextInput,Text,TouchableOpacity,StyleSheet,Image} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Feather from 'react-native-vector-icons/Feather'
import {setprofileinfo} from '../redux/action/auth'
import {setuserprofile} from '../service/userservice'
import {useSelector,useDispatch} from 'react-redux'

export default function Pricing({navigation})
{
    const {userinfo,token} = useSelector(state=>state.auth)
    const dispatch = useDispatch()

    const [state,setstate] = useState({
        videoprice:userinfo.videoprice,
        cafecitoprice:userinfo.cafecitoprice
    })

    const setvideoprice = () => {
        setuserprofile({videoprice:state.videoprice,cafecitoprice:state.cafecitoprice},token).then(res=>{
            if(res.data.success)
            {
                navigation.navigate('Podcasts')
                dispatch(setprofileinfo(state))
            }
        })
    }


    
    return (
        <KeyboardAvoidingView style={style.container} behavior="height">
            <View style={{flex:1,padding:24,justifyContent:'center',alignItems:'center'}}>
                <Image source={require('../assets/images/influencer_money.png')} style={style.logo}></Image>
                <Text style={style.title}>Pricing</Text>
                <View style={{width:wp('65.94')}}>
                    <Text style={style.label}>Video Massage</Text>
                    <TextInput style={style.input} keyboardType="number-pad" placeholder="" placeholderTextColor="white" value={state.videoprice + ""} onChangeText={(text)=>setstate({...state,videoprice:text})}></TextInput>
                    <Text style={style.label}>Cafecito</Text>
                    <TextInput style={style.input} keyboardType="number-pad" placeholder="" placeholderTextColor="white" value={state.cafecitoprice + ""} onChangeText={(text)=>setstate({...state,cafecitoprice:text})}></TextInput>
                </View>
                <TouchableOpacity style={style.btncontainer} onPress={setvideoprice}>
                    <View style={{width:RFValue(16,580)}}></View>
                    <Text style={style.btntext}>Let's started</Text>
                    <Feather name="arrow-right" color="white" size={RFValue(16,580)}></Feather>
                </TouchableOpacity>
            </View> 
        </KeyboardAvoidingView>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#101010'
    },
    logo:{
        width:wp('67.63'),
        height:wp('55.3478')
    },
    title:{
        marginTop:25,
        color:'white',
        fontSize:RFValue(18,580),
        fontFamily:'Quicksand-Bold',
        marginBottom:15
    },
    label:{
        marginTop:15,
        color:'white',
        fontSize:RFValue(12,580),
        fontFamily:'Quicksand-Medium'
    },
    input:{
        backgroundColor:'#252525',
        borderRadius:31,
        color:'white',
        paddingLeft:24,
        paddingRight:24,
        paddingTop:10,
        paddingBottom:10,
        marginTop:7
    },
    btncontainer:{
        display:'flex',
        justifyContent:'space-between',
        padding:15,
        backgroundColor:'#F6AA11',
        borderRadius:35,
        flexDirection:'row',
        alignItems:'center',
        marginTop:hp('4%'),
        width:wp('80.9')
    },
    btntext:{
        color:'white',
        fontSize:RFValue(18,580),
        fontFamily:'Montserrat-Medium'
    }
})