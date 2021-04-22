import axios from 'axios'
import config from '../config/config.json'

export async function getposts(type)
{
    return await axios.get(config.apiurl + "/api/post/get",{params:{type}})
}

export async function getsetting()
{
    return await axios.get(config.apiurl + "/api/post/settings");
}