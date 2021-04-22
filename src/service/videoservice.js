import axios from 'axios'
import config from '../config/config.json'

export async function addvideo(video,title,coverimage,token)
{
    console.log(coverimage)
    var formdata = new FormData()
    formdata.append("title",title)
    formdata.append("video",video)
    formdata.append('coverimage',coverimage)
    formdata.append('token',token)
    return await axios.post(config.apiurl + "/api/video/create",formdata,{headers:{'Content-Type':'multipart-formdata'}})
}

export async function getvideo(token,me)
{
    return await axios.get(config.apiurl + "/api/video/get",{params:{token,me}})
}

export async function islikevideo(token,id)
{
    return await axios.get(config.apiurl + "/api/video/islike",{params:{token,id}})
}

export async function likevideo(token,id)
{
    return await axios.post(config.apiurl + "/api/video/like",{token,id})
}

export async function deletevideo(token,id)
{
    return await axios.post(config.apiurl + "/api/video/delete",{token,id})
}

export async function getuservideo(token,userid)
{
    return await axios.get(config.apiurl + "/api/video/user",{params:{token,userid}})
}