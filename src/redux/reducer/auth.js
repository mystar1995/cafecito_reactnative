import {SET_PROFILE,SET_USER_PROFILE,SET_CARD_INFO,SET_REQUESTS} from '../constant'

const initialstate = {
    token:"",
    userinfo:null,
    cards:[]
}

export default function auth(state = initialstate,action)
{
    switch(action.type)
    {
        case SET_PROFILE:
            return {
                ...state,
                userinfo:action.userinfo,
                token:action.token
            }
        case SET_USER_PROFILE:
            return {
                ...state,
                userinfo:{
                    ...state.userinfo,
                    ...action.data
                }
            }
        case SET_CARD_INFO:
            return {
                ...state,
                cards:action.data
            }
        
        case SET_REQUESTS:
            return {
                ...state,
                requests:action.data
            }
        default:
            return state;
    }
    
}