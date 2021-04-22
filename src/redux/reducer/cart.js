import {SET_PRODUCT_CART} from '../constant'

const initialstate = []


export default function cart(state = initialstate,action)
{
    switch(action.type)
    {
        case SET_PRODUCT_CART:
            return action.data
        default:
            return state
    }
}