import {SET_ERROR} from '../constant'

export default function seterror(error)
{
    return {type:SET_ERROR,error}
}