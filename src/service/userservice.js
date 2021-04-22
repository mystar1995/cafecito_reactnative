import axios from 'axios'
import config from '../config/config.json'

export async function createuser(userinfo)
{
    return await axios.post(config.apiurl + "/api/user/create",userinfo);
}

export async function loginuser(userinfo)
{
    return await axios.post(config.apiurl + "/api/user/login",userinfo)
}

export async function loginwithsocial(user)
{
    return await axios.post(config.apiurl + "/api/user/loginwithsocial",{user})
}

export async function getuser(token)
{
    return await axios.get(config.apiurl + "/api/user/get",{params:{token}})
}

export async function setuserprofile(userinfo,token)
{
    return await axios.post(config.apiurl + "/api/user/set",{token,userinfo})
}

export async function getreviews(token)
{
    return await axios.get(config.apiurl + "/api/user/review",{params:{token}})
}

export async function getinfluencers(token)
{
    return await axios.get(config.apiurl + "/api/user/influencer",{params:{token}})
}

export async function updateprofile(userinfo,token)
{
    var formdata = new FormData();

    for(let item in userinfo)
    {
        formdata.append(item,userinfo[item])
    }
    formdata.append('token',token)

    return await axios.post(config.apiurl + "/api/user/update",formdata,{headers:{'Content-Type':"multipart-formdata"}})
}

export async function addcard(cardinfo,token)
{
    return await axios.post(config.apiurl + "/api/card/create",{cardinfo,token})
}

export async function getcard(token)
{
    return await axios.get(config.apiurl + "/api/card/get",{params:{token}})
}

export async function updateuserinfo(data,token)
{
    data.token = token;
    console.log(data)
    return await axios.post(config.apiurl + "/api/user/update",data)
}

export async function updatepassowrd(data,token)
{
    return await axios.post(config.apiurl + "/api/user/updatepassword",{data,token})
}

export async function getrequests(token)
{
    return await axios.get(config.apiurl + "/api/request/get",{params:{token}})
}

export async function changerequest(token,id,status)
{
    return await axios.post(config.apiurl + "/api/request/status",{token,id,status})
}

export async function submitreview(reviewinfo,token)
{
    return await axios.post(config.apiurl + "/api/review/submit",{reviewinfo,token})
}

export async function getreviewsforinfluencer(id,token)
{
    return await axios.get(config.apiurl + "/api/review/get",{params:{userid:id,token}})
}

export async function submitreply(id,reply,token)
{
    return await axios.post(config.apiurl + "/api/review/reply",{token,id,reply})
}

export async function submittoken(notifytoken,token)
{
    return await axios.post(config.apiurl + "/api/user/notifytoken",{token,notifytoken})
}

export async function submitdocument(profile,identify,email)
{
    var formdata = new FormData();
    formdata.append('profile',profile)
    formdata.append('idcard',identify)
    formdata.append('email',email)
    return await axios.post(config.apiurl + "/api/user/idcard",formdata,{headers:{'Content-Type':"multipart-formdata"}})
}

export async function submitfeedback(reviewinfo,token)
{
    return await axios.post(config.apiurl + "/api/feedback/create",{token,data:reviewinfo})
}