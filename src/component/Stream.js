import React,{useEffect,useCallback,useImperativeHandle,useRef,useState,forwardRef} from 'react'
import {StyleSheet,View,Dimensions} from 'react-native'
import Janus from '../utils/JanusPromise'
import config from '../config/config.json'
import {RTCView} from 'react-native-webrtc'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'

let janus = null
let sfu = null
let opaqueId = 'sfutest-' + Janus.randomString(12);
let remoteFeed = null;
let bitrateTimer = [];

let dimensions = {
    //get dimensions of the device to use in view styles
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};

function propsAreEqual(prev, next) {
    return prev.channelid === next.channelid;
}
const Stream = ({
    channelid,
    publisher = false,
    onStopBroadCasting = () => {},
    updateStreamStatus = () => {},
    onReady = () => {},
    onStartBroadCasting = () => {},
    onStartListening = () => {}
},ref) =>
{
    const [state,setstate] = useState({
        visible:false,
        selfViewSrc: null,
        selfViewSrcKey: null,
        selfMirror: true,
        remoteViewSrc: null,
        remoteViewSrcKey: null,
    })
    
    const published = useRef(null)
    const globalJsep = useRef(null);
    const initConfigured = useRef(false);

    const {visible,selfViewSrc,selfViewSrcKey,remoteViewSrcKey,remoteViewSrc,selfMirror} = state

    useImperativeHandle(ref, () => ({
        callStartBroadCasting() {
            startBroadCasting(true);
        },
        callStopBroadCasting() {
            stopStreaming();
        },
        callDestroyLiveStream() {
            destroyJanus();
        },
        callToggleAudioMute() {
            toggleAudioMute();
        },
        callSwitchVideoType() {
            switchVideoType();
        },
        callToggleVideoMute(){
            toggleVideoMute()
        }
    }));

    useEffect(()=>{
        console.log('janus started',visible)
        setstate({...state,visible:false})
        JanusStart()
        return () => {}
    },[])

    const JanusStart = useCallback(()=>{
        console.log('janus start');
        Janus.init({
            debug:false,
            callback:function(){
                JanusInit()
            }
        })
    },[visible,selfViewSrc,selfViewSrcKey,published])

    console.log('publisher',publisher)
    const JanusInit = ()=>{
        console.log('video room element',visible)
        if(visible)
        {
            return
        }
        console.log('video room element')
        setstate({...state,visible:true})
        
        janus = new Janus({
            server: config.wsurl,
            opaqueId,
            success: () => {
                janus.attach({
                    plugin: 'janus.plugin.videoroom',
                    opaqueId: opaqueId,
                    success: (pluginHandle) => {
                        sfu = pluginHandle;
                        Janus.log(
                            'Plugin attached! (' + sfu.getPlugin() + ', id=' + sfu.getId() + ')',
                        );

                        if (publisher) {
                            existStreaming();
                        } else {
                            getParticipants();
                        }
                    },
                    error: (error) => {
                        Janus.error('  -- Error attaching plugin...', error);
                        // Alert.alert('  -- Error attaching plugin...', error);
                    },
                    consentDialog: (on) => {
                        Janus.debug('Consent dialog should be ' + (on ? 'on' : 'off') + ' now');
                    },
                    mediaState: (medium, on) => {
                        Janus.log(
                            'Janus ' + (on ? 'started' : 'stopped') + ' receiving our ' + medium,
                        );
                    },
                    webrtcState: (on) => {
                        Janus.log(
                            'Janus says our WebRTC PeerConnection is ' +
                                (on ? 'up' : 'down') +
                                ' now',
                        );
                    },
                    onmessage: (msg, jsep) => {
                        //console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶', msg, '🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
                        const event = msg.videoroom;
                        if (event !== undefined && event !== null) {
                            if (event === 'joined') {
                                console.log('MESSAGE JOINED', msg);
                                if (msg.publishers !== undefined && msg.publishers !== null) {
                                    var list = msg.publishers;
                                    if (!publisher) {
                                        /* for (var f in list) {
											var id = list[f].id; //	 publisherId
											newRemoteFeed(id);
										} */
                                    } else {
                                        publishOwnFeed(true);
                                    }
                                }
                            } else if (event === 'destroyed') {
                            } else if (event === 'success') {
                            } else if (event === 'event') {
                                console.log('xxxx-videoRoom eventIs: event', msg);
                                if (msg.configured) {
                                    if (!initConfigured.current) {
                                        initConfigured.current = true;
                                    } else {
                                        onStartBroadCasting();
                                        published.current = true;
                                        setstate((s) => ({...s, visible: false}));
                                    }
                                } else if (msg.error !== undefined && msg.error !== null) {
                                    // janus && janus.destroy();
                                    setstate((s) => ({...s, visible: false}));
                                } else if (
                                    msg.unpublished !== undefined &&
                                    msg.unpublished !== null
                                ) {
                                    var unpublished = msg.unpublished;

                                    if (unpublished === 'ok') {
                                        janus && janus.destroy();
                                    }
                                }
                                // Any new feed to attach to?
                                if (msg.publishers !== undefined && msg.publishers !== null) {
                                    var list = msg.publishers;
                                    Janus.log('Got a list of available publishers/feeds:');
                                    Janus.log('publishers: ' + JSON.stringify(list));
                                    if (!publisher && list.length > 0) {
                                        var id = list[0].id; // publisherId
                                        newRemoteFeed(id);
                                    }
                                }
                            } else if (event === 'participants') {
                                if (!publisher) {
                                    var participants = msg.participants;
                                    let publisherId = null;
                                    for (let item in participants) {
                                        if (participants[item].publisher) {
                                            publisherId = participants[item].id;
                                            break;
                                        }
                                    }
                                    if (publisherId) {
                                        newRemoteFeed(publisherId);
                                    } else {
                                        setstate((s) => ({...s, visible: false}));
                                    }
                                } else {
                                }
                            }
                        }
                        if (jsep !== undefined && jsep !== null) {
                            Janus.log('Handling SDP as well...');
                            // Janus.log('jsep: ' + JSON.stringify(jsep));
                            sfu.handleRemoteJsep({jsep: jsep});
                        }
                    },
                    onlocalstream: (stream) => {
                        Janus.log('onlocalstream');
                        Janus.log('🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓', stream.toURL());
                        Janus.debug(' ::: Got a local stream :::');
                        Janus.debug(stream);
                        setstate((s) => ({
                            ...s,
                            selfViewSrc: stream.toURL(),
                            selfViewSrcKey: Math.floor(Math.random() * 1000) + 1,
                        }));
                    },
                    onremotestream: (stream) => {},
                    ondataopen: function (data) {
                        Janus.log('The DataChannel is available!');
                    },
                    ondata: function (data) {
                        Janus.debug('We got data from the DataChannel! ' + data);
                    },
                    oncleanup: function () {
                        Janus.log(' ::: Got a cleanup notification :::');
                    },
                });
            },
            error: (error) => {
                Janus.error('  Janus Error', error);
                Alert.alert('  Janus Error', error);
                setstate((s) => ({...s, visible: false}));
            },
            destroyed: () => {
                sfu && sfu.detach();
                sfu = null;
                setstate((s) => ({...s, visible: false}));
                onStopBroadCasting(published.current);
            },
        });

    }

    const startStreaming = useCallback(()=>{
        sfu && sfu.send({
            message:{request:"create",room:channelid,videoorient_ext: false},
            success: (roomInfo) => {
                Janus.log('ROOM INFO', roomInfo);
                joinPublish();
            },
            error: (error) => {
                joinPublish();
                Janus.error('Cannot create room');
            }
        })
    },[])



    const joinPublish = useCallback(() => {
        let joinAndConfigureData = {
            request: 'joinandconfigure',
            ptype: 'publisher',
            room: channelid,
            id: sfu.getId(),
            videoorient_ext: false
        };

        sfu &&
            sfu.send({
                message: joinAndConfigureData,
                success: () => {},
                error: (error) => {
                    Janus.error('Cannot join room');
                },
            });
        },[])

    const publishOwnFeed = useCallback((useAudio) => {
        sfu.createOffer({
            media: {
                audioRecv: false,
                videoRecv: false,
                audioSend: useAudio,
                videoSend: true,
            },
            success: function (jsep) {
                console.log('publish own feed')
                globalJsep.current = jsep;
                startBroadCasting()
                onReady();
            },
            error: function (error) {
                if (useAudio) {
                    publishOwnFeed(false);
                }
                Janus.error('WebRTC error...', error);
                Alert.alert('WebRTC error... ' + error);
            },
        });
    }, []);

    const existStreaming = useCallback(()=>{
        var data = {request:"exists",room:channelid}
        console.log(data)
        sfu && sfu.send({
            message:data,
            success:function(msg){
                Janus.log('exist onmessage', msg);
                if (msg.exists) {
                    joinPublish();
                } else {
                    startStreaming();
                }
            },
            error: (error) => {}            
        })
    },[])

    const getParticipants = useCallback(() => {
        var data = {request: 'listparticipants', room: channelid};
        sfu &&
            sfu.send({
                message: data,
                success: function (message) {},
                error: (error) => {},
            });
    }, []);

    const switchVideoType = useCallback(() => {
        sfu && sfu.changeLocalCamera();
        /*  if (!isBack.current) {
            setState((s) => ({...s, selfMirror: true}));
        } else {
            setState((s) => ({...s, selfMirror: false}));
        } */
    }, [selfMirror]);

    const toggleAudioMute = useCallback(() => {
        let muted = sfu.isAudioMuted();
        if (muted) {
            sfu.unmuteAudio();
        } else {
            sfu.muteAudio();
        }
        
    }, []);

    const toggleVideoMute = useCallback(() => {
        let muted = sfu.isVideoMuted();
        console.log('videomuted',muted)
        if (muted) {
            sfu.unmuteVideo();
        } else {
            sfu.muteVideo();
        }
    }, []);

    const stopStreaming = useCallback(() => {
        setstate((s) => ({...s, selfViewSrc: null, remoteViewSrc: null}));
        if (!published.current) {
            destroyJanus();
        } else {
            destroyStreaming();
        }
    }, [selfViewSrc, remoteViewSrc]);

    const destroyStreaming = useCallback(() => {
        if (!publisher) {
            sfu &&
                sfu.send({
                    message: {request: 'leave'},
                    success: () => {
                        Janus.log('success leave room');
                        janus && janus.destroy();
                    },
                    error: (error) => {
                        Janus.error('Cannot leave room');
                    },
                });
        } else {
            sfu &&
                sfu.send({
                    message: {request: 'unpublish'},
                    success: () => {
                        //console.log('success unpublish room');
                        // Janus.log('success unpublish room');
                        // janus && janus.destroy();
                    },
                    error: (error) => {
                        Janus.error('Cannot leave room');
                    },
                });
        }
    }, []);

    const destroyJanus = useCallback(() => {
        console.log('destroy')
        janus && janus.destroy();
    }, []);

    const startBroadCasting = useCallback(
        (useAudio) => {
            Janus.log('Start LocalStream');
            Janus.debug('Got SDP!');
            Janus.debug(globalJsep.current);
            const publishData = {
                // request: 'publish',
                request: 'configure',
                videoorient_ext: false,
                audio: useAudio,
                video: true,
            };
            sfu &&
                sfu.send({
                    message: publishData,
                    jsep: globalJsep.current,
                    success: () => {
                        // console.log('onStartBroadCasting call');
                        // onStartBroadCasting();
                        // published.current = true;
                    },
                    error: (error) => {
                        Janus.error('Cannot configure room');
                    },
                });
            sfu && sfu.send({message: publishData, jsep: globalJsep.current});
        },
        [published],
    );

    const newRemoteFeed = useCallback(
        (id) => {
            janus.attach({
                plugin: 'janus.plugin.videoroom',
                opaqueId: opaqueId,
                success: (pluginHandle) => {
                    remoteFeed = pluginHandle;
                    let listen = {
                        request: 'join',
                        room: channelid,
                        ptype: 'subscriber',
                        feed: id,
                    };
                    remoteFeed.send({
                        message: listen,
                        success: () => {},
                        error: (error) => {
                            console.log('error', error);
                        },
                    });
                },
                error: (error) => {
                    // Alert.alert('  -- Error attaching plugin...', error);
                    setstate((s) => ({...s, visible: false}));
                },
                onmessage: (msg, jsep) => {
                    console.log('🌶🌶🌶🌶🌶==remote onmessage==🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶', msg, '🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
                    let event = msg.videoroom;
                    if (event !== undefined && event !== null) {
                        if (event === 'attached') {
                        } else if (event === 'event') {
                            console.log('xxxx-videoRoom eventIs: event', msg);
                            if (msg.started) {
                                onStartListening();
                                setstate((s) => ({...s, visible: false}));
                            } else if (msg.error !== undefined && msg.error !== null) {
                                setstate((s) => ({...s, visible: false}));
                            }
                        }
                    }
                    if (jsep !== undefined && jsep !== null) {
                        Janus.log('xxx-newRemoteFeed func - Handling SDP as well...');
                        remoteFeed.createAnswer({
                            jsep: jsep,
                            media: {audioSend: false, videoSend: false},
                            success: (jsep) => {
                                Janus.log('xxx-newRemoreFeed Success: createAnswer cbFunc');
                                let body = {request: 'start', room: id};
                                remoteFeed.send({message: body, jsep: jsep});
                            },
                            error: (error) => {
                                // console.log('WebRTC error:', error);
                            },
                        });
                    }
                },
                webrtcState: (on) => {},
                onlocalstream: (stream) => {},
                onremotestream: (stream) => {
                    console.log('🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩', stream.toURL());
                    Janus.debug(' ::: Got a remote stream :::');
                    Janus.debug(stream);
                    setstate((s) => ({
                        ...s,
                        remoteViewSrc: stream.toURL(),
                        remoteViewSrcKey: Math.floor(Math.random() * 1000) + 2,
                    }));
                },
                oncleanup: () => {
                    if (remoteFeed.spinner !== undefined && remoteFeed.spinner !== null) {
                        remoteFeed.spinner.stop();
                    }
                    remoteFeed.spinner = null;
                    if (
                        bitrateTimer[remoteFeed.rfindex] !== null &&
                        bitrateTimer[remoteFeed.rfindex] !== null
                    ) {
                        clearInterval(bitrateTimer[remoteFeed.rfindex]);
                    }
                    bitrateTimer[remoteFeed.rfindex] = null;
                },
            });
        },
        [visible, remoteViewSrc, remoteViewSrcKey],
    );

    console.log(selfViewSrc)
    
    return (
        <View style={styles.streamFullView}>
            {publisher && selfViewSrc && (
                <RTCView
                    key={selfViewSrcKey}
                    streamURL={selfViewSrc}
                    style={{flex: 1, width:wp('100'), height: hp('100')}}
                    // mirror={selfMirror}
                />
            )}
            {!publisher && remoteViewSrc && (
                <RTCView key={remoteViewSrcKey} streamURL={remoteViewSrc} style={{flex: 1}} />
            )}
            {/* <Spinner visible={visible} textContent={'One moment...'} textStyle={{color: '#fff'}} /> */}
        </View>
    );
}

export default React.memo(forwardRef(Stream, propsAreEqual));

const styles = StyleSheet.create({
    streamFullView: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: dimensions.width,
        height: dimensions.height
    },
});