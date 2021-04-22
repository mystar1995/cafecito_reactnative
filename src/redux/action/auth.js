import {SET_PROFILE,SET_USER_PROFILE,SET_CARD_INFO,SET_REQUESTS} from '../constant'
export function setuserinfo(token,userinfo)
{
    return {type:SET_PROFILE,token,userinfo}
}

export function setprofileinfo(profile)
{
    return {type:SET_USER_PROFILE,data:profile}
}

export function setcardinfo(card)
{
    return {type:SET_CARD_INFO,data:card}
}
