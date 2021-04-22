import axios from 'axios'
import config from '../config/config.json'

export async function createmessage(data,token)
{
    console.log(data)
    var formdata = new FormData();
    for(let item in data)
    {
        formdata.append(item,data[item])
    }
    
    formdata.append('token',token)

    return await axios.post(config.apiurl + "/api/message/create",formdata,{headers:{'Content-Type':'multipart-formdata'}})
}

export async function getlivestreammessage(livestreamid)
{
    return await axios.get(config.apiurl + "/api/message/livestream",{params:{livestreamid}})
}

export async function getusers(text,token)
{
    return await axios.get(config.apiurl + "/api/message/user",{params:{user:text,token}})
}

export async function getmessage(user,token)
{
    return await axios.get(config.apiurl + "/api/message/get",{params:{user,token}})
}

export async function accept(userid,token)
{
    return await axios.post(config.apiurl + "/api/message/accept",{userid,token})
}

export async function reject(userid,token)
{
    return await axios.post(config.apiurl + "/api/message/reject",{userid,token})
}