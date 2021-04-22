import React from 'react'
import {View,StyleSheet,TouchableOpacity,Text} from 'react-native'
import Modal from 'react-native-modal'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'

export default function AlertComponent({error,seterror})
{
    return (
        <Modal 
            isVisible={error != ""}
            onBackdropPress={()=>seterror('')}
        >
            <View style={style.modalinside}>
                <Text style={style.description}>{error}</Text>
                <TouchableOpacity style={style.btncontainer} onPress={()=>seterror("")}>
                    <Text style={style.btntext}>Ok</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const style = StyleSheet.create({
    modalinside:{
        backgroundColor:'white',
        padding:20,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:17
    },
    description:{
        fontSize:RFValue(18,580),
        fontFamily:'Quicksand-Medium',
        textAlign:'center',
        marginTop:16
    },
    btncontainer:{
        display:'flex',
        width:wp('34.54'),
        justifyContent:'center',
        padding:15,
        backgroundColor:'#F6AA11',
        borderRadius:25,
        flexDirection:'row',
        alignItems:'center',
        marginTop:hp('2.5%')
    },
    btntext:{
        color:'white',
        fontSize:RFValue(18,580),
        fontFamily:'Montserrat-Medium'
    }
})