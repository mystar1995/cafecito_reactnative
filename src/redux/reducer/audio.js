import {SET_AUDIOCALL} from '../constant'

const initialstate = {
    audiocall:null,
    state:"",
    jsep:null,
    stream:null,
    remotestream:null
}

export default function audio(state = initialstate,action)
{
    switch(action.type)
    {
        case SET_AUDIOCALL:
            return {
                ...state,
                ...action.state
            }
        default:
            return state;
    }
}