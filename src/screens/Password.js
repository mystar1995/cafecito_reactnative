import React,{useState} from 'react';
import {View,StyleSheet,KeyboardAvoidingView,TouchableOpacity,Text,TextInput,ScrollView} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IonIcons from 'react-native-vector-icons/Ionicons'
import {RFValue} from 'react-native-responsive-fontsize'
import {updatepassowrd} from '../service/userservice'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen' 
import AlertComponent from '../component/AlertComponent'
import {useSelector} from 'react-redux'
export default function Password({navigation})
{
    const {token} = useSelector(state=>state.auth)
    const [error,seterror] = useState("")
    const [info,setinfo] = useState({
        new:"",
        re:"",
        cur:""
    })

    const validate = () => {
        for(let item in info)
        {
            if(!info[item])
            {
                seterror('All Field has to be not empty')
                return false
            }
        }

        if(info.re != info.new)
        {
            seterror('Confirm Password has to be same with New Password')
            return false
        }

        return true
    }

    const save = () => {
        if(validate())
        {
            updatepassowrd({old:info.cur,new:info.new},token).then(res=>{
                if(res.data.success)
                {
                    navigation.navigate('Account')
                }
                else
                {
                    seterror(res.data.message)
                }
            }).catch(err=>console.log(err))
        }
    }

    return (
        <KeyboardAvoidingView style={{flex:1}} behavior="height">
            <ScrollView style={style.container}>
                <View style={{marginBottom:24}}>
                    <View style={style.header}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                            <Feather name="arrow-left" size={RFValue(25,580)} color="white"></Feather>
                        </TouchableOpacity>
                        <Text style={style.headertitle}>Change Password</Text>
                        <View style={{width:RFValue(25,580)}}></View>
                    </View>
                    <TouchableOpacity style={style.btncontainer}>
                        <IonIcons name="lock-open-outline" color="white" size={RFValue(69,580)}></IonIcons>
                    </TouchableOpacity>
                    <View style={{marginTop:24,marginBottom:48,padding:10}}>
                        <View style={style.inputcontainer}>
                            <TextInput style={style.input} placeholder="Current Password" placeholderTextColor="white" secureTextEntry={true} value={info.cur} onChangeText={value=>setinfo({...info,cur:value})}></TextInput>
                        </View>
                        <View style={style.inputcontainer}>
                            <TextInput style={style.input} placeholder="New Password" placeholderTextColor="white" secureTextEntry={true} value={info.new} onChangeText={value=>setinfo({...info,new:value})}></TextInput>
                        </View>
                        <View style={style.inputcontainer}>
                            <TextInput style={style.input} placeholder="Confirm Password" placeholderTextColor="white" secureTextEntry={true} value={info.re} onChangeText={value=>setinfo({...info,re:value})}></TextInput>
                        </View>
                        <TouchableOpacity style={style.save_btn} onPress={save}>
                            <View style={{width:RFValue(29,580)}}></View>
                            <Text style={style.btntext}>Save</Text>
                            <AntDesign color="white" name="check" size={RFValue(29,580)}></AntDesign>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <AlertComponent error={error} seterror={seterror}></AlertComponent>
        </KeyboardAvoidingView>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        padding:24,
        backgroundColor:'#101010'
    },
    logo:{
        width:wp('25%'),
        height:wp('30%'),
        alignSelf:'center',
        marginTop:hp('4%')
    },
    header:{
        display:'flex',
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center'
    },
    headertitle:{
        fontSize:RFValue(18,580),
        fontFamily:'Quicksand-Medium',
        color:'white'
    },
    inputcontainer:{
        backgroundColor:'#252525',
        shadowColor:'black',
        shadowOpacity:0.16,
        shadowRadius:5,
        shadowOffset:{
            height:3,
            width:0
        },
        borderRadius:34,
        paddingLeft:24,
        paddingRight:24,
        marginBottom:16,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    input:{
        flex:1,
        color:'white',
        fontSize:RFValue(12,580),
        fontFamily:'Quicksand-Medium'
    },  
    btncontainer:{
        marginTop:30,
        width:wp('39'),
        height:wp('39'),
        borderRadius:wp('20'),
        backgroundColor:'#F6AA11',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    },
    title:{
        fontSize:RFValue(12,580),
        color:'black',
        fontFamily:'Quicksand-Medium'
    },
    save_btn:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:24,
        paddingRight:24,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#F6AA11',
        borderRadius:35,
        marginTop:30
    },
    btntext:{
        color:'white',
        fontFamily:'Montserrat-Medium',
        fontSize:RFValue(18,580)
    }
})