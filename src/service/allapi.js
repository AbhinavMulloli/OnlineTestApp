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

//Verify email
export const VerifyEmail=async(body)=>{
    return await commonRequest("POST",`${BASE_URL}/api/v1/verifymail`,body)
}

//Update password
export const UpdatePassword=async(body)=>{
    return await commonRequest("POST",`${BASE_URL}/api/v1/updatepass`,body)
}

//get current user
export const getUser=async(uid)=>{
    return await commonRequest("GET",`${BASE_URL}/api/v1/get-user/${uid}`,"")
}

//Add marks
export const addMarks=async(body)=>{
    return await commonRequest("POST",`${BASE_URL}/api/v1/add-marks`,body)
}

//for payment
export const paymentApi=async(body)=>{
    return await commonRequest("POST",`${BASE_URL}/api/v1/add-payment`,body)
}

//Add marks in competition
export const addMarksCompetition=async(body)=>{
    return await commonRequest("POST",`${BASE_URL}/api/v1/add-marks-comp`,body)
}

//get all marks
export const getallMarks=async(uid)=>{
    return await commonRequest("GET",`${BASE_URL}/api/v1/get-marks/${uid}`,"")
}

//get all marks in competition
export const getallMarksCompetition=async(body)=>{
    return await commonRequest("POST",`${BASE_URL}/api/v1/get-marks-comp`,body)
}

//Delete Account
export const deleteAccount=async(uid)=>{
    return await commonRequest("DELETE",`${BASE_URL}/api/delete-user/${uid}`,"")
}
