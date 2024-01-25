
import axios from "../Axios/axios"
import { toast } from "react-toastify"



export const getStartNotification = () =>{
    return async (dispatch) =>{
        try{
            const response = await axios.get('api/users/notifications',{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            })
           dispatch(setNotification(response.data))
        }catch(e){
            console.log(e)
            toast.error(e.response.data)
            

        }
       
    }
}

export const setNotification = (data) =>{
    return {
        type : "SET_NOTIFICATIONS",
        payload : data
    }
}

export const clearNotification = () =>{
    return {
        type : "CLEAR_NOTIFICATIONS"
    }
}