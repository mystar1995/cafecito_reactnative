import React,{useRef} from 'react'
import {View,StyleSheet,ImageBackground,TouchableOpacity,Text,Image,ScrollView,FlatList} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ScalingDrawer from 'react-native-scaling-drawer'
import {RFValue} from 'react-native-responsive-fontsize'
import Sidebar from '../component/Sidebar'
import PodCastItem from '../component/PodcastItem'
import LiveStreamItem from '../component/LiveStreamItem'
import InfluenceItem from '../component/InfluenceItem'
import VideoItem from '../component/VideoItem'
import ShopItem from '../component/ShopItem'
import {useSelector} from 'react-redux'

export default function Home({navigation})
{
    let drawer = useRef(null)
    const podcasts = useSelector(state=>state.podcast)
    const influencer = useSelector(state=>state.influencers)
    const video = useSelector(state=>state.video)
    const product = useSelector(state=>state.product)
    const livestream = useSelector(state=>state.livestreams)


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
                    <Image source={require('../assets/images/darkmode/logotitle.png')}></Image>
                    <TouchableOpacity style={style.righticon} onPress={()=>navigation.navigate('Chat')}>
                        <Image source={require('../assets/images/chat.png')}></Image>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View>
                        {
                            podcasts.length > 0 && (
                                <View style={{marginTop:hp('2%'),padding:24}}>
                                    <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:14,alignItems:'center'}}>
                                        <Text style={style.title}>Podcast</Text>
                                        <TouchableOpacity style={style.btn_see} onPress={()=>navigation.navigate('Podcasts')}>
                                            <Text style={{fontSize:RFValue(12,580),color:'#F6AA11',fontWeight:'500',fontFamily:"Quicksand-Medium"}}>See All</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <FlatList
                                        data={podcasts}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={({item,index})=>index}
                                        renderItem={({item,index})=><PodCastItem {...item} navigation={navigation} key={index}></PodCastItem>}
                                    ></FlatList>
                                </View>
                            )
                        }
                        {
                            livestream.length > 0 && (
                                <View style={{padding:24}}>
                                    <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:14,alignItems:'center'}}>
                                        <Text style={style.title}>Live Stream</Text>
                                        <TouchableOpacity style={style.btn_see} onPress={()=>navigation.navigate('LiveStreams')}>
                                            <Text style={{fontSize:RFValue(12,580),color:'#F6AA11',fontWeight:'500',fontFamily:"Quicksand-Medium"}}>See All</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <FlatList
                                        data={livestream.slice(0,4)}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={({item,index})=>index}
                                        renderItem={({item,index})=><LiveStreamItem livestream={item} key={index}></LiveStreamItem>}
                                    ></FlatList>
                                </View>
                            )
                        }
                        {
                            influencer.length > 0 && (
                                <View style={{padding:24}}>
                                    <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:14,alignItems:'center'}}>
                                        <Text style={style.title}>Cafecito Solo</Text>
                                        <TouchableOpacity style={style.btn_see} onPress={()=>navigation.navigate('Influencers')}>
                                            <Text style={{fontSize:RFValue(12,580),color:'#F6AA11',fontWeight:'500',fontFamily:"Quicksand-Medium"}}>See All</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <FlatList
                                        data={influencer}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={({item,index})=>index}
                                        renderItem={({item,index})=><InfluenceItem {...item} key={index} navigation={navigation}></InfluenceItem>}
                                    ></FlatList>
                                </View>
                            )
                        }
                        
                        {
                            video.length > 0 && (
                                <View style={{padding:24}}>
                                    <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:14,alignItems:'center'}}>
                                        <Text style={style.title}>Video</Text>
                                        <TouchableOpacity style={style.btn_see} onPress={()=>navigation.navigate('Videos')}>
                                            <Text style={{fontSize:RFValue(12,580),color:'#F6AA11',fontWeight:'500',fontFamily:"Quicksand-Medium"}}>See All</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <FlatList
                                        data={video}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={({item,index})=>index}
                                        renderItem={({item,index})=><VideoItem {...item} key={index}></VideoItem>}
                                    ></FlatList>
                                </View>
                            )
                        }
                        {
                            product.length > 0 && (
                                <View style={{padding:24,marginBottom:24}}>
                                    <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:14,alignItems:'center'}}>
                                        <Text style={style.title}>Shop</Text>
                                        <TouchableOpacity style={style.btn_see} onPress={()=>navigation.navigate('Shops')}>
                                            <Text style={{fontSize:RFValue(12,580),color:'#F6AA11',fontWeight:'500',fontFamily:"Quicksand-Medium"}}>See All</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <FlatList
                                        data={product}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={({item,index})=>index}
                                        renderItem={({item,index})=><ShopItem {...item} key={index} navigation={navigation}></ShopItem>}
                                    ></FlatList>
                                </View>
                            )
                        }
                    </View>
                </ScrollView>
            </View>
       </ScalingDrawer> 
    )
}


const style = StyleSheet.create({
    container:{
        width:wp('100%'),
        height:hp('100%'),
        resizeMode:"cover",
        backgroundColor:'#101010'
    },
    header:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:24
    },
    headertitle:{
        fontSize:RFValue(22,580)
    },
    righticon:{
        width:wp('9%'),
        height:wp('9%'),
        borderRadius:wp('5%'),
        backgroundColor:'#F6AA11',
        justifyContent:'center',
        alignItems:'center'
    },
    title:{
        fontSize:RFValue(18,580),
        fontFamily:'Quicksand-Medium',
        color:'white'
    },
    btn_see:{
        borderRadius:11,
        paddingLeft:12,
        paddingRight:12,
        paddingTop:4,
        paddingBottom:4,
        borderColor:'#F6AA11',
        borderWidth:1
    }
})
