import React,{useRef,useEffect,useState} from 'react'
import {View,StyleSheet,ImageBackground,TouchableOpacity,Text,Image,ScrollView,FlatList,TextInput} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ScalingDrawer from 'react-native-scaling-drawer'
import {RFValue} from 'react-native-responsive-fontsize'
import Sidebar from '../component/Sidebar'
import AntDesign from 'react-native-vector-icons/AntDesign'
import ShopItemDetail from '../component/ShopItemDetail';
import {useSelector} from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import {getproducts} from '../service/productservice'

export default function Shops({navigation})
{
    const {userinfo,token} = useSelector(state=>state.auth)
    const products = useSelector(state=>state.product)
    const carts = useSelector(state=>state.cart)
    let drawer = useRef(null)


    

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
                    <Text style={style.title}>Shops for Tienda</Text>
                    {
                        userinfo.role == 'influencer'?(
                            <TouchableOpacity onPress={()=>navigation.navigate('Chat')}>
                                <Image source={require('../assets/images/chat.png')}></Image>
                            </TouchableOpacity>
                        ):(
                            <TouchableOpacity style={style.righticon} onPress={()=>navigation.navigate('Cart')}>
                                <Image source={require('../assets/images/cart.png')}></Image>
                                {
                                    carts.length > 0 && (
                                        <Text style={style.badgeicon}>{carts.length}</Text>
                                    )
                                }
                            </TouchableOpacity>
                        )
                    }
                    
                </View>
                <View style={style.inputcontainer}>
                    <TextInput style={{flex:1}} placeholder="Search" placeholderTextColor='white'></TextInput>
                    <AntDesign name="search1" color="white" size={RFValue(17,580)}></AntDesign>
                </View>
                <ScrollView style={{marginTop:15,flex:1}} showsVerticalScrollIndicator={false}>
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap'}}>
                        {
                            products.map((item,index)=>(
                                <ShopItemDetail {...item} key={index} navigation={navigation} ></ShopItemDetail>
                            ))
                        }
                    </View>
                </ScrollView>
                {
                    userinfo.role == 'influencer' && (
                        <TouchableOpacity style={style.addbtn} onPress={()=>navigation.navigate('AddProduct')}>
                            <Feather name="plus" color="white" size={RFValue(31,580)}></Feather>
                        </TouchableOpacity>
                    )
                }
                
            </View>
       </ScalingDrawer> 
    )
}



const style = StyleSheet.create({
    container:{
        flex:1,
        padding:24,
        backgroundColor:'#101010'
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
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    inputcontainer:{
        display:'flex',
        flexDirection:'row',
        paddingLeft:25,
        paddingRight:25,
        backgroundColor:'#252525',
        borderRadius:28,
        marginTop:20,
        alignItems:'center',
        shadowColor:'black',
        shadowOpacity:0.16,
        shadowOffset:{
            height:3,
            width:0
        },
        shadowRadius:5
    },
    addbtn:{
        width:wp('17.87'),
        height:wp('17.87'),
        backgroundColor:'#F6AA11',
        borderRadius:wp('8.9'),
        justifyContent:'center',
        alignItems:'center',
        marginTop:25,
        alignSelf:'center',
        position:'absolute',
        bottom:48
    }
})