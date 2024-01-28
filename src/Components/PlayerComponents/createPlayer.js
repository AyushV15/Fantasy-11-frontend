import { useState } from "react"
import axios from "../../Axios/axios"
import { toast,ToastContainer } from "react-toastify"

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
        }catch(e){
            console.log(e)
        }

    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
            <label>Player Name</label><br/>
            <input required type="text" value={name} onChange={(e)=>setName(e.target.value)}/><br/>
            <select value={role} onChange={(e)=>setRole(e.target.value)} required>
                <option value={""}>Select Role</option>
                <option value={"wk"}>wk</option>
                <option value={"bat"}>bat</option>
                <option value={"all"}>all</option>
                <option value={"bowl"}>bowl</option>
            </select><br/>
            <select value={country} onChange={(e)=>setCountry(e.target.value)} required>
                <option value={""}>Select Country</option>
                {countryCodes.map(ele =>{
                    return(<option value={ele}>{ele}</option>)
                })} 
            </select><br/>
            <input required type="file" onChange={(e)=>setPic(e.target.files[0])}/><br/>
            <input type="submit"/>
            </form>
            <ToastContainer/>
        </div>
    )
}