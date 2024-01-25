import { useState } from "react"
import axios from "./Axios/axios"

export default function Image(){

    const [file1,setFile1] = useState("")
    const [file2,setFile2] = useState("")


    const handlesubmit = async (e) =>{
        e.preventDefault()
        const fd = new FormData()

        fd.append("file1",file1)
        fd.append("file2",file2)

        try{
            const response = await axios.post("uploads",fd)
            console.log(response)
        }catch(e){
            console.log(e)
        }
    }
    return(
        <div>
            <form onSubmit={handlesubmit} >
                <input type="file" name = "file1" onChange={(e)=>setFile1(e.target.files[0])}/>
                <input type="file" name = "file2" onChange={(e)=>setFile2(e.target.files[0])}/>
                <input type="submit"/>
            </form>
        </div>
    )
}