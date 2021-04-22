import React,{useEffect,useState} from 'react'
import {Alert,View,StyleSheet,TouchableOpacity,Text,Image,Slider} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {RFValue} from 'react-native-responsive-fontsize'
import LiveVideo from '../component/LiveVideo'
import Feather from 'react-native-vector-icons/Feather'
import Loading from 'react-native-loading-spinner-overlay'
import {getepisode} from '../service/podcastservice'
import {useSelector} from 'react-redux'
import Sound from 'react-native-sound'
export default function Episode({navigation,route})
{
    const {token} = useSelector(state=>state.auth)
    const [playing,setplay] = useState(false)
    const [state,setstate] = useState({})
    const [loading,setloading] = useState(true)
    let id = route.params.id;  
    const [playtrack,setplaytrack] = useState(null)
    let timer = null;
    const [time,settime] = useState(0)
    const [duration,setduration] = useState(0)

    const controltimer = () => {
        if(playtrack)
        {
            playtrack.getCurrentTime(function(currenttime){
                settime(currenttime)
            })
        }
    }

    useEffect(()=>{
        setloading(true)
        
        getepisode(id,token).then(res=>{
            if(res.data.success)
            {
                setloading(false)
                setstate(res.data.data)
                if(res.data.data.audiourl)
                {
                    let playtrackdata = new Sound(res.data.data.audiourl,null,(e)=>{
                        if(e)
                        {
                            console.log(e)
                        }
                        else
                        {
                            setplay(true)
                            playtrackdata.play()
                            setplaytrack(playtrackdata)
                            setduration(playtrackdata.getDuration())
                        }
                    }) 
                }
            }
        }).catch(err=>console.log(err))

        
        return ()=> {
            if(playtrack)
            {
                playtrack.stop();
            }
        }
    },[id])

    useEffect(()=>{
        timer = window.setInterval(controltimer,1000)

        return () => {
            if(timer)
            {
                window.clearInterval(timer)
            }
        }
    },[playtrack])

    const gettime = () => {
        let currenttime = "";
        
        let list = [];
        let totaltime = time;
        while(totaltime > 0)
        {
            let t = Math.floor(totaltime % 60);
            list.push(t < 10?'0' + t:t)
            totaltime = Math.floor(totaltime / 60)
        }

        if(list.length == 0)
        {
            return '00:00';
        }
        else if(list.length == 1)
        {
            return '00:' + list[0];
        }
        else
        {
            return list.reverse().join(':')
        }
    }

    const play = () => {
        if(playtrack)
        {
            playtrack.play()
        }
    }

    const pause = () => {
        console.log(playtrack)
        if(playtrack)
        {
            if(playing)
            {
                playtrack.pause();
            }
            else
            {
                playtrack.play()
            }
            setplay(!playing)
             
        }
    }

    const selecttime = (value) => {
        console.log(value * duration)
        if(playtrack)
        {
            playtrack.setCurrentTime(value * duration)
        }
    }
 
    if(loading)
    {
        return (
            <View style={style.container}>
                <Loading visible={loading} textContent="Loading ... " textStyle={{color:'white'}}/>
            </View>
        )
    }
    return (
        <View style={style.container}>
            <View style={style.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <AntDesign name="arrowleft" color="white" size={RFValue(25,580)}></AntDesign>
                </TouchableOpacity>
                <Text style={style.headertitle}>{state.title}</Text>
                <View style={{width:RFValue(25,580)}}></View>
            </View>
            <View style={style.top}>
                <Image source={{uri:state.podcast?state.podcast.image:''}} style={style.image}></Image>
                <View style={{marginLeft:15}}>
                    <Text style={style.title}>{state.podcast?state.podcast.title:''}</Text>
                    <Text style={style.info}>{state.podcast?state.podcast.author:''}</Text>
                </View>
            </View>
            <View style={style.episodecontainer}>
                <Text style={style.episodetitle}>{state.title}</Text>
                <View style={{marginTop:10,marginBottom:10}}>
                    <LiveVideo title={state.title} audiourl={state.audiourl} duration={state.duration + " minutes"} navigation={navigation} onplay={play}></LiveVideo>
                </View>
                <Text style={style.description}>{state.description}</Text>
            </View>
            <View style={{flex:1}}></View>
            <View style={{padding:24,marginBottom:24}}>
                <Text style={[style.title,{fontSize:RFValue(15,580)}]} numberOfLines={1}>{state.title}</Text>
                <Text style={[style.description,{fontSize:RFValue(13,580)}]} numberOfLines={1}>{state.description}</Text>
                <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:10}}>
                    <TouchableOpacity style={style.pausebtn} onPress={pause}>
                        <Feather name={playing?"pause":"play"} color="white" size={RFValue(15,580)}></Feather>
                    </TouchableOpacity>    
                    <Slider value={duration == 0?0:time/duration} style={{flex:1}} onValueChange={value=>selecttime(value)} thumbTintColor="#F6AA11" minimumTrackTintColor="#F6AA11" maximumTrackTintColor="#BEC2CC"></Slider>
                    <Text style={{fontSize:RFValue(12,580),fontFamily:'arial',fontWeight:'bold',color:'#B0B0B0C6',marginLeft:10}}>{gettime()}</Text>
                </View>
                
            </View>
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
        alignItems:'center',
        padding:24,
        justifyContent:'space-between'
    },
    headertitle:{
        fontSize:RFValue(18,580),
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    top:{
        paddingLeft:24,
        paddingBottom:17,
        paddingRight:24,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    image:{
        width:wp('20.77'),
        height:wp('20.77'),
        borderRadius:14
    },
    title:{
        fontSize:RFValue(15,580),
        color:'#B0B0B0',
        fontFamily:'Quicksand-Medium'
    },
    info:{
        fontSize:RFValue(10,580),
        color:'#F6AA11',
        fontFamily:'Quicksand-Medium'
    },
    episodecontainer:{
        padding:24
    },
    episodetitle:{
        color:'#F6AA11',
        fontFamily:'Quicksand-Medium',
        fontSize:RFValue(19,580)
    },
    description:{
        fontSize:RFValue(12,580),
        fontFamily:'Quicksand-Regular',
        color:'#B0B0B0'
    },
    pausebtn:{
        shadowColor:'#F6AA11',
        shadowOpacity:0.3,
        shadowRadius:5,
        shadowOffset:{
            height:2,
            width:0
        },
        elevation:1,
        backgroundColor:'#F6AA11',
        borderRadius:7,
        paddingLeft:2,
        paddingRight:2,
        paddingTop:1,
        paddingBottom:1
    }
})