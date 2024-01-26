import axios from "../../Axios/axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ToastContainer, toast } from "react-toastify"
import {Form,Image} from "react-bootstrap"
import {updatePic}  from "../../Actions/userAction"
import "./UserProfile.css"

export default function UserProfile(){

    const user = useSelector(state =>{
        return state.user
    })

    const error = {}

    const runvalidators = () =>{
        if(password.currentPassword.trim().length < 8 || password.currentPassword.trim().length > 128  ){
            error.currentPassword = "password should be between 8 to 128 characters"
        }
        if(password.newPassword.trim().length < 8 || password.newPassword.trim().length > 128  ){
            error.newPassword = "password should be between 8 to 128 characters"
        }
        if(password.confirmPassword.trim().length < 8 || password.confirmPassword.trim().length > 128  ){
            error.confirmPassword = "password should be between 8 to 128 characters"
        }
        if(password.newPassword !== password.confirmPassword){
            error.match = "current Password and new Password does not match"
        }
        
    }

    const dispatch = useDispatch()
    const [profilePic, setProfilePic] = useState('')
    const [password, setPassword] = useState({
        currentPassword : "",
        newPassword : "",
        confirmPassword : "",
        errors : {}
    })

    const handleSubmit = async (e) =>{
        e.preventDefault()
        
        const formdata = new FormData()
        formdata.append("profilePic",profilePic)
        
        try{
            const response = await axios.put('api/users/update-profile',formdata,{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            })
            dispatch(updatePic(response.data.profilePic))
            toast.success("profilePic Updated Successfully")
        }catch(e){  
            console.log(e)
            toast.error(e.response.data)
        }
    }

    const handleChange = (e) =>{
        
        if(e.target.name == "currentPassword"){
            setPassword({...password, currentPassword : e.target.value})
        }
        if(e.target.name == "newPassword"){
            setPassword({...password, newPassword : e.target.value})
        }
        if(e.target.name == "confirmPassword"){
            setPassword({...password, confirmPassword : e.target.value})
        }
    }

    const handleChangePassword = async (e) =>{
        e.preventDefault()
        runvalidators()

        if(!Object.keys(error).length == 0) {
            setPassword({...password ,errors : error})
        }else{
            setPassword({...password,errors : {}})
            try{
                const response = await axios.put('api/users/update-profile',password,{
                    headers : {
                        Authorization : localStorage.getItem('token')
                    }
                })
            }catch(e){  
                console.log(e)
                toast.error(e.response.data)
            }

        }
       
    }

    return(
        
        <div className="update-profile">
            <div>
            <Image style={{border : "2px solid black"}} src={`https://fantasy11.s3.ap-south-1.amazonaws.com/users/${user.profilePic}`} height={100} width={100} roundedCircle/>
            <p style={{textAlign : "center"}}>{user.username}</p>
            </div>
            <div>
            <h1>Update Profile</h1>
            <Form onSubmit={handleSubmit}>
                <label>Username</label>
                <Form.Control type="text" placeholder={user.username} disabled/><br/>
                <label>Email</label>
                <Form.Control  type="text" placeholder={user.email} disabled/><br/>
                <label>Mobile</label>
                <Form.Control  type="text" placeholder={user.mobile} disabled/><br/>
                <label>Profile Pic</label>
                <Form.Control required  type="file"  onChange={(e)=>setProfilePic(e.target.files[0])}/><br/>
                <Form.Control  type="submit"/>
            </Form>
            </div>
            
            <div className="change-password-div">
            <h1>Change Password</h1>
            <Image height={200} width={200} src={"https://fantasy11.s3.ap-south-1.amazonaws.com/Images/change-password-image.webp"}/>
            <Form onSubmit={handleChangePassword}>
                <Form.Control type="password" placeholder = "Enter Old Password" value={password.currentPassword} name="currentPassword" onChange={handleChange}/>
                {password.errors.currentPassword}
                <br/>
                <Form.Control type="password" placeholder = "Enter New Password" value={password.newPassword} name="newPassword" onChange={handleChange} />
                {password.errors.newPassword}<br/>
                <Form.Control type="password" placeholder = "Confirm Password" value={password.confirmPassword} name="confirmPassword" onChange={handleChange} />
                {password.errors.confirmPassword}<br/>
                {password.errors.match}
                <Form.Control type="submit"/>
            </Form>
            </div>
            <ToastContainer/>
        </div>
    )
}