import {GET_VIDEO} from '../constant'

export function setvideo(videos)
{
    return {type:GET_VIDEO,data:videos}
}