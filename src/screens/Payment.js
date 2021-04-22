import React,{useState} from 'react';
import {View,ScrollView,StyleSheet,KeyboardAvoidingView,TouchableOpacity,Text,Image} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { TextInput } from 'react-native-gesture-handler';
import {useSelector,useDispatch} from 'react-redux'
import Strip from 'tipsi-stripe'
import config from '../config/config.json'
import AlertElement from '../component/AlertComponent'
import {createpayment,clearcart} from '../service/productservice'
import Loading from 'react-native-loading-spinner-overlay'
import {setcart} from '../redux/action/cart'
import Modal from 'react-native-modal'
import {submitfeedback} from '../service/userservice'
export default function Payment({navigation,route})
{
    const [paid,setpaid] = useState(false)
    const [card,selectcard] = useState(null)
    const [checked,setchecked] = useState(false)
    const [error,seterror] = useState("")
    const {cards,token,userinfo} = useSelector(state=>state.auth)
    const [loading,setloading] = useState(false)
    const [visible,setvisible] = useState(false)
    const [reviewinfo,setreviewinfo] = useState({
        reviews:0,
        description:""
    })

    const dispatch = useDispatch()
    const [shippinginfo,setshippinginfo] = useState({
        address:userinfo.address,
        mobilenumber:"",
        email:userinfo.email,
        apartment:userinfo.apartment,
        city:userinfo.city,
        state:userinfo.state,
        country:userinfo.country,
        post_code:userinfo.post_code,
        state:userinfo.state
    })
    const nextstep = () => {
        setvisible(true)
    }

    const renderreviewbtn = () => {
        var list = []

        for(let index = 0;index<reviewinfo.reviews;index++)
        {
            list.push(
                <TouchableOpacity style={{marginRight:10}} onPress={()=>setreviewinfo({...reviewinfo,reviews:index + 1})}>
                    <AntDesign name="star" color="#E9C448" size={RFValue(22,580)}></AntDesign>
                </TouchableOpacity>
            )
        }

        for(let index = reviewinfo.reviews;index<5;index++)
        {
            list.push(
                <TouchableOpacity style={{marginRight:10}} onPress={()=>setreviewinfo({...reviewinfo,reviews:index + 1})}>
                    <AntDesign name="staro" color="#E9C448" size={RFValue(22,580)}></AntDesign>
                </TouchableOpacity>
            )
        }

        return list;
    }

    const payment = () => {
        if(card)
        {
            try{
                setloading(true)
                Strip.setOptions({publishableKey:config.public_key})
            
                Strip.createTokenWithCard({
                    number:card.card_number,
                    cvc:card.card_cvc,
                    expMonth:parseInt(card.card_expiry.split('/')[0]),
                    expYear:parseInt(card.card_expiry.split('/')[1]),
                    name:card.card_name
                }).then(tokeninfo=>{
                    console.log(tokeninfo)
                    let info = {
                        subtotal:route.params.total,
                        fee:route.params.total * 0.1,
                        cardtoken:tokeninfo.tokenId,
                        paymentmethod:card.id,
                        shippinginfo:shippinginfo
                    }

                    if(route.params.request)
                    {
                        info.request = route.params.request;
                    }
                    else if(route.params.products)
                    {
                        info.products = route.params.products;
                    }
                    else if(route.params.podcast)
                    {
                        info.podcasts = [route.params.podcast]
                    }

                    createpayment(info,token).then(res=>{
                        setloading(false)
                        seterror(res.data.message)
                        if(res.data.success && route.params.cart)
                        {
                            clearcart(token).then(res=>{
                                if(res.data.success)
                                {
                                    dispatch(setcart([]))
                                }
                            })
                        }
                        setpaid(res.data.success)
                    }).catch(err=>{setloading(false);console.log(err.response.data);})
                }).catch(err=>{seterror(err.message); setloading(false)})
            }
            catch(e)
            {
                setloading(false)
                console.log(e)
            }
            
        }
        else
        {
            seterror('You have to select payment method')
        }
    }

    const submit = () => {
        if(!reviewinfo.reviews)
        {
            seterror('You have to add review point')
            return;
        }
        setloading(true)

        submitfeedback(reviewinfo,token).then(res=>{
            setloading(false)
            if(res.data.success)
            {
                navigate()
            }
        }).catch(err=>{setloading(false);console.log(err)})
    }

    const navigate = () => {
        if(route.params.podcast)
        {
            navigation.navigate('PodcastDetail',{id:route.params.podcast.id})
        }
    }

    return (
        <KeyboardAvoidingView style={{flex:1}} behavior="height">
            <View style={style.container}>
                <View style={style.header}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <Feather name="arrow-left" size={RFValue(25,580)} color="white"></Feather>
                    </TouchableOpacity>
                    <Text style={style.headertitle}>Payment</Text>
                    <View style={{width:RFValue(25,580)}}></View>
                </View>
                <ScrollView>
                    <View>
                        <View style={{padding:24}}>
                            <TouchableOpacity style={style.scancard}>
                                <Text style={style.paymentinfotitle}>Summary</Text>
                                <View style={{display:'flex',flexDirection:'row',marginTop:13}}>
                                    <Text style={[style.content,{flex:1}]}>Subtotal</Text>
                                    <Text style={[style.title,{flex:1}]}>${route.params.total}</Text>
                                </View>
                                <View style={{display:'flex',flexDirection:'row',marginTop:13}}>
                                    <Text style={[style.content,{flex:1}]}>Service Fee</Text>
                                    <Text style={[style.title,{flex:1}]}>${route.params.total / 10}</Text>
                                </View>
                                <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:13}}>
                                    <TouchableOpacity style={style.checkbox} onPress={()=>setchecked(!checked)}>
                                        {
                                            checked && (
                                                <Feather name="check" size={RFValue(25,580)} color="#F6AA11"></Feather>
                                            )
                                        }
                                    </TouchableOpacity>
                                    <Text style={[style.content,{marginLeft:15}]}>Add Promo Code</Text>
                                </View>
                                <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:13}}>
                                    <Text style={style.paymentinfotitle}>Total ${Math.floor(route.params.total * 1.1)}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            !paid && (
                                <View style={style.paymentinfo}>
                                    <Text style={[style.paymentinfotitle,{color:'white'}]}>Shipping Information</Text>
                                    <TextInput style={[style.input,{marginTop:15}]} placeholder="Mobile Number" placeholderTextColor="white" value={shippinginfo.mobilenumber} onChangeText={value=>setshippinginfo({...shippinginfo,mobilenumber:value})} keyboardType="phone-pad"></TextInput>
                                    <TextInput style={[style.input,{marginTop:15}]} placeholder="Email Address" placeholderTextColor="white" value={shippinginfo.email} onChangeText={value=>setshippinginfo({...shippinginfo,email:value})} keyboardType="email-address"></TextInput>
                                    <TextInput style={[style.input,{marginTop:15}]} placeholder="Full Address" placeholderTextColor="white" value={shippinginfo.address} onChangeText={value=>setshippinginfo({...shippinginfo,address:value})}></TextInput>
                                    <TextInput style={[style.input,{marginTop:15}]} placeholder="Apartment. suite,etc" placeholderTextColor="white" value={shippinginfo.apartment} onChangeText={value=>setshippinginfo({...shippinginfo,apartment:value})}></TextInput>
                                    <View style={{display:'flex',flexDirection:'row',marginTop:15}}>
                                        <TextInput style={[style.input,{marginRight:15,flex:1}]} placeholder="City" value={shippinginfo.city} placeholderTextColor="white" onChangeText={value=>setshippinginfo({...shippinginfo,city:value})}></TextInput>
                                        <TextInput style={[style.input,{flex:1}]} placeholder="Province/State" value={shippinginfo.state} placeholderTextColor="white" onChangeText={value=>setshippinginfo({...shippinginfo,state:value})}></TextInput>
                                    </View>
                                    <View style={{display:'flex',flexDirection:'row',marginTop:15}}>
                                        <TextInput style={[style.input,{marginRight:15,flex:1}]} placeholder="Country" value={shippinginfo.country} placeholderTextColor="white" onChangeText={value=>setshippinginfo({...shippinginfo,country:value})}></TextInput>
                                        <TextInput style={[style.input,{flex:1}]} placeholder="Postal Code" value={shippinginfo.post_code} placeholderTextColor="white" onChangeText={value=>setshippinginfo({...shippinginfo,post_code:value})}></TextInput>
                                    </View>
                                </View>
                            )
                        }
                        <View style={style.paymentinfo}>
                            <Text style={[style.paymentinfotitle,{color:'white',marginBottom:15}]}>Payment Method</Text>
                            {
                                cards.map((item,index)=>(
                                    <View style={style.inputcontainer} key={index}>
                                        <Image source={item.card_type == 'visa'?require('../assets/images/darkmode/visa.png'):require('../assets/images/darkmode/mastercard.png')}></Image>
                                        <View style={{marginLeft:20}}>
                                            <Text style={style.title}>{item.card_name}</Text>
                                            <Text style={style.content}>{item.card_number}</Text>
                                        </View>
                                        <TouchableOpacity style={[style.checkbox,{marginLeft:'auto'}]} onPress={()=>selectcard(item)}>
                                            {
                                                (card && card.id == item.id) && (
                                                    <AntDesign name="check" color="#F6AA11" size={RFValue(25,580)}></AntDesign>
                                                )
                                            }
                                        </TouchableOpacity>
                                    </View>
                                ))
                            }
                            
                            {/* <View style={style.inputcontainer}>
                                <Image source={require('../assets/images/darkmode/mastercard.png')}></Image>
                                <View style={{marginLeft:20}}>
                                    <Text style={style.title}>Card Name</Text>
                                    <Text style={style.content}>3256 5654 6854 2156</Text>
                                </View>
                                <TouchableOpacity style={[style.checkbox,{marginLeft:'auto'}]} onPress={()=>selectcard('mastercard')}>
                                    {
                                        card == 'mastercard' && (
                                            <AntDesign name="check" color="#F6AA11" size={RFValue(25,580)}></AntDesign>
                                        )
                                    }
                                </TouchableOpacity>
                            </View> */}
                            <TouchableOpacity style={[style.save_btn,{marginTop:15}]} onPress={paid?nextstep:payment}>
                                <View style={{width:RFValue(29,580)}}></View>
                                <Text style={style.btntext}>{paid?'Leave Feedback':'Pay Now'}</Text>
                                <AntDesign color="white" name="arrowright" size={RFValue(29,580)}></AntDesign>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <AlertElement error={error} seterror={seterror}></AlertElement>
                <Loading visible={loading}></Loading>
                <Modal visible={visible} onBackdropPress={()=>setvisible(false)}>
                    <View style={style.modalinside}>
                        <Text style={style.modaltitle}>Review</Text>
                        <View style={style.modalcontainer}>
                            {renderreviewbtn(reviewinfo.reviews)}
                        </View>
                        <View style={{marginTop:10}}>
                            <TextInput style={{borderRadius:10,borderColor:'#101010',borderWidth:1,height:200,textAlignVertical:'top',padding:10}} numberOfLines={10} placeholder="Description" onChangeText={text=>setreviewinfo({...reviewinfo,description:text})} value={reviewinfo.description}></TextInput>
                        </View>
                        <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                            <TouchableOpacity style={style.btncontainer} onPress={submit}>
                                <Text style={style.btntext}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[style.btncontainer,{backgroundColor:'#101010'}]} onPress={()=>{setvisible(false);navigate()}}>
                                <Text style={style.btntext}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </Modal>
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
        color:'white',
        fontFamily:'Quicksand-Medium',
        fontSize:RFValue(12,580)
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
        borderRadius:35
    },
    btntext:{
        color:'white',
        fontFamily:'Montserrat-Medium',
        fontSize:RFValue(18,580)
    },
    scancard:{
        backgroundColor:'#252525',
        borderRadius:12,
        padding:25,
        paddingLeft:27,
        paddingRight:27,
        borderWidth:1,
        borderColor:'#E1E1E1',
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
        color:'#F6AA11',
        fontFamily:'Quicksand-Bold'
    },
    input:{
        backgroundColor:'#252525',
        borderRadius:31,
        color:'white',
        fontSize:RFValue(12,580),
        fontFamily:'Quicksand-Medium',
        padding:15
    },
    checkbox:{
        borderRadius:5,
        width:30,
        height:30,
        backgroundColor:'#101010',
        borderWidth:0,
        shadowColor:'black',
        shadowOpacity:0.16,
        shadowRadius:5,
        shadowOffset:{
            height:3,
            width:0
        },
        borderRadius:5,
        elevation:2
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
        elevation:2,
        padding:15,
        marginBottom:16,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    modalinside:{
        backgroundColor:'white',
        borderRadius:17,
        padding:15
    },
    modaltitle:{
        fontSize:RFValue(18,580),
        fontFamily:'Quicksand-Medium',
        textAlign:'center',
        marginTop:16
    },
    modalcontainer:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        marginTop:10,
        marginBottom:10
    },
    btncontainer:{
        display:'flex',
        justifyContent:'center',
        padding:15,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#F6AA11',
        borderRadius:35,
        flexDirection:'row',
        alignItems:'center',
        marginTop:10
    }
})