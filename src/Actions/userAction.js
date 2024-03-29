import axios from "../Axios/axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
 
export const getStartUser = () =>{
    return async (dispatch) =>{
        try{
            const response = await axios.get('api/users/dashboard',{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            })
           dispatch(setUser(response.data))
        }catch(e){
            console.log(e)
            toast.error(e.response.data.message)
        }
    }
}

export const setUser = (user) =>{
    return {
        type : "SET_USER",
        payload : user
    }
}

export const updatePic = (pic) =>{
    return {
        type : "UPDATE_PIC",
        payload : pic
    }
}