import {SET_PODCAST} from '../constant'

const initialstate = []

export default function podcast(state = initialstate,action)
{
    switch(action.type)
    {
        case SET_PODCAST:
            return action.data;
        default:
            return state;
    }
}