import React,{forwardRef,useEffect,useImperativeHandle, useState,useCallback} from 'react'
import {View,TouchableOpacity,StyleSheet,TextInput} from 'react-native'
import Janus from '../utils/JanusPromise'
import Fontiso from 'react-native-vector-icons/Fontisto'
import IonIcons from 'react-native-vector-icons/Ionicons'
import config from '../config/config.json'
import {useSelector} from 'react-redux'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
function propsAreEqual(prev, next) {
    return prev.channelid === next.channelid;
}

let janus = null;
let textroom = null;
let transactions = {}
let opaqueId = 'sfutest-' + Janus.randomString(12);

const Chat = ({
    channelid,
    to = false,
    onparticipant = () => {},
    onmessage = (data) => {},
    onjoin = () => {},
    onsendmessage = () => {}
},ref) => {
    const [state,setstate] = useState({
        visible:false,
        text:""
    })

    console.log(channelid)
    const {userinfo} = useSelector(state=>state.auth)

    const {visible} = state

    useEffect(()=>{
        setstate({...state,visible:false})
        janusstart()
        return ()=>{
            leave()
            if(janus)
            {
                janus.destroy()
            }
        }
    },[channelid])

    const janusstart = useCallback(()=>{
        Janus.init({
            debug:false,
            callback:function(){
                janusinit()
            }
        })
    },[visible])

    const leave = () => {
        if(!textroom)
        {
            return
        }
        var request = {textroom:"leave",room:channelid}
        textroom.data({
            text:JSON.stringify(request),
            success:function(message){

            }
        })
    }

    const checkexit = () => {
        let transaction = Janus.randomString(12);
        transactions[transaction] = function(response)
        {
            console.log('messageres',response);
        }

        var request = {textroom:'exists',room:channelid,transaction:transaction};
        textroom.data({
            text:JSON.stringify(request),
            error:function(err)
            {
                console.log(err);
            },
            success:function(message)
            {
                console.log('reponsemessage',message);
            }
        });
    }

    const join = useCallback(()=>{
        let transaction = Janus.randomString(12);
        var request = {textroom:'join',room:channelid,username:userinfo.id + "",transaction};
        textroom.data({text:JSON.stringify(request),success:function(){
            var request = {textroom:'listparticipants',room:channelid,transaction:Janus.randomString(12)};
            textroom.data({text:JSON.stringify(request)})
        }})
    },[visible])

    const create_room = useCallback(()=>{
        let transaction = Janus.randomString(12)
        let request = {textroom:'create',room:channelid,transaction}
        textroom.data({text:JSON.stringify(request)})
    },[visible])

    const janusinit = useCallback(()=>{
        if(visible)
        {
            return;
        }
        
        janus = new Janus({
            server:config.wsurl,
            opaqueId,
            success:()=>{
                
                janus.attach({
                    plugin:"janus.plugin.textroom",
                    opaqueId,
                    success:function(pluginHandle){
                        console.log('event janus');
                        textroom = pluginHandle;
                        let body = {request:'setup'};
                        textroom.send({message:body})
                    },
                    error: function(error) {
                        console.error("  -- Error attaching plugin...", error);
                        //alert("Error attaching plugin..." + error);
                    },
                    iceState: function(state) {
                        console.log("xxx-inTo textRoom iceState cbFunc");
                        console.log("xxx-textRoom iceState is now: " + state);
                    },
                    webrtcstate: function(on) {
                        console.log("xxx-inTo textRoom webrtcState cbFunc");
                        Janus.log("Janus response - WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                    },
                    onmessage:function(msg,jsep)
                    {
                        console.log('msg',msg)
                        if(msg['error'] != undefined && msg['error'] != null)
                        {
                            console.log(msg['error'])
                        }

                        if(jsep != undefined && jsep != null)
                        {
                            textroom.createAnswer({
                                jsep,
                                media:{ audioRecv: false, videoRecv: false,audioSend:false,videoSend:false, data: true },
                                success:function(jsep)
                                {
                                    var body = {request:'ack'}
                                    textroom.send({message:body,jsep})
                                },
                                error:function(error){
                                    Janus.error("WebRTC error:", error);
                                }
                            })
                        }
                    },
                    ondataopen:function(data){
                        console.log("xxx-textRoom ondataopen cbFunc");
                        Janus.log("The DataChannel is available!");
                        console.log('ondata',data);
                        checkexit()
                    },
                    ondata:function(data){
                        data = JSON.parse(data)
                        console.log('ondata',data)
                        var event = data['textroom']
                        
                        if(event == undefined)
                        {
                            if(data.participants)
                            {
                                let list = []
                                for(let item in data.participants)
                                {
                                    if(data.participants[item].username == userinfo.id)
                                    {
                                        list.push(data.participants[item].username)
                                    }
                                }

                                onparticipant(list)
                            }
                        }
                        else if(event == 'success')
                        {
                            if(data['exists'] != undefined)
                            {
                                if(data['exists'])
                                {
                                    join()
                                }
                                else
                                {
                                    create_room()
                                }
                            }
                            else if(data['permanent'] != undefined)
                            {
                                join()
                            }
                        }
                        else if(event == 'message')
                        {
                            onmessage({from:data.from,message:data.message})
                        }
                        else if(event == 'join')
                        {
                            if(data.username != userinfo.id)
                            {
                                onjoin(data.username)
                            }
                        }
                    },
                    oncleanup: function() {
                        console.log("xxx-textRoom oncleanup cbFunc");
                        Janus.log(" ::: Got a cleanup notification :::");
                    }
                })
            },
            error:(err)=>{
                console.log('error',err)
                setstate({...state,visible:false})
            },
            destroyed:()=>{
                setstate({...state,visible:false})
            }
        })
    },[visible])

    const sendmessage = () => {
        if(state.text)
        {
            var request = {textroom:"message",transaction:Janus.randomString(12),room:channelid,text:state.text}
            if(to)
            {
                request.to = to
            }
            textroom.data({
                text:JSON.stringify(request),
                success:function()
                {
                    var data = {from:userinfo.id,message:state.text}
                    console.log('sendmessage',data)
                    setstate({...state,text:""})
                    onsendmessage(data)
                },
                error:function(){
                    console.log('error')
                }
            })
        }
    }

    return (
        <View style={style.chatcontainer}>
            <Fontiso color="#BFC4D3" size={RFValue(23,580)} name="smiley"></Fontiso>
            <TextInput style={{flex:1,marginLeft:15,marginRight:15,color:'white'}} placeholder="Send Chat" placeholderTextColor='white' onChangeText={value=>setstate({...state,text:value})} value={state.text}></TextInput>
            <TouchableOpacity onPress={sendmessage}>
                <IonIcons name="send" color="#F6AA11" size={RFValue(23,580)}></IonIcons>
            </TouchableOpacity>
        </View>
    )
}

export default React.memo(forwardRef(Chat,propsAreEqual))

const style = StyleSheet.create({
    chatcontainer:{
        backgroundColor:'#2B2A29',
        display:'flex',
        flexDirection:'row',
        paddingLeft:15,
        paddingRight:15,
        paddingTop:5,
        paddingBottom:5,
        alignItems:'center'
    },
})