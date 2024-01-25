import { Form,Row,Col,Image, Button } from "react-bootstrap"
import "./ForgotPassword.css"
import { useState  } from "react"
import axios from "../../Axios/axios"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { toast, ToastContainer } from "react-toastify"
import isEmail from "validator/lib/isEmail"

export default function ForgotPassword(){


    const navigate = useNavigate()
    const [email,setEmail] = useState("")
    const [otp,setOTP] = useState("")
    const [password,setPassword] = useState("")
    const [succes,setSuccess] = useState(false)

    const search = useLocation().search;
    const data = new URLSearchParams(search).get('token')
    const token = data && jwtDecode(data)

    const handleSubmit = async (e) =>{ 
        e.preventDefault()
        
        if(password.trim().length < 8 || password.trim().length > 128 ){
            toast.error("password should be between 8 to 128 characters")
        }
        const body = {
            password,
            email : token.email,
            token : data,
            otp : otp
        }

            try{
                const response = await axios.post("api/reset-password",body)
                toast.success(response.data)
                setTimeout(()=>{
                    navigate('/login')
                },5000)
            }catch(e){
                if(e.response.data.message == "jwt expired" ){
                    toast.error("Link has Expired")
                    setTimeout(()=>{
                        navigate('/forgot-password')
                    },5000)
                }else{
                    toast.error(e.response.data)
                }
            }
    }
    

    const handleClick = async () =>{
        if(isEmail(email)){
            try{
                const response = await axios.get(`api/forgot-password?email=${email}`)
                console.log(response)
                setSuccess(true)
                setTimeout(()=>{
                    setSuccess(false)
                },60000)
            }catch(e){
                console.log(e)
                toast.error(e.response.data)
            }
        }else{
            toast.error("please enter a valid email")
        }
    }
    return(
        <div className="forgot-password">
                    <div>
                        <Image src = "https://fantasy11.s3.ap-south-1.amazonaws.com/Images/forgot-password.avif" height={400}/>
                    </div>

                    {token ? (
                        <div>
                            <h1>Reset Password</h1>
                            <Form onSubmit={handleSubmit}>
                                <Form.Control required type="number" placeholder="enter OTP received in Email" value={otp} onChange={(e)=>setOTP(e.target.value)}/><br/>
                                <Form.Control required type="password" placeholder="enter new password" value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                />
                                <Button type="submit">Submit</Button>
                            </Form>
                        </div>
                    ) : (
                    <div>
                        <h1>Forgot Password ???</h1>
                        <Form.Control required type="text" placeholder="Enter ur email" value={email} onChange={(e)=>setEmail(e.target.value)}/><br/>
                        <Button onClick={handleClick}>Sent email</Button><br/><br/>
                        <span>Go to </span><Link to = "/login">Login</Link>
                        {succes && <p style={{color : "green"}}>Password reset link has been sent to ur email <a href="https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&emr=1&followup=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&ifkv=ASKXGp0ATQeahkJvy_o_VxFfj7X4cxIbEitnTd8VsHZ852wWSBa8eu0vbinWF6qrS4kog5Vb6GR2BQ&osid=1&passive=1209600&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-1257421827%3A1706075464682230&theme=glif">Go to Gmail</a></p>}
                    </div>
                    )}
        <ToastContainer/>
        </div>
    )
}