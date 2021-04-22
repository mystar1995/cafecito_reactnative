import {SET_LIVESTREAMS} from '../constant'

const initialstate = []

export default function livestream(state = initialstate,action)
{
    switch(action.type)
    {
        case SET_LIVESTREAMS:
            return action.data
        default:
            return state;
    }
}