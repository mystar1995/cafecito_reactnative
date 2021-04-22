import React, { useState,forwardRef,useImperativeHandle } from 'react'
import {View,TouchableOpacity,Text,StyleSheet,Image} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import ImagePicker from 'react-native-image-crop-picker'
import AlertElement from './AlertComponent'
const UploadDocument = ({uploaddocument},ref) =>
{
    const [profile,setprofile] = useState(null)
    const [idcard,setidcard] = useState(null)
    const [error,seterror] = useState("")

    const openpicker = () => {
        ImagePicker.openPicker({quality:0.5}).then(image=>{
            setprofile({
                uri:image.path,
                type:image.mime,
                name:image.path.split('/').pop()
            })
        }).catch(err=>console.log(err))
    }

    const openid = () => {
        ImagePicker.openPicker({quality:0.5}).then(image=>{
            setidcard({
                uri:image.path,
                type:image.mime,
                name:image.path.split('/').pop()
            })
        })
    }

    useImperativeHandle(ref,()=>({
        uploaddocument()
        {
            if(!profile)
            {
                seterror('You have to upload your self profile');
                return;
            }

            if(!idcard)
            {
                seterror('You have to upload your identify card')
                return
            }

            uploaddocument(profile,idcard)
        }
    }))

    return (
        <View style={{marginTop:30}}>
            <TouchableOpacity style={style.imageupload}>
                {
                    profile == null?
                        <Feather name="image" color="#A7A7A7" size={RFValue(40,580)}></Feather>:
                        <Image source={{uri:profile.uri}} style={style.imageupload} resizeMode="cover"></Image>
                }
                <TouchableOpacity style={style.uploadbtn} onPress={openpicker}>
                    <Feather name="upload" color="white" size={RFValue(17,580)}></Feather>
                </TouchableOpacity>
            </TouchableOpacity>
            <Text style={[style.label,{marginTop:15,textAlign:'center'}]}>Upload Selfie Photo</Text>
            <Text style={style.label}>Upload ID</Text>
            {
                idcard == null?(
                    <View style={style.uploadcontainer}>
                        <Feather name="image" color="#F6AA11" size={RFValue(40,580)}></Feather>
                        <TouchableOpacity style={style.upload} onPress={openid}>
                            <Text style={style.uploadtxt}>Upload</Text>
                        </TouchableOpacity>
                    </View>
                ):(
                    <TouchableOpacity style={style.uploadcontainer} onPress={openid}>
                        <Image source={{uri:idcard.uri}} style={style.uploadcontainer}></Image>
                    </TouchableOpacity>
                )
            }
            {/* <View style={style.uploadcontainer}>
                <Feather name="image" color="#F6AA11" size={RFValue(40,580)}></Feather>
                <TouchableOpacity style={style.upload} onPress={openid}>
                    <Text style={style.uploadtxt}>Upload</Text>
                </TouchableOpacity>
            </View> */}
            <Text style={style.info}>ex: IC card, Passport, CNI Card</Text>
            <AlertElement error={error} seterror={seterror}></AlertElement>
        </View>
    )
}

const style = StyleSheet.create({
    imageupload:{
        width:wp('36.23'),
        height:wp('36.23'),
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#E3E3E3',
        borderRadius:wp('18')
    },
    uploadbtn:{
        width:wp('10.87'),
        height:wp('10.87'),
        justifyContent:'center',
        alignItems:'center',
        borderRadius:wp('5.5'),
        backgroundColor:'#F6AA11',
        position:'absolute',
        right:0,
        bottom:0
    },
    label:{
        marginTop:20,
        color:'white',
        fontFamily:'Montserrat-Regular',
        fontSize:RFValue(16,580)
    },
    uploadcontainer:{
        backgroundColor:'#252525',
        borderRadius:5,
        alignItems:'center',
        padding:15,
        height:wp('47.1'),
        width:wp('80.9'),
        marginTop:5,
        justifyContent:'center'
    },
    upload:{
        width:wp('23.67'),
        padding:7,
        alignItems:'center',
        marginTop:15,
        borderRadius:17,
        borderColor:'#F6AA11',
        borderWidth:1
    },
    uploadtxt:{
        color:'#F6AA11',
        fontSize:RFValue(12,580),
        fontFamily:'Quicksand-Medium'
    },
    info:{
        fontSize:RFValue(12,580),
        color:'white',
        fontFamily:'Montserrat-Regular'
    }
})

export default  React.memo(forwardRef(UploadDocument, ()=>{}));