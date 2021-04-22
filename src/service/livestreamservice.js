import axios from 'axios'
import config from '../config/config.json'

export async function createlivestream(data,token)
{
    var formdata = new FormData()
    for(let item in data)
    {
        formdata.append(item,data[item])
    }

    formdata.append('token',token)
    return await axios.post(config.apiurl + "/api/livestream/create",formdata,{headers:{'Content-Type':'multipart-formdata'}})
}

export async function getlivestream(token)
{
    return await axios.get(config.apiurl + "/api/livestream/get",{params:{token}})
}

export async function getparticipants(users)
{
    return axios.post(config.apiurl + "/api/livestream/getuser",{users})
}