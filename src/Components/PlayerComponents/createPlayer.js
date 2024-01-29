import { useState } from "react"
import axios from "../../Axios/axios"
import { toast,ToastContainer } from "react-toastify"
import "./createPlayer.css"
import { Image } from "react-bootstrap"

export default function CreatePlayer(){
    
    const [name,setName] = useState("")
    const [country,setCountry] = useState("")
    const [role,setRole] = useState("")
    const [pic,setPic] = useState("")
    const countryCodes = ['AUS', 'BAN', 'ENG', 'IND', 'NZ','PAK', 'SA', 'SL', 'WI', 'AFG','ZIM', 'IRE', 'NED', 'SCO', 'UAE',
        'NEP', 'OMA', 'PNG', 'NAM', 'CAN','KEN', 'HK']
    const handleSubmit = async (e) =>{ 
        e.preventDefault()
        const formdata = new FormData()
        formdata.append("name",name)
        formdata.append("role",role)
        formdata.append("nationality",country)
        formdata.append('pic',pic)

        try{
            const response = await axios.post("api/players",formdata,{headers : {
                Authorization : localStorage.getItem("token")
            }})
            console.log(response)
            toast.success("player Created Successfully",{
                position : "top-center"
            })
            console.log()
        }catch(e){
            toast.error(e.response.data.errors.map(ele => ele.msg))
        }

    }

    return(
        <div className="create-player">
            <Image height={300} width={300} src="https://fantasy11.s3.ap-south-1.amazonaws.com/Images/Batsman.jpg"/>
            <form onSubmit={handleSubmit}>
                <h2>Create Player</h2>
            <label>Player Name</label><br/>
            <input className="style" required type="text" value={name} onChange={(e)=>setName(e.target.value)}/><br/>
            
            <select className="style" value={role} onChange={(e)=>setRole(e.target.value)} required>
                <option value={""}>Select Role</option>
                <option value={"wk"}>wk</option>
                <option value={"bat"}>bat</option>
                <option value={"all"}>all</option>
                <option value={"bowl"}>bowl</option>
            </select><br/>
        
            <select className="style" value={country} onChange={(e)=>setCountry(e.target.value)} required>
                <option value={""}>Select Country</option>
                {countryCodes.map(ele =>{
                    return(<option value={ele}>{ele}</option>)
                })} 
            </select><br/>
            <label>Player Pic</label><br/>
            <input className="file" required type="file" accept="image/*" onChange={(e)=>setPic(e.target.files[0])}/><br/>
            <input className="submit" type="submit"/>
            </form>
            <Image height={300} width={250} src="https://fantasy11.s3.ap-south-1.amazonaws.com/Images/Bowler.png"/>
            <ToastContainer/>
        </div>
    )
}