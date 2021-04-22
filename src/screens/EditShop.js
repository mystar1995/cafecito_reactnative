import React,{useEffect,useState} from 'react'
import {View,StyleSheet,ImageBackground,TouchableOpacity,Text,Image,ScrollView,FlatList,TextInput} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {setproduct} from '../redux/action/product'
import {RFValue} from 'react-native-responsive-fontsize'
import ImagePicker from 'react-native-image-crop-picker'
import AntDesign from 'react-native-vector-icons/AntDesign'
import config from '../config/config.json'
import {useDispatch,useSelector} from 'react-redux'
import {getproducts, updateproductinfo} from '../service/productservice'
import AlertComponent from '../component/AlertComponent'
export default function EditShop({navigation,route})
{
    const dispatch = useDispatch()
    const [product,setproductinfo] = useState(route.params.product)
    const [image,setimage] = useState(false)
    const [error,seterror] = useState('')
    const {token} = useSelector(state=>state.auth)
    useEffect(()=>{
        setproductinfo(route.params.product)
        setimage(false)
    },[route.params.product.id])

    const upload = () => {
        ImagePicker.openPicker({}).then(image=>{
            setimage({
                uri:image.path,
                type:image.mime,
                name:image.path.split('/').pop()
            })
        }).catch(err=>console.log(err))
    }

    const validateproduct = (productinfo) => {
        for(let item in productinfo)
        {
            if(!productinfo[item])
            {
                seterror('Please fill all fields')
                return false
            }
        }

        return true;
    }

    const updateproduct = () => {

        if(validateproduct())
        {   
            let productinfo = {
                id:product.id,
                title:product.title,
                description:product.description,
                price:product.price
            }
    
            if(image)
            {
                productinfo.image = image;
            }
    
            updateproductinfo(productinfo,token).then(res=>{
                if(res.data.success)
                {
                    getproducts(token).then(res=>{
                        if(res.data.success)
                        {
                            seterror("You have updated successfully")
                            dispatch(setproduct(res.data.product))
                        }
                    })
                }   
            })
        }    
    }

    const deleteproduct = () => {

    }

    return (
        <View style={style.container}>
            <View style={style.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <AntDesign name="arrowleft" color="white" size={RFValue(25,580)}></AntDesign>
                </TouchableOpacity>
                <Text style={style.title}>{product.title}</Text>
                <TouchableOpacity style={style.righticon}>
                    
                </TouchableOpacity>
            </View>
            <ScrollView style={style.content} showsVerticalScrollIndicator={false}>
                <View style={style.image}>
                    <Image source={{uri:image?image.uri:config.apiurl + "/" + product.image}} style={style.image} resizeMode="contain"></Image>
                    <TouchableOpacity style={style.uploadbtn} onPress={upload}>
                        <AntDesign name="upload" color="white" size={RFValue(18,580)}></AntDesign>
                    </TouchableOpacity>
                </View>
                
                <View style={style.inputcontainer}>
                    <TextInput style={style.input} value={product.title} onChangeText={value=>setproductinfo({...product,title:value})}></TextInput>
                </View>
                <View style={[style.inputcontainer,{width:wp('37')}]}>
                    <Text style={[style.input,{padding:0}]}>$</Text>
                    <TextInput style={style.input} value={product.price + ""} onChangeText={value=>setproductinfo({...product,price:value})}></TextInput>
                </View>
                <View style={style.inputcontainer}>
                    <TextInput style={[style.input,{fontSize:RFValue(12,580),fontFamily:'Quicksand-Regular'}]} textAlignVertical="top" multiline={true} value={product.description} numberOfLines={8} onChangeText={value=>setproductinfo({...product,description:value})}></TextInput>
                </View>
            </ScrollView>
            <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:15}}>
                <TouchableOpacity style={[style.btn,{backgroundColor:'#F6AA11'}]} onPress={updateproduct}>
                    <Text style={style.btntext}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[style.btn,{backgroundColor:'#252525',marginRight:0}]}>
                    <Text style={style.btntext}>Remove</Text>
                </TouchableOpacity>
            </View>
            <AlertComponent error={error} seterror={seterror}></AlertComponent>
        </View>
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
        fontFamily:'Quicksand-Medium',
        textAlign:'center'
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
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    productinfo:{
        fontSize:RFValue(17,580),
        color:'white',
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
    },
    inputcontainer:{
        display:'flex',
        flexDirection:'row',
        paddingLeft:25,
        paddingRight:25,
        backgroundColor:'#252525',
        borderRadius:27,
        alignItems:'center',
        shadowColor:'black',
        shadowOpacity:0.16,
        shadowOffset:{
            height:3,
            width:0
        },
        shadowRadius:5,
        marginTop:15
    },
    input:{
        color:'white',
        fontSize:RFValue(18,580),
        fontFamily:'Quicksand-Medium',
        flex:1
    },
    uploadbtn:{
        width:wp('10.87'),
        height:wp('10.87'),
        borderRadius:wp('5.4'),
        backgroundColor:'#F6AA11',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        bottom:0,
        right:0
    }
})