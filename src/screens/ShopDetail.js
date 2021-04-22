import React,{useRef,useState} from 'react'
import {View,StyleSheet,ImageBackground,TouchableOpacity,Text,Image,ScrollView,FlatList,TextInput} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ScalingDrawer from 'react-native-scaling-drawer'
import {RFValue} from 'react-native-responsive-fontsize'
import Sidebar from '../component/Sidebar'
import AntDesign from 'react-native-vector-icons/AntDesign'
import config from '../config/config.json'
import {addtocart,getcart,updatecart} from '../service/productservice'
import {setcart} from '../redux/action/cart'
import {useSelector,useDispatch} from 'react-redux'
import Loading from 'react-native-loading-spinner-overlay'

export default function ShopDetail({navigation,route})
{
    const dispatch = useDispatch()
    const [loading,setloading] = useState(false)
    const {token} = useSelector(state=>state.auth)
    const cart = useSelector(state=>state.cart)
    let drawer = useRef(null)
    const [quantity,setquantity] = useState(1)
    
    const buyproduct = () => {
        let products = [{id:route.params.product.id,quantity:quantity,amount:route.params.product.price * quantity}]
        navigation.navigate('Payment',{products,total:route.params.product.price * quantity})
    }

    const addcart = () => {
        setloading(true)
        let cartinfo = null
        for(let item in cart)
        {
            if(cart[item].product.id == route.params.product.id)
            {
                cartinfo = {id:cart[item].id,product_id:cart[item].product_id,quantity:Number(cart[item].quantity) + quantity}
                break;
            }
        }

        if(cartinfo)
        {
            updatecart(cartinfo,cartinfo.id,token).then(res=>{
                if(res.data.success)
                {
                    dispatch(setcart(res.data.carts))
                    setloading(false)
                    navigation.navigate('Cart')
                }
                setloading(false)
            }).catch(err=>{console.log(err); setloading(false)})
        }
        else
        {
            cartinfo = {product_id:route.params.product.id,quantity:quantity}
            addtocart(cartinfo,token).then(res=>{
                console.log(res.data)
                if(res.data.success)
                {
                    getcart(token).then(response=>{
                        if(response.data.success)
                        {
                            dispatch(setcart(response.data.carts))
                            setloading(false)
                            navigation.navigate('Cart')

                        }
                    }).catch(err=>setloading(false))
                }
                else
                {
                    setloading(false)
                }
            }).catch(err=>{console.log(err.response.data); setloading(false)})
        }
    }

    return (
        <ScalingDrawer
            tapToClose={true}
            minimizeFactor={0.7}
            swipeOffset={10}
            scalingFactor={1}
            content={<Sidebar navigation={navigation}></Sidebar>}
            ref={ref =>drawer = ref}
        >
            <View style={style.container}>
                <View style={style.header}>
                    <TouchableOpacity onPress={()=>drawer.open()}>
                        <Image source={require('../assets/images/darkmode/menu.png')}></Image>
                    </TouchableOpacity>
                    <Text style={style.title}>{route.params.product.title}</Text>
                    <TouchableOpacity style={style.righticon} onPress={()=>navigation.navigate('Cart')}>
                        <Image source={require('../assets/images/cart.png')}></Image>
                        {
                            cart.length > 0 && (
                                <Text style={style.badgeicon}>{cart.length}</Text>
                            )
                        }
                    </TouchableOpacity>
                </View>
                <ScrollView style={style.content} showsVerticalScrollIndicator={false}>
                    <Image source={{uri:config.apiurl + "/" + route.params.product.image}} style={style.image}></Image>
                    <View style={{flexDirection:'row',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <View>
                            <Text style={style.producttitle}>{route.params.product.title}</Text>
                            <Text style={style.productinfo}>{route.params.product.creater.fullname}</Text>
                        </View>
                        <TouchableOpacity style={style.pricecontainer}>
                            <Text style={style.price}>${route.params.product.price}</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={style.description}>{route.params.product.description}</Text>
                    <Text style={[style.producttitle,{fontSize:RFValue(15,580),marginTop:10}]}>Quantity</Text>
                    <View style={[style.quantitycontainer,{marginBottom:30}]}>
                        <TouchableOpacity onPress={()=>setquantity(Math.max(quantity - 1,1))}>
                            <AntDesign color="#F6AA11" name="minus" size={RFValue(15,580)}></AntDesign>
                        </TouchableOpacity>
                        <Text style={style.input}>{quantity}</Text>
                        <TouchableOpacity onPress={()=>setquantity(quantity + 1)}>
                            <AntDesign color="#F6AA11" name="plus" size={RFValue(15,580)}></AntDesign>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:15}}>
                    <TouchableOpacity style={[style.btn,{backgroundColor:'#F6AA11'}]} onPress={addcart}>
                        <Text style={style.btntext}>Add to cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.btn,{borderColor:'#F6AA11',borderWidth:1,marginRight:0}]} onPress={buyproduct}>
                        <Text style={[style.btntext,{color:'#F6AA11'}]}>Buy it now</Text>
                    </TouchableOpacity>
                </View>
                <Loading visible={loading}></Loading>
            </View>
       </ScalingDrawer> 
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#101010',
        padding:24
    },
    header:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    righticon:{
        width:wp('9%'),
        height:wp('9%'),
        borderRadius:wp('5%'),
        backgroundColor:'#F6AA11',
        justifyContent:'center',
        alignItems:'center'
    },
    badgeicon:{
        width:15,
        height:15,
        fontSize:9,
        borderRadius:8,
        backgroundColor:'black',
        color:'white',
        position:'absolute',
        justifyContent:'center',
        alignItems:'center',
        textAlign:'center',
        top:0,
        right:0
    },
    headertitle:{
        fontSize:RFValue(22,580)
    },
    title:{
        fontSize:RFValue(18,580),
        color:'#D5D5D5',
        fontFamily:'Quicksand-Medium'
    },
    content:{
        flex:1,
        marginTop:15,
        marginBottom:15
    },
    image:{
        width:wp('100') - 48,
        height:wp('64') - 30.7,
        borderRadius:14
    },
    producttitle:{
        fontSize:RFValue(26,580),
        color:'#D5D5D5',
        fontFamily:'Quicksand-Medium'
    },
    productinfo:{
        fontSize:RFValue(17,580),
        color:'#D5D5D5',
        fontFamily:'Quicksand-Medium'
    },
    pricecontainer:{
        paddingLeft:22,
        paddingRight:22,
        paddingTop:5,
        paddingBottom:5,
        borderRadius:20,
        backgroundColor:'#F6AA11'
    },
    price:{
        fontSize:RFValue(19,580),
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    description:{
        fontSize:RFValue(12,580),
        color:'white',
        fontFamily:'Quicksand-Medium',
        marginTop:10
    },
    quantitycontainer:{
        padding:5,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        width:wp('36'),
        borderRadius:28,
        backgroundColor:'#252525',
        marginTop:15,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        shadowColor:'black',
        shadowOpacity:0.16,
        shadowOffset:{
            height:3,
            width:0
        },
        shadowRadius:5
    },
    input:{
        fontSize:RFValue(15,580),
        borderWidth:0,
        textAlign:'center',
        color:'white'
    },
    btn:{
        marginRight:15,
        flex:1,
        paddingTop:15,
        paddingBottom:15,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:32
    },
    btntext:{
        color:'white',
        fontSize:RFValue(16,580),
        fontFamily:'Montserrat-Medium'
    }
})