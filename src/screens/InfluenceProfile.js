import React,{useState,useEffect} from 'react'
import {View,StyleSheet,ScrollView,TouchableOpacity,Text,Image,FlatList,TextInput} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MyVideoItem from '../component/MyVideoItems'
import ReviewItem from '../component/ReviewItem'
import {useSelector,useDispatch} from 'react-redux'
import moment from 'moment'
import Loading from 'react-native-loading-spinner-overlay'
import {getuservideo} from '../service/videoservice'
import config from '../config/config.json'
import Modal from 'react-native-modal'
import AlertElement from '../component/AlertComponent'
import {submitreview,getreviewsforinfluencer,getinfluencers} from '../service/userservice'
import {setinfluencers} from '../redux/action/influencers'

export default function InfluenceProfile({navigation,route})
{
    let info = route.params.info
    const dispatch = useDispatch()
    const {userinfo,token} = useSelector(state=>state.auth)
    const influencers = useSelector(state=>state.influencers)
    const [videoinfo,setvideoinfo] = useState([])
    const [loading,setloading] = useState(false)
    const [visible,setvisible] = useState(false)
    const [reviews,setreviews] = useState([])
    const [reviewinfo,setreviewinfo] = useState({
        reviews:0,
        description:"",
        title:""
    })
    const [error,seterror] = useState("")

    const getreview = () => {
        let review = 0
        for(let item in reviews)
        {
            review += Number(reviews[item].reviews)
        }

        if(reviews.length > 0)
        {
            return Math.floor(review / reviews.length * 10) / 10;
        }
        else
        {
            return 0;
        }
    }

    useEffect(()=>{
        setloading(true)
        getreviewsforinfluencer(info.id,token).then(res=>{
            if(res.data.success)
            {
                console.log(res.data.reviews)
                setreviews(res.data.reviews)
            }
        })

        getuservideo(token,info.id).then(res=>{
            console.log(info.id)
            if(res.data.success)
            {
                setvideoinfo(res.data.video)
            }
            setloading(false)
        }).catch(err=>setloading(false))
        
        
    },[info.id])

    const renderreview = (count) => {
        let review = Math.floor(count)
        let list = []
        for(let index = 0;index<review;index++)
        {
            list.push(<AntDesign name="star" color="#E9C448" size={RFValue(11,580)}></AntDesign>)
        }

        for(let index = review;index<5;index++)
        {
            list.push(<AntDesign name="staro" color="#E9C448" size={RFValue(11,580)}></AntDesign>)
        }

        return list;
    }

    const getselfreview = () => {
        for(let item in reviews)
        {
            if(reviews[item].customerid == userinfo.id)
            {
                return reviews[item]
            }
        }

        return false;
    }

    const renderreviewbtn = () => {
        var list = []

        for(let index = 0;index<reviewinfo.reviews;index++)
        {
            list.push(
                <TouchableOpacity style={{marginRight:10}} onPress={()=>setreviewinfo({...reviewinfo,reviews:index + 1})}>
                    <AntDesign name="star" color="#E9C448" size={RFValue(22,580)}></AntDesign>
                </TouchableOpacity>
            )
        }

        for(let index = reviewinfo.reviews;index<5;index++)
        {
            list.push(
                <TouchableOpacity style={{marginRight:10}} onPress={()=>setreviewinfo({...reviewinfo,reviews:index + 1})}>
                    <AntDesign name="staro" color="#E9C448" size={RFValue(22,580)}></AntDesign>
                </TouchableOpacity>
            )
        }

        return list;
    }

    const submit = () => {
        if(!reviewinfo.description)
        {
            seterror('Description is required for review')
            return;
        }
        
        if(!reviewinfo.reviews)
        {
            seterror('You have to give score for this influencer')

            return;
        }

        setloading(true)

        submitreview({...reviewinfo,influencerid:info.id},token).then(res=>{
            if(res.data.success)
            {
                setvisible(false)
                getreviewsforinfluencer(info.id,token).then(response=>{
                    if(response.data.success)
                    {
                        getinfluencers(token).then(res=>{
                            if(res.data.success)
                            {
                                dispatch(setinfluencers(res.data.data))
                            }
                        }).catch(err=>console.log(err))
                        setreviews(response.data.reviews)
                    }
                    setloading(false)
                }).catch(err=>setloading(false))
            }
            else
            {
                setloading(false)
            }
        }).catch(err=>setloading(false))

    }

    const editreview = () => {
        let reviewinfo = {
            reviews:0,
            description:"",
            title:""
        }

        let review = getselfreview()
        
        if(review)
        {
            reviewinfo = {
                reviews:review.reviews,
                description:review.description,
                title:review.title
            }
        }

        setreviewinfo(reviewinfo)
        setvisible(true)
    }

    const navigate = () => {
        navigation.navigate('InfluencerReview',{influencer:info,reviews:reviews})
    }

    let self = getselfreview()

    return (
        <View style={{width:wp('100'),height:hp('100'),backgroundColor:'#101010'}}>
            <View style={style.header}>
                <View style={style.topheader}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <AntDesign name="arrowleft" color="#C9C9C9" size={RFValue(25,580)}></AntDesign>
                    </TouchableOpacity>
                    <Text style={style.headertitle}>{info.fullname}'s Profile</Text>
                    <View style={{width:RFValue(25,580)}}></View>
                </View>
            </View>
            <ScrollView style={{flex:1}}>
                <View>
                    <View style={style.contentprofile}>
                        <Image source={info.profile?{uri:config.apiurl + "/" + info.profile}:require('../assets/images/darkmode/carp.png')} style={{width:wp('30.43'),height:wp('30.43'),borderRadius:10}}></Image>
                        <View style={{marginLeft:10}}>
                            <Text style={style.headertitle}>{info.fullname}</Text>
                            <Text style={style.infotitle}>{info.job}</Text>
                            <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:5}}>
                                <TouchableOpacity style={[style.btninfo]}>
                                    <FontAwesome5 name="video" color='#F6AA11' size={RFValue(10,580)}></FontAwesome5>
                                </TouchableOpacity> 
                                <Text style={style.iteminfo}>(${info.videoprice})</Text>
                                <TouchableOpacity style={style.btninfo}>
                                    <Image source={require('../assets/images/coffee-hot.png')} style={{width:RFValue(10,580),height:RFValue(10,580)}}></Image>
                                </TouchableOpacity> 
                                <Text style={style.iteminfo}>(${info.cafecitoprice})</Text>
                            </View>
                            <View style={{display:'flex',flexDirection:'row',marginTop:5}}>
                                {renderreview(getreview())}
                                <Text style={style.iteminfo}>{getreview()} ({reviews.length})</Text>
                            </View>
                            <Text style={style.infotitle}>Address</Text>
                            <Text style={[style.infotitle,{color:'white'}]}>{info.address}</Text>
                        </View>
                        
                    </View>
                    <View style={style.content}>
                        <Text style={style.description}>{info.description}</Text>
                        <View style={{marginTop:15,flexDirection:'row',display:'flex'}}>
                            <TouchableOpacity style={style.btn} onPress={()=>navigation.navigate('Chat')}>
                                <MaterialIcons name="chat-bubble-outline" color="white" size={RFValue(18,580)}></MaterialIcons>
                                <Text style={[style.btntext,{fontSize:RFValue(14,580),marginLeft:10}]}>Chat</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[style.btn,{backgroundColor:'#101010',marginLeft:10,borderWidth:1,borderColor:'#EEB408'}]} onPress={()=>navigation.navigate('Request',{info:info})}>
                                <Feather name="git-pull-request" color="#F6AA11" size={RFValue(18,580)}></Feather>
                                <Text style={[style.btntext,{fontSize:RFValue(14,580),marginLeft:10,color:'#F6AA11'}]}>Request</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={style.videos}>
                        <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={style.sectiontitle}>Videos</Text>
                            <TouchableOpacity style={style.btn_see} onPress={()=>navigation.navigate('Videos')}>
                                <Text style={{fontSize:RFValue(12,580),color:'#F6AA11',fontWeight:'500',fontFamily:"Quicksand-Medium"}}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={videoinfo}
                            showsHorizontalScrollIndicator={false}
                            style={{marginTop:24}}
                            horizontal={true}
                            keyExtractor={({item,index})=>index}
                            renderItem={({item,index})=>(
                                <MyVideoItem video = {item} key={index}></MyVideoItem>
                            )}
                        ></FlatList>
                    </View>
                    <View style={style.ratingcontainer}>
                        <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                            <View style={{flex:1}}>
                                {self&&<Text style={style.sectiontitle}>Rated on {moment(new Date(self.created_at)).format('MMM D')}</Text>}
                                <View style={{display:'flex',flexDirection:'row',marginTop:5,alignItems:'center'}}>
                                    {renderreview(getreview())}
                                    <Text style={{marginLeft:10,fontSize:RFValue(13,580),color:'white'}}>{getreview()} ({reviews.length})</Text>
                                </View>
                                
                            </View>
                            <TouchableOpacity style={style.btncircle} onPress={editreview}>
                                <Feather name="edit" color="white" size={RFValue(16,580)}></Feather>
                            </TouchableOpacity>
                        </View>
                        {self && (
                            <Text style={[style.description,{marginTop:10}]}>
                                {self.description}
                            </Text>
                        )}
                        
                        <View style={{marginTop:20}}>
                            <View style={{flexDirection:'row',display:'flex',justifyContent:'space-between'}}>
                                <Text style={style.sectiontitle}>Reviews</Text>
                                <TouchableOpacity style={style.btn_see} onPress={navigate}>
                                    <Text style={{fontSize:RFValue(12,580),color:'#F6AA11',fontWeight:'500',fontFamily:"Quicksand-Medium"}}>See All {reviews.length} Reviews</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <FlatList
                        data={reviews}
                        showsVerticalScrollIndicator={false}
                        style={{marginBottom:45}}
                        keyExtractor={({item,index})=>index}
                        renderItem={({item,index})=><ReviewItem review={item} key={index}></ReviewItem>}
                    ></FlatList>
                </View>
            </ScrollView>
            
            <Loading visible={loading}></Loading>

            <Modal visible={visible} onBackdropPress={()=>setvisible(false)}>
                <View style={style.modalinside}>
                    <Text style={style.modaltitle}>Review</Text>
                    <View style={style.modalcontainer}>
                        {renderreviewbtn(reviewinfo.reviews)}
                    </View>
                    <TextInput style={{borderRadius:10,borderColor:'#101010',borderWidth:1,marginTop:5,padding:10}} placeholder="Title" value={reviewinfo.title} onChangeText={text=>setreviewinfo({...reviewinfo,title:text})}></TextInput>
                    <View style={{marginTop:10}}>
                        <TextInput style={{borderRadius:10,borderColor:'#101010',borderWidth:1,height:200,textAlignVertical:'top',padding:10}} numberOfLines={10} placeholder="Description" onChangeText={text=>setreviewinfo({...reviewinfo,description:text})} value={reviewinfo.description}></TextInput>
                    </View>
                    <TouchableOpacity style={style.btncontainer} onPress={submit}>
                        <Text style={style.btntext}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <AlertElement error={error} seterror={seterror}></AlertElement>
        </View>
    )
}

const style= StyleSheet.create({
    header:{
        padding:24,
        paddingBottom:10
    },
    topheader:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    contentprofile:{
        paddingLeft:24,
        paddingRight:24,
        paddingBottom:10,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    headertitle:{
        fontSize:RFValue(18,580),
        color:'white',
        fontFamily:'Quicksand-Medium'
    },
    title:{
        fontSize:RFValue(19,580),
        color:'black',
        fontFamily:'Quicksand-Medium',
        marginTop:5
    },
    infotitle:{
        color:'white',
        fontSize:RFValue(10,580),
        fontFamily:"Quicksand-Medium"
    },
    btninfo:{
        width:wp('5.8'),
        height:wp('5.8'),
        borderRadius:wp('6.64'),
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#F6AA11',
        borderWidth:1
    },
    iteminfo:{
        fontSize:RFValue(9,580),
        color:'white',
        fontFamily:"Quicksand-Medium",
        marginLeft:5, 
        marginRight:10
    },
    content:{
        padding:24,
        paddingTop:10
    },
    label:{
        fontSize:RFValue(15,580),
        color:'black',
        fontFamily:'Quicksand-Medium',
        marginBottom:9
    },
    description:{
        fontSize:RFValue(12,580),
        color:'white',
        fontFamily:'Quicksand-Regular'
    },
    btntext:{
        color:'white',
        fontSize:RFValue(15,580),
        fontFamily:'Quicksand-Medium'
    },
    btn:{
        paddingLeft:24,
        paddingRight:24,
        paddingTop:12,
        paddingBottom:12,
        backgroundColor:'#F6AA11',
        borderRadius:21,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        shadowOpacity:0.16,
        shadowRadius:5,
        shadowOffset:{
            height:3,
            width:0
        }
    },
    videos:{
        padding:22
    },
    sectiontitle:{
        fontFamily:'Quicksand-Medium',
        fontSize:RFValue(18,580),
        color:'white'
    },
    btn_see:{
        borderRadius:15,
        paddingLeft:12,
        paddingRight:12,
        paddingTop:4,
        paddingBottom:4,
        borderColor:'#F6AA11',
        borderWidth:1
    },
    ratingcontainer:{
        padding:24
    },
    btncircle:{
        padding:8,
        backgroundColor:'#F6AA11',
        shadowOpacity:0.16,
        shadowRadius:5,
        shadowOffset:{
            height:3,
            width:0
        },
        borderRadius:16
    },
    modalinside:{
        backgroundColor:'white',
        borderRadius:17,
        padding:15
    },
    modaltitle:{
        fontSize:RFValue(18,580),
        fontFamily:'Quicksand-Medium',
        textAlign:'center',
        marginTop:16
    },
    modalcontainer:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        marginTop:10,
        marginBottom:10
    },
    btncontainer:{
        display:'flex',
        justifyContent:'center',
        padding:15,
        backgroundColor:'#F6AA11',
        borderRadius:35,
        flexDirection:'row',
        alignItems:'center',
        marginTop:10
    },
    btntext:{
        color:'white',
        fontSize:RFValue(18,580),
        fontFamily:'Montserrat-Medium'
    }
})