import { useEffect } from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "../../Axios/axios";

export default function Success(){

    useEffect(()=>{
        (async ()=>{
            try{
                const id = localStorage.getItem('stripeId')
                const response = await axios.put("api/update-payment",{id},{
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
        <div className="success">
            <h1>Payment Successful</h1>
            <Image src="https://fantasy11.s3.ap-south-1.amazonaws.com/Images/money3.gif"/>
            <Link to={'/dashboard'}>Go to DashBoard</Link>
        </div>
        </div>
            
    )
}