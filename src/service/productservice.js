import axios from 'axios'
import config from '../config/config.json'

export async function addproduct(productinfo,token)
{
    var formdata = new FormData()
    for(let item in productinfo)
    {
        formdata.append(item,productinfo[item])
    }

    formdata.append('token',token)
    return await axios.post(config.apiurl + "/api/product/create",formdata)
}

export async function updateproductinfo(productinfo,token)
{
    var formdata = new FormData()

    for(let item in productinfo)
    {
        formdata.append(item,productinfo[item])
    }

    formdata.append('token',token)

    return await axios.post(config.apiurl + "/api/product/update",formdata)
}

export async function getproducts(token)
{
    return await axios.get(config.apiurl + "/api/product/get",{params:{token}})
}

export async function deleteproduct(id,token)
{
    return await axios.post(config.apiurl + "/api/product/delete",{id,token})
}

export async function createpayment(payment,token)
{
    return await axios.post(config.apiurl + "/api/card/payment",{...payment,token})
}

export async function addtocart(cartinfo,token)
{
    return await axios.post(config.apiurl + "/api/product/cart/create",{cartinfo,token})
}

export async function updatecart(cartinfo,id,token)
{
    return await axios.post(config.apiurl + "/api/product/cart/update",{id,cartinfo,token})
}

export async function deletecart(id,token)
{
    return await axios.post(config.apiurl + "/api/product/cart/delete",{id,token})
}

export async function getcart(token)
{
    return await axios.get(config.apiurl + "/api/product/cart/get",{params:{token}})
}

export async function clearcart(token)
{
    return await axios.post(config.apiurl + "/api/product/cart/clear",{token})
}

export async function getpaymenthistory(token)
{
    return await axios.get(config.apiurl + "/api/card/history",{params:{token}})
}

export async function getnotification(token)
{
    return await axios.get(config.apiurl + "/api/notification/get",{params:{token}})
}