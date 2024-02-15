import BASE_URL from "./baseurl";
import { commonRequest } from "./commonReq";

//register
export const registerUser=async(body)=>{
    return await commonRequest("POST",`${BASE_URL}/api/v1/register`,body)
}

//login
export const loginUser=async(body)=>{
    return await commonRequest("POST",`${BASE_URL}/api/v1/login`,body)
}

//Add marks
export const addMarks=async(body)=>{
    return await commonRequest("POST",`${BASE_URL}/api/v1/add-marks`,body)
}

//get all marks
export const getallMarks=async(uid)=>{
    return await commonRequest("GET",`${BASE_URL}/api/v1/get-marks/${uid}`,"")
}