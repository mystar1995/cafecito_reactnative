let janus_call = null;
let videocall = null;

let janus_audio = null;
let opaqueId = "videocall-"+Janus.randomString(12);
import config from '../config/config.json'
import Janus from '../utils/JanusPromise'
import {setcallstate,setjsep,setstream,setvideocall,setremotestream} from '../redux/action/videocall'
import seterror from '../redux/action/error'


export function initvideocall(dispatch,userid,videoref)
{
    Janus.init({debug:'all',callback:function(){
        janus_call = new Janus({
            server:config.wsurl,
            success:function(){
                janus_call.attach({
                    plugin:'janus.plugin.videocall',
                    opaqueId,
                    success:function(pluginhandle){
                        videocall = pluginhandle
                        dispatch(setvideocall(videocall))
                        var body = {request:'list'}
                        videocall.send({message:body})
                    },
                    error: function(error) {
                        console.log('error',error);
                    },
                    consentDialog: function(on) {
                    },
                    mediaState: function(medium, on) {
                        Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
                    },
                    webrtcState: function(on) {
                        Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                    },
                    onmessage: function(msg, jsep) {
                        let result = msg['result'];
                        dispatch(setjsep(jsep))
                        if(result != null && result != undefined)
                        {
                            if(result['list'] != undefined && result['list'] != null)
                            {
                                if(result['list'].indexOf(userid + "_videocall") == -1)
                                {
                                    videocall.send({message:{request:'register',username:userid + "_videocall"}})
                                }

                                var list = []
                                for(let item in result['list'])
                                {
                                    list.push(result['list'][item].split('_')[0])
                                }
                                // if(result['list'].indexOf(userid + "_audiocall") == -1)
                                // {
                                //     videocall.send({message:{request:"register",username:userid + "_audiocall"}})
                                // }
                            }
                            else if(result['event'] != undefined && result['event'] != null)
                            {
                                var event = result['event'];
                                if(event == 'registered')
                                {
                                    var body = {request:'list'}
                                    videocall.send({message:body})
                                }
                                else if(event == 'incomingcall')
                                {
                                    dispatch(setcallstate(event))
                                    let username = result['username']
                                    if(username.split('_').length > 1)
                                    {
                                        if(username.search("audiocall") > -1)
                                        {
                                            videoref.current.navigate('AudioCall',{id:username.split('_')[0]})
                                        }
                                        else if(username.search('videocall') > -1)
                                        {
                                            videoref.current.navigate('VideoCall',{id:username.split('_')[0]})
                                        }
                                    }
                                    
                                }
                                else if(event == 'calling')
                                {
                                    dispatch(setcallstate(event))
                                }
                                else if(event == 'accepted')
                                {
                                    dispatch(setcallstate(event))
                                    if(jsep)
                                    {
                                        videocall.handleRemoteJsep({jsep})
                                    }
                                }
                                else if(event == 'updated')
                                {
                                    if(jsep)
                                    {
                                        if(jsep.type == 'answer')
                                        {
                                            videocall.handleRemoteJsep({jsep})
                                        }
                                        else
                                        {
                                            videocall.createAnswer({
                                                jsep,
                                                media:{data:true},
                                                success:function(jsep){
                                                    videocall.send({message:{request:'set'},jsep})
                                                },
                                                error:function(err)
                                                {
                                                    console.log(err)
                                                }
                                            })
                                        }
                                    }
                                }
                                else if(event == 'hangup')
                                {
                                    videoref.current.goBack()
                                    videocall.hangup()
                                }
                            }
                        }
                        else
                        {

                        }
                    },
                    onlocalstream:(stream)=>{
                        dispatch(setvideocall(videocall))
                        dispatch(setstream(stream.toURL()))
                    },
                    onremotestream:function(stream)
                    {
                        dispatch(setremotestream(stream.toURL()))
                    }
                })
            }
        })
    }})
}

export function destroyvideocall()
{
    if(janus_call)
    {
        janus_call.destroy()
    }

}

export function initaudiocall(dispatch,userid,audioref)
{
    Janus.init({debug:'all',callback:function(){
        janus_call = new Janus({
            server:config.wsurl,
            success:function(){
                janus_call.attach({
                    plugin:'janus.plugin.videocall',
                    opaqueId,
                    success:function(pluginhandle){
                        videocall = pluginhandle
                        dispatch(setvideocall(videocall))
                        var body = {request:'list'}
                        videocall.send({message:body})
                    },
                    error: function(error) {
                        console.log('error',error);
                    },
                    consentDialog: function(on) {
                    },
                    mediaState: function(medium, on) {
                        Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
                    },
                    webrtcState: function(on) {
                        Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                    },
                    onmessage: function(msg, jsep) {
                        let result = msg['result'];
                        console.log('onmsg',msg)
                        dispatch(setjsep(jsep))
                        if(result != null && result != undefined)
                        {
                            if(result['list'] != undefined && result['list'] != null)
                            {
                                if(result['list'].indexOf(userid + "_videocall") == -1)
                                {
                                    videocall.send({message:{request:'register',username:userid + "_videocall"}})
                                }
                            }
                            else if(result['event'] != undefined && result['event'] != null)
                            {
                                var event = result['event'];
                                if(event == 'incomingcall')
                                {
                                    dispatch(setcallstate(event))
                                    let username = result['username']
                                    if(username.split('_').length > 1)
                                    {
                                        if(username.search("audiocall") > -1)
                                        {
                                            videoref.current.navigate('AudioCall',{id:username.split('_')[0]})
                                        }
                                    }
                                    
                                }
                                else if(event == 'calling')
                                {
                                    dispatch(setcallstate(event))
                                    let username = result['username']
                                    if(username.split('_').length > 1)
                                    {
                                        if(username.search('videocall') > -1)
                                        {
                                            videoref.current.navigate('VideoCall',{id:username.split('_')[0]})
                                        }
                                    }
                                }
                                else if(event == 'accepted')
                                {
                                    dispatch(setcallstate(event))
                                    if(jsep)
                                    {
                                        videocall.handleRemoteJsep({jsep})
                                    }
                                }
                                else if(event == 'updated')
                                {
                                    if(jsep)
                                    {
                                        if(jsep.type == 'answer')
                                        {
                                            videocall.handleRemoteJsep({jsep})
                                        }
                                        else
                                        {
                                            videocall.createAnswer({
                                                jsep,
                                                media:{data:true},
                                                success:function(jsep){
                                                    videocall.send({message:{request:'set'},jsep})
                                                },
                                                error:function(err)
                                                {
                                                    console.log(err)
                                                }
                                            })
                                        }
                                    }
                                }
                                else if(event == 'hangup')
                                {
                                    videoref.current.goBack()
                                }
                            }
                        }
                    },
                    onlocalstream:(stream)=>{
                        dispatch(setstream(stream.toURL()))
                    }
                })
            }
        })
    }})
}