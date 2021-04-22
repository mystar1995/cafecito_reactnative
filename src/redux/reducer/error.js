import {SET_ERROR} from '../constant'

const initialstate = ""

export default function error(state = initialstate,action)
{
    switch(action.type)
    {
        case SET_ERROR:
            return action.error
        default:
            return state
    }
}