import React,{useRef,useEffect, useState} from 'react'
import {View,StyleSheet,ImageBackground,TouchableOpacity,Text,Image,ScrollView,FlatList,TextInput} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ScalingDrawer from 'react-native-scaling-drawer'
import {RFValue} from 'react-native-responsive-fontsize'
import Sidebar from '../component/Sidebar'
import AntDesign from 'react-native-vector-icons/AntDesign'
import ChatItem from '../component/ChatItem'
import {getusers} from '../service/messageservice'
import {useSelector} from 'react-redux'
export default function Chat({navigation})
{
    let drawer = useRef(null)
    
    const [user,setuser] = useState([])
    const [update,setupdate] = useState(false)
    const [text,settext] = useState("")
    const {token} = useSelector(state=>state.auth)

    useEffect(()=>{
        navigation.addListener('focus',()=>{
            getusers("",token).then(res=>{
                console.log('focus update 1')
                if(res.data.success)
                {
                    setuser(res.data.data)
                }
            }).catch(err=>console.log(err))
        })
    },[])

    useEffect(()=>{
        getusers(text,token).then(res=>{
            console.log('focus update 1')
            if(res.data.success)
            {
                setuser(res.data.data)
            }
        }).catch(err=>console.log(err))
    },[text,update])

    const updatedata = () => {
        setupdate(!update)
    }

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
                    <Text style={style.title}>Chats</Text>
                    <TouchableOpacity style={style.righticon}>
                        
                    </TouchableOpacity>
                </View>
                <View style={style.inputcontainer}>
                    <TextInput style={{flex:1,color:'white'}} placeholder="Search" placeholderTextColor='white' value={text} onChangeText={value=>settext(value)}></TextInput>
                    <AntDesign name="search1" color="white" size={RFValue(17,580)}></AntDesign>
                </View>
                <ScrollView style={{marginTop:15,marginBottom:15}}>
                    <View style={{marginBottom:15}}>
                        <FlatList
                            data={user}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={({item,index})=>index}
                            renderItem={({item,index})=><ChatItem userinfo={item} key={index} navigation={navigation} updatedata={updatedata}></ChatItem>}
                        ></FlatList>
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
        paddingLeft:24,
        paddingRight:24,
        paddingTop:24
    },
    righticon:{
        width:wp('9%'),
        height:wp('9%'),
        borderRadius:wp('5%'),
        justifyContent:'center',
        alignItems:'center'
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
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'#252525',
        borderRadius:28,
        marginTop:20,
        alignItems:'center',
        shadowColor:'black',
        shadowOpacity:0.16,
        elevation:3,
        shadowOffset:{
            height:3,
            width:0
        },
        shadowRadius:5,
        marginLeft:24,
        marginRight:24
    }
})