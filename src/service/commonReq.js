import axios from "axios"
//basic stucture for all api
const token = localStorage.getItem("token");

export const commonRequest=async (method,url,body,header)=>{
    let config={
        method,
        url,
        headers:{ Authorization: `Bearer ${token}`},
        data:body
    }
    return axios(config).then(response=>{
        // console.log(response);
        return response
    }).catch(err=>{
        console.log(err);
        return err
    })
}