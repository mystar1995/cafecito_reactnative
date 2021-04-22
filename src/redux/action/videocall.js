import {SET_VIDEOCALL,SET_CALLSTATE,SET_JSEP,SET_STREAM,SET_REMOTE_STREAM} from '../constant'

export function setvideocall(videocall)
{
    return {type:SET_VIDEOCALL,videocall}
}

export function setjsep(jsep)
{
    return {type:SET_JSEP,jsep}
}

export function setcallstate(state)
{
    return {type:SET_CALLSTATE,state}
}

export function setstream(stream)
{
    return {type:SET_STREAM,stream}
}

export function setremotestream(stream)
{
    return {type:SET_REMOTE_STREAM,stream}
}