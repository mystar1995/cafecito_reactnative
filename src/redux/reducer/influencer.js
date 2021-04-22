import {SET_INFLUENCERS} from '../constant'

const initialstate = []

export default function influencers(state = initialstate,action)
{
    switch(action.type)
    {
        case SET_INFLUENCERS:
            return action.data
        default:
            return state;
    }
}