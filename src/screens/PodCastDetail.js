import React,{useState,useEffect} from 'react'
import {View,StyleSheet,Text,TouchableOpacity,Image,FlatList} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'
import AntDesign from 'react-native-vector-icons/AntDesign'
import LiveVideo from '../component/LiveVideo'
import {useSelector} from 'react-redux'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Loading from 'react-native-loading-spinner-overlay'
import {getfeed} from '../service/podcastservice'
import Sound from 'react-native-sound'
export default function PodCastDetail({navigation,route})
{
    const {userinfo,token} = useSelector(state=>state.auth)
    const [playtrack,setplaytrack] = useState(null)
    const videodata = [
        {title:"4to Capitulo de Choko...",time:'2 hr 13min'},
        {title:'El Capitulo 3 de Choko...',time:'2 hr 23 min'},
        {title:'Hoy el Capitulo 2 de...',time:'2 hr 18 min'}
    ]

    const id = route.params.id;
    
    const [loading,setloading] = useState(true)
    const [info,setinfo] = useState({})
    useEffect(()=>{
        setloading(true)
        getfeed(id,token).then(res=>{
            if(res.data.success)
            {
                let podcast = res.data.podcast;
                podcast.episodes = res.data.episodes;

                setinfo(podcast)
                setloading(false)
            }
        }).catch(err=>{setloading(false);console.log(err.response.data)})
    },[id])

    useEffect(()=>{
        navigation.addListener('focus',()=>{
            setloading(true)
            getfeed(id,token).then(res=>{
                if(res.data.success)
                {
                    let podcast = res.data.podcast;
                    podcast.episodes = res.data.episodes;

                    setinfo(podcast)
                    setloading(false)
                }
            }).catch(err=>{setloading(false);console.log(err.response.data)})
        })
    },[])

    const play = (url) => {
        if(playtrack)
        {
            playtrack.stop()
        }
        let playtrackdata = new Sound(url,null,(e)=>{
            if(e)
            {
                console.log(e)
            }
            else
            {
                playtrackdata.play()
                setplaytrack(playtrackdata)
            }
        })
    }

    useEffect(()=>{
        return ()=>{
            if(playtrack)
            {
                playtrack.stop()
            }
        }
    },[playtrack])

    if(loading)
    {
        return (
            <View style={style.container}>
                <Loading visible={loading}/>
            </View>
        )
    }

    return (
        <View style={style.container}>
            <View style={style.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <AntDesign name="arrowleft" color="white" size={RFValue(25,580)}></AntDesign>
                </TouchableOpacity>
                <Text style={style.headertitle}>{info.title}</Text>
                <TouchableOpacity style={style.righticon} onPress={()=>navigation.goBack()}>
                    {
                        userinfo.role == 'influencer' && (
                            <AntDesign name="closecircleo" size={RFValue(21,580)} color="#F6AA11"></AntDesign>
                        )
                    }
                </TouchableOpacity>
            </View>
            <View style={{marginTop:15,flex:1}}>
                <View style={{flex:1}}>
                    <View style={style.top}>
                        <Image source={{uri:info.image}} style={style.logo} resizeMode="cover"/>
                        <View style={{marginLeft:26,flex:1}}>
                            <Text style={style.title}>{info.title}</Text>
                            <Text style={style.info}>{info.author}</Text>
                            <View style={{marginTop:10,display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
                            {
                                info.tags && info.tags.split(',').map((item)=>(
                                    <TouchableOpacity style={style.tagbtn}>
                                        <Text style={style.tagtext}>{item}</Text>
                                    </TouchableOpacity>
                                ))
                            }   
                            </View>
                            {
                                userinfo.role == 'influencer' && (
                                    <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:15}}>
                                        <FontAwesome name="feed" color="white" size={RFValue(9,580)}></FontAwesome>
                                        <Text style={[style.info,{marginLeft:5}]}>RSS Feed</Text>
                                    </View>
                                    
                                )   
                            }
                        </View>
                    </View>
                    <View style={{flex:1,overflow:'hidden',padding:24}}>
                        <Text style={style.content}>{info.description}</Text>
                    </View>
                </View>
                {
                    (info.enable && info.type != 'FREE')?(
                        <>
                            <View style={{flex:1,padding:24}}>
                                <View style={style.contentwrap}>
                                        <Text style={style.label}>Price: </Text>
                                        <Text style={style.label}>${info.price}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={[style.btn,{backgroundColor:'#F6AA11'}]} onPress={()=>navigation.navigate('Payment',{podcast:{id:info.id},total:info.price})}>
                                <Text style={style.btntext}>Checkout</Text>
                            </TouchableOpacity>
                        </>
                    ):(
                        <View style={{flex:1,padding:24}}>
                            <Text style={style.contenttitle}>{info.episodes.length} Episodes</Text>
                            <FlatList
                                data={info.episodes}
                                showsVerticalScrollIndicator={false}
                                style={{marginTop:15}}
                                keyExtractor={({item,index})=>index}
                                renderItem={({item,index})=><LiveVideo key={index} {...item} navigation={navigation} audiourl={item.audiourl} onplay={()=>play(item.audiourl)}></LiveVideo>}
                            ></FlatList>
                        </View>
                    )
                }
                
            </View>
            <Loading visible={loading}></Loading>
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
        paddingTop:24,
        paddingBottom:0
    },
    righticon:{
        width:wp('9%'),
        height:wp('9%'),
        borderRadius:wp('5%'),
        justifyContent:'center',
        alignItems:'center'
    },
    headertitle:{
        fontSize:RFValue(18,580),
        color:'white',
        fontFamily:'Quicksand-Medium',
        textAlign:'center'
    },
    logo:{
        width:wp('27.05'),
        height:wp('27.05'),
        borderRadius:14,
        resizeMode:"cover"
    },
    top:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:24,
        paddingRight:24
    },
    title:{
        fontSize:RFValue(15,580),
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    info:{
        fontSize:RFValue(10,580),
        fontFamily:'Quicksand-Medium',
        color:'#F6AA11'
    },
    tagbtn:{
        borderColor:'#CECECE',
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:3,
        paddingTop:3,
        borderRadius:11,
        marginRight:10,
        borderWidth:1
    },
    tagtext:{
        color:'#CECECE',
        fontFamily:'Quicksand-Medium',
        fontSize:RFValue(12,580)
    },
    content:{
        fontFamily:'Quicksand-Regular',
        fontSize:RFValue(12,580),
        color:'white'
    },
    contenttitle:{
        fontSize:RFValue(19,580),
        color:'#F6AA11',
        fontFamily:'Quicksand-Medium'
    },
    contentwrap:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    label:{
        fontSize:RFValue(18,580),
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    btn:{
        margin:24,
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