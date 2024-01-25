import { toast } from "react-toastify"
import axios from "../Axios/axios"

export const getStartWallet = () =>{
    return async (dispatch) =>{

        try{
            const response = await axios.get('api/users/wallet',{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            })
            console.log(response.data,"wallet")
           dispatch(setWallet(response.data))
        }catch(e){
            console.log(e)
            toast.error(e.response.data)
            
        }
        
    }
}

export const setWallet = (wallet) =>{
    return {
        type : "SET_WALLET",
        payload : wallet
    }
}

export const debitWallet = (amount) =>{
    return {
        type : "DEBIT_WALLET",
        payload : amount
    }
}
