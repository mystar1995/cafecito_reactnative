import {SET_CALLSTATE,SET_VIDEOCALL,SET_JSEP,SET_STREAM,SET_REMOTE_STREAM} from '../constant'

const initialstate = {
    videocall:null,
    state:"",
    jsep:null,
    stream:null,
    remotestream:null
}

export default function videocall(state = initialstate,action)
{
    switch(action.type)
    {
        case SET_VIDEOCALL:
            return {
                ...state,
                videocall:action.videocall
            }
        case SET_CALLSTATE:
            return {
                ...state,
                state:action.state
            }
        case SET_JSEP:
            return {
                ...state,
                jsep:action.jsep
            }
        case SET_STREAM:
            return {
                ...state,
                stream:action.stream
            }
        case SET_REMOTE_STREAM:
            return {
                ...state,
                remotestream:action.stream
            }
        default:
            return state;
    }
}