import axios from 'axios'
import config from '../config/config.json'

export async function addfeedurl(feed,token)
{
    return await axios.post(config.apiurl + "/api/podcast/create",{url:feed,token})
}

export async function getfeed(id,token)
{
    return await axios.get(config.apiurl + "/api/podcast/getbyid",{params:{id,token}})
}

export async function getpodcasts(token)
{
    return await axios.get(config.apiurl + "/api/podcast/get",{params:{token}})
}

export async function getepisode(id,token)
{
    return await axios.get(config.apiurl + "/api/episode/get",{params:{token,id}})
}