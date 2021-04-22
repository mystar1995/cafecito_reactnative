import {SET_PRODUCT} from '../constant'

const initialstate = []

export default function product(state = initialstate,action)
{
    switch(action.type)
    {
        case SET_PRODUCT:
            return action.data
        default:
            return state
    }
}