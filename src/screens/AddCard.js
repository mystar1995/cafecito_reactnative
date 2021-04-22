import React,{useState,useEffect} from 'react';
import {View,ScrollView,StyleSheet,KeyboardAvoidingView,Platform,TouchableOpacity,Text} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen' 
import {CardIOModule,CardIOUtilities} from 'react-native-awesome-card-io'
import { TextInput } from 'react-native-gesture-handler';
import {useSelector,useDispatch} from 'react-redux'
import AlertComponent from '../component/AlertComponent'
import validator from 'card-validator'
import {addcard,getcard} from '../service/userservice'
import {setcardinfo} from '../redux/action/auth'
export default function AddCard({navigation})
{
    const {userinfo,token} = useSelector(state=>state.auth)
    const [cardinfo,setcardinfo] = useState({})
    const [address,setaddress] = useState({
        address:userinfo.address,
        city:userinfo.city,
        state:userinfo.state,
        country:userinfo.country,
        post_code:userinfo.post_code,
        apartment:userinfo.apartment    
    })
    const [error,seterror] = useState("")
    const [back,setback] = useState(false);
    const dispatch = useDispatch()

    useEffect(()=>{
        if(Platform.OS == "ios")
        {
            CardIOUtilities.preload()
        }
    })

    const scancard = () => {
        CardIOModule.scanCard().then(card=>{
            setcardinfo({
                card_name:card.cardholderName,
                card_number:card.cardNumber,
                card_expiry:card.expiryMonth + "/" + card.expiryYear,
                card_cvv:card.cvv
            })
        }).catch(err=>{
            console.log(err)
        })
    }

    const save = () => {
        let validnumber = validator.number(cardinfo.card_number)
        if(!validnumber.isValid)
        {
            seterror("Card Number has to be valid")
            return
        }

        let validexpiry = validator.expirationDate(cardinfo.card_expiry)

        if(!validexpiry.isValid)
        {
            seterror('Expiration Date has to be valid')
            return
        }

        addcard({
            card_name:cardinfo.card_name,
            card_number:cardinfo.card_number,
            card_expiry:cardinfo.card_expiry,
            card_cvv:cardinfo.card_cvv,
            card_type:validnumber.card.type,
            ...address           
        },token).then(res=>{
            console.log(res.data)
            if(res.data.success)
            {
                seterror('You have successfully added new card')
                setback(true);
                getcard(token).then(res=>{
                    if(res.data.success)
                    {
                        dispatch(setcardinfo(res.data.paymentmethod))
                    }
                })
            }
        }).catch(err=>console.log(err))
    }

    return (    
        <KeyboardAvoidingView style={{flex:1}} behavior="height">
            <View style={style.container}>
                <View style={style.header}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <Feather name="arrow-left" size={RFValue(25,580)} color="white"></Feather>
                    </TouchableOpacity>
                    <Text style={style.headertitle}>Add New Card</Text>
                    <View style={{width:RFValue(25,580)}}></View>
                </View>
                <ScrollView>
                    <View>
                        <View style={{padding:24}}>
                            <TouchableOpacity style={style.scancard} onPress={scancard}>
                                <Feather name="credit-card" size={RFValue(25,580)} color="#C9C9C9"></Feather>
                                <Text style={[style.title,{marginLeft:15}]}>Scan Your Card</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={style.paymentinfo}>
                            <Text style={style.paymentinfotitle}>Payment Info</Text>
                            <TextInput style={[style.input,{marginTop:15}]} placeholder="Name" placeholderTextColor="white" value={cardinfo.card_name} onChangeText={value=>setcardinfo({...cardinfo,card_name:value})}></TextInput>
                            <TextInput style={[style.input,{marginTop:15}]} placeholder="Credit Card Number" placeholderTextColor="white" value={cardinfo.card_number} onChangeText={value=>setcardinfo({...cardinfo,card_number:value})}></TextInput>
                            <View style={{display:'flex',flexDirection:'row',marginTop:15}}>
                                <TextInput style={[style.input,{marginRight:15,flex:1}]} placeholder="MM/YY" placeholderTextColor="white" value={cardinfo.card_expiry} onChangeText={value=>setcardinfo({...cardinfo,card_expiry:value})}></TextInput>
                                <TextInput style={[style.input,{flex:1}]} placeholder="Security Code" placeholderTextColor="white" value={cardinfo.card_cvv} onChangeText={value=>setcardinfo({...cardinfo,card_cvv:value})}></TextInput>
                            </View>
                        </View>
                        <View style={style.paymentinfo}>
                            <Text style={style.paymentinfotitle}>Billing Address</Text>
                            <TextInput style={[style.input,{marginTop:15}]} placeholder="Address" placeholderTextColor="white" value={address.address} onChangeText={value=>setaddress({...address,address:value})}></TextInput>
                            <TextInput style={[style.input,{marginTop:15}]} placeholder="Apartment, Suite ,etc (Optional)" placeholderTextColor="white" value={address.apartment} onChangeText={value=>setaddress({...address,apartment:value})}></TextInput>
                            <View style={{display:'flex',flexDirection:'row',marginTop:15}}>
                                <TextInput style={[style.input,{marginRight:15,flex:1}]} placeholder="City" placeholderTextColor="white" value={address.city} onChangeText={value=>setaddress({...address,city:value})}></TextInput>
                                <TextInput style={[style.input,{flex:1}]} placeholder="State" placeholderTextColor="white" value={address.state} onChangeText={value=>setaddress({...address,state:value})}></TextInput>
                            </View>
                            <View style={{display:'flex',flexDirection:'row',marginTop:15}}>
                                <TextInput style={[style.input,{marginRight:15,flex:1}]} placeholder="Country" placeholderTextColor="white" value={address.country} onChangeText={value=>setaddress({...address,country:value})}></TextInput>
                                <TextInput style={[style.input,{flex:1}]} placeholder="Zip Code" placeholderTextColor="white" value={address.post_code} onChangeText={value=>setaddress({...address,post_code:value})}></TextInput>
                            </View>
                            <TouchableOpacity style={[style.save_btn,{marginTop:15}]}  onPress={save}>
                                <View style={{width:RFValue(29,580)}}></View>
                                <Text style={style.btntext}>Save</Text>
                                <AntDesign color="white" name="check" size={RFValue(29,580)}></AntDesign>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <AlertComponent error={error} seterror={(value)=>{seterror(value); if(back){navigation.goBack()}}}></AlertComponent>
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
        padding:24
    },
    headertitle:{
        fontSize:RFValue(18,580),
        fontFamily:'Quicksand-Medium',
        color:'white'
    },
    title:{
        fontSize:RFValue(12,580),
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    content:{
        color:'#8E8E8E',
        fontFamily:'Quicksand-Medium',
        fontSize:RFValue(12,580),
        alignItems:'center'
    },
    save_btn:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:24,
        paddingRight:24,
        paddingBottom:15,
        paddingTop:15,
        backgroundColor:'#F6AA11',
        borderRadius:35
    },
    btntext:{
        color:'white',
        fontFamily:'Montserrat-Medium',
        fontSize:RFValue(18,580)
    },
    scancard:{
        borderRadius:12,
        padding:20,
        paddingLeft:27,
        paddingRight:27,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        borderWidth:1,
        borderColor:'#252525',
        marginLeft:20,
        marginRight:20
    },
    paymentinfo:{
        padding:24,
        paddingLeft:44,
        paddingRight:44,
        paddingBottom:23
    },
    paymentinfotitle:{
        fontSize:RFValue(15,580),
        color:'white',
        fontFamily:'Quicksand-Bold'
    },
    input:{
        backgroundColor:'#252525',
        borderRadius:31,
        color:'white',
        fontSize:RFValue(12,580),
        fontFamily:'Quicksand-Medium',
        paddingLeft:18,
        paddingRight:15
    }
})