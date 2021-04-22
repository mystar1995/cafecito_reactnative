import React,{useEffect,useState} from 'react';
import {View,StyleSheet,ScrollView,TouchableOpacity,Text,TextInput} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IonIcons from 'react-native-vector-icons/Ionicons'
import HistoryItem from '../component/HistoryItem'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {getpaymenthistory} from '../service/productservice'
import Loading from 'react-native-loading-spinner-overlay'
import {useSelector} from 'react-redux'
import moment from 'moment'
export default function PaymentHistory({navigation})
{

    const [loading,setloading] = useState(false)
    const [history,sethistory] = useState([])
    const {token} = useSelector(state=>state.auth)
    useEffect(()=>{ 
        setloading(true)
        getpaymenthistory(token).then(res=>{
            if(res.data.success)
            {
                sethistory(res.data.history)
            }
            setloading(false)
        }).catch(err=>setloading(false))
    },[])

    const gethistory = () => {
        let data = {}

        for(let item in history)
        {
            var date = moment(new Date(history[item].created_at)).format('MMM Do, yyyy')
            if(!data[date])
            {
                data[date] = []
            }

            data[date].push(history[item])
        }

        return data
    }

    let data = gethistory()
    return (
            <View style={style.container}>
                <View style={{marginBottom:24,flex:1}}>
                    <View style={style.header}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                            <Feather name="arrow-left" size={RFValue(25,580)} color="white"></Feather>
                        </TouchableOpacity>
                        <Text style={style.headertitle}>Payment History</Text>
                        <View style={{width:RFValue(25,580)}}></View>
                    </View>
                    <View style={style.inputcontainer}>
                        <TextInput style={style.input} placeholder="Search" placeholderTextColor="white"></TextInput>
                        <TouchableOpacity>
                            <AntDesign name="search1" color="white" size={RFValue(17,580)}></AntDesign>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false}>
                        <View style={{flex:1}}>
                            {
                                Object.keys(data).map((item,index)=>(
                                    <>
                                        <Text key={index} style={[style.title,{marginTop:15,marginBottom:5}]}>{item}</Text>
                                        {
                                            data[item].map((info,infoindex)=>(
                                                <HistoryItem history={info} key={infoindex}></HistoryItem>
                                            ))
                                        }
                                    </>
                                ))
                            }
                        </View>
                    </ScrollView>
                    <Loading visible={loading}></Loading>
                </View>
            </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        width:wp('100%'),
        height:hp('100%'),
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
        alignItems:'center',
        marginBottom:24
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
        borderRadius:28,
        paddingLeft:24,
        paddingRight:24,
        marginBottom:16,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        marginTop:8
    },
    input:{
        flex:1,
        color:'black',
        fontSize:RFValue(12,580),
        fontFamily:'Quicksand-Medium'
    },  
    btncontainer:{
        marginTop:30,
        width:wp('39'),
        height:wp('39'),
        borderRadius:wp('20'),
        backgroundColor:'#FFF5F7',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    },
    title:{
        fontSize:RFValue(12,580),
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    save_btn:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:18,
        backgroundColor:'#F6AA11',
        borderRadius:5
    },
    btntext:{
        color:'white',
        fontFamily:'Montserrat-Medium',
        fontSize:RFValue(18,580)
    }
})