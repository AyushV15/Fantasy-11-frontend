import "./Success.css"
import axios from "../../Axios/axios"
import { useEffect } from "react"
import "./Failure.css"

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
        <div className="failure">
            <img src="https://fantasy11.s3.ap-south-1.amazonaws.com/Images/Payment.png"/>
        </div>
    )
}