import "./Success.css"
import axios from "../../Axios/axios"
import { useEffect } from "react"

export default function Failure(){

    useEffect(()=>{
        (async ()=>{
            try{
                const id = localStorage.getItem('stripeId')
                const response = await axios.delete(`api/delete-payment/${id}`,{
                    headers : {
                        Authorization : localStorage.getItem('token')
                    }
                })
                if(response){
                    localStorage.removeItem("stripeId")
                }
            }catch(e){
                console.log(e)
            }
        })()
    },[])

    return(
        <div>
            Failure
        </div>
    )
}