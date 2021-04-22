import React,{useState} from 'react'
import {View,StyleSheet,Image,Text} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import config from '../config/config.json'
let timer = false;
export default function CartItem({cart,change,deletecart})
{
    const [quantity,setquantity] = useState(cart.quantity)
    const changequantity = (quantity) => {
        if(quantity < 1)
        {
            return;
        }
        if(timer)
        {
            window.clearTimeout(timer)
        }
        setquantity(quantity)

        timer = window.setTimeout(()=>{
            change(quantity)
        },500)
    }

    return (
        <View style={style.container}>
            <View style={style.sectionitem}>
                <Image source={{uri:config.apiurl + "/" + cart.product.image}} style={style.image}></Image>
                <View style={{marginLeft:13}}>
                    <Text style={style.name}>{cart.product.title}</Text>
                    <Text style={style.description}>{cart.product.createrinfo.fullname}</Text>
                </View>
            </View>
            <View style={style.sectionitem}>
                <Text style={style.price}>${cart.product.price}</Text>
                <View style={style.count}>
                    <TouchableOpacity onPress={()=>changequantity(quantity - 1)}>
                        <AntDesign name="minus" color="#F6AA11" size={RFValue(15,580)}></AntDesign>
                    </TouchableOpacity>
                    <Text style={style.counttext}>{quantity}</Text>
                    <TouchableOpacity onPress={()=>changequantity(quantity + 1)}>
                        <AntDesign name="plus" color="#F6AA11" size={RFValue(15,580)}></AntDesign>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={style.remove} onPress={()=>deletecart()}>
                    <MaterialCommunityIcons name="delete-forever" color="#F6AA11" size={RFValue(17,580)}></MaterialCommunityIcons>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:15
    },
    sectionitem:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    image:{
        width:wp('16.9'),
        height:wp('16.9'),
        borderRadius:10
    },
    name:{
        fontSize:RFValue(13,580),
        color:'white',
        fontFamily:"Quicksand-Medium"
    },
    description:{
        fontSize:RFValue(9,580),
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    price:{
        paddingLeft:10,
        paddingRight:10,
        paddingTop:3,
        paddingBottom:3,
        backgroundColor:'#F6AA11',
        borderRadius:15,
        color:'white',
        fontSize:RFValue(10,580),
        fontFamily:'Quicksand-Medium'
    },
    count:{
        padding:5,
        backgroundColor:'#252525',
        borderRadius:28,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginLeft:9,
        marginRight:9,
        elevation:2
    },
    counttext:{
        fontSize:RFValue(15,580),
        color:'white',
        fontFamily:'Quicksand-Medium',
        marginLeft:7,
        marginRight:7
    },
    remove:{
        width:wp('7.49'),
        height:wp('7.49'),
        borderRadius:wp('3.8'),
        borderWidth:1,
        borderColor:'#F6AA11',
        justifyContent:'center',
        alignItems:'center'
    }
})