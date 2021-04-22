import React,{useState} from 'react';
import {ImageBackground,Text,StyleSheet, View,Image,TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useSelector,useDispatch} from 'react-redux'
import OctIcons from 'react-native-vector-icons/Octicons'
import config from '../config/config.json'
import Modal from 'react-native-modal'
import {deleteproduct} from '../service/productservice'
import {setproduct} from '../redux/action/product'
export default function ShopItemDetail({id,title,image,price,description,creater,navigation})
{
    const {userinfo,token} = useSelector(state=>state.auth)
    const [visible,setvisible] = useState(false)
    const dispatch = useDispatch()

    const directpage = () => {
        if(userinfo.role == 'influencer')
        {
            navigation.navigate('EditShop',{product:{id,title,image,price,description}})
        }
        else
        {
            navigation.navigate('ShopDetail',{product:{id,title,image,price,description,creater}})
        }
    }

    const removeproduct = () => {
        deleteproduct(id,token).then(res=>{
            console.log(res.data)
            if(res.data.success)
            {
                dispatch(setproduct(res.data.products))
                setvisible(false)
            }
        })
    }

    return (
        <TouchableOpacity style={{width:wp('40.5'),marginBottom:10}} onPress={directpage}>
            <ImageBackground source={{uri:config.apiurl + "/" + image}} style={{width:wp('40.5'),height:wp('40.5'),borderRadius:14,overflow:'hidden',position:'relative'}} resizeMode="cover">
                <View style={{flex:1}}></View>
                <View style={{marginBottom:5,width:wp('40.5')}}>
                    <TouchableOpacity style={style.camerabtn}>
                        <Text style={style.price}>$ {price}</Text>
                    </TouchableOpacity>
                </View>
                {
                    userinfo.role == "influencer" && (
                        <TouchableOpacity style={style.remove} onPress={()=>setvisible(true)}>
                            <OctIcons name="trashcan" color="white" size={RFValue(17,580)}></OctIcons>
                        </TouchableOpacity>
                    )
                }
            </ImageBackground>
            
            <Text style={style.title}>{title}</Text>
            {
                userinfo.role != 'influencer' && (
                    <Text style={style.description}>{creater.fullname}</Text>
                )
            }
            
            <Modal isVisible={visible} onBackdropPress={()=>setvisible(false)}>
                <View style={style.modalinside}>
                    <Image source={require('../assets/images/darkmode/carp.png')} style={style.logo} resizeMode="contain"></Image>
                    <Text style={style.descriptionmodal}>We Will remove this product?</Text>
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:20}}>
                        <TouchableOpacity style={[style.button,{backgroundColor:'#F6AA11',marginRight:20}]} onPress={removeproduct}>
                            <Text style={style.buttontxt}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[style.button,{backgroundColor:'black'}]} onPress={()=>setvisible(false)}>
                            <Text style={style.buttontxt}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    title:{
        fontSize:RFValue(18,580),
        marginTop:17,
        fontFamily:'Quicksand-Medium',
        color:'white'
    },
    description:{
        fontSize:RFValue(12,580),
        color:'#A4A4A4',
        fontFamily:'Quicksand-Medium'
    },
    camerabtn:{
        backgroundColor:'#F6AA11',
        borderRadius:11,
        paddingTop:7,
        paddingBottom:7,
        paddingLeft:15,
        paddingRight:15,
        marginLeft:'auto',
        marginRight:10,
        flexDirection:'row',
        alignItems:'center',
        alignSelf:'flex-end'
    },
    price:{
        fontSize:RFValue(10,580),
        color:'white',
        fontWeight:'bold',
        fontFamily:'Quicksand-Medium'
    },
    remove:{
        position:'absolute',
        width:wp('17.4'),
        height:wp('17.4'),
        borderRadius:wp('8.7'),
        right:-wp('8.7'),
        top:-wp('8.7'),
        backgroundColor:'#F6AA11',
        alignItems:'flex-start',
        justifyContent:'flex-end',
        padding:wp('2.5'),
        paddingLeft:wp('3.5'),
        paddingTop:wp('3.5')
    },
    modalinside:{
        backgroundColor:'white',
        paddingLeft:wp('12.07'),
        paddingRight:wp('12.07'),
        paddingTop:wp('4.83'),
        paddingBottom:wp('4.83'),
        alignItems:'center',
        justifyContent:'center',
        borderRadius:17
    },
    logo:{
        width:wp('26.56'),
        height:wp('28.15')
    },
    descriptionmodal:{
        fontSize:RFValue(18,580),
        fontFamily:'Quicksand-Medium',
        textAlign:'center',
        marginTop:16
    },
    button:{
        flex:1,
        padding:10,
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center'
    },
    buttontxt:{
        color:'white',
        fontSize:RFValue(18,580),
        fontFamily:'Montserrat-Medium'
    }
})