import React from 'react'
import {View,StyleSheet,TouchableOpacity,Text,FlatList} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import Feather from 'react-native-vector-icons/Feather'
import ReviewItem from '../component/ReviewItem'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'

export default function InfluencerReview({navigation,route})
{
    const influencer = route.params.influencer
    const reviews = route.params.reviews
    return (
        <View style={style.container}>
            <View style={style.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <Feather name="arrow-left" size={RFValue(25,580)} color="white"></Feather>
                </TouchableOpacity>
                <Text style={style.title}>{influencer.fullname}'s Reviews</Text>
                <TouchableOpacity style={style.righticon}></TouchableOpacity>
            </View>
            {
                reviews.length > 0?<FlatList
                    data={reviews}
                    showsVerticalScrollIndicator={false}
                    style={{marginBottom:45,marginTop:24}}
                    keyExtractor={({item,index})=>index}
                    renderItem={({item,index})=><ReviewItem review={item} key={index}></ReviewItem>}
                ></FlatList>:(
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={style.title}>There are no reviews</Text>
                    </View>
                )
            }
            
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#101010'
    },
    header:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:24,
        paddingRight:24,
        paddingTop:24
    },
    righticon:{
        width:wp('9%'),
        height:wp('9%'),
        borderRadius:wp('5%'),
        justifyContent:'center',
        alignItems:'center',
    },
    headertitle:{
        fontSize:RFValue(22,580)
    },
    title:{
        fontSize:RFValue(17,580),
        fontFamily:'arial',
        color:'white'
    }
})