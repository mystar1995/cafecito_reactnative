import {GET_VIDEO} from '../constant'

const initialstate = []

export default function video(state = initialstate,action)
{
    switch(action.type)
    {
        case GET_VIDEO:
            return action.data
        default:
            return state
    }
}