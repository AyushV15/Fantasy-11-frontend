import { useEffect, useState } from "react"
import {useFormik} from "formik"
import Select from "react-dropdown-select"
import axios from "../../Axios/axios"
import { useNavigate } from "react-router-dom"
import { Form, Row,Col } from "react-bootstrap"
import "./CreateMatch.css"

export default function CreateMatch2(){

    const navigate = useNavigate()
    const [team1players,setTeam1Players] = useState([])
    const [team2players,setTeam2Players] = useState([])
    const [tournament,setTournament] = useState("")
    const [team1,setTeam1] = useState("")
    const [team2,setTeam2] = useState("")
    const [deadline,setDeadline] = useState("")
    const [file1,setFile1] = useState("")
    const [file2,setFile2] = useState("")
    const [options,setOptions] = useState([])

    useEffect(()=>{
        (async()=>{
            try{
                const response = await axios.get("api/players",{headers : {
                    Authorization : localStorage.getItem("token")
                }})
                setOptions(response.data)
            }catch(e){
                console.log(e)
            }
        })()
    },[])

    const option1 = options.map((ele,i) => {
        return {value : ele._id , label: ele.name}
    })

    const handleSubmit = async (e)=>{
        e.preventDefault()
        
        const formData = new FormData()
        formData.append("tournament",tournament)
        formData.append("team1",team1)
        formData.append("team2",team2)
        formData.append("deadline",new Date(deadline))
        formData.append("team1logo",file1)
        formData.append("team2logo",file2)
        formData.append("team1players",JSON.stringify(team1players.map(ele => {
            const p = options.find(e => e._id == ele.value)
            return p 
        })))
        formData.append("team2players",JSON.stringify(team2players.map(ele => {
            const p = options.find(e => e._id == ele.value)
            return p 
        }))) 

        try{
                const response = await axios.post("api/create-match",formData,{headers : {
                    Authorization : localStorage.getItem("token")
                }})
                console.log(response)
                // navigate("/dashboard")
            }catch(e){
                console.log(e)
            }

    }

    return(
        <div className="create-match">
            <Row>
            <Col md = {3}></Col>
            <Col md = {6}>
            <h1>Create Match</h1>
            <Form onSubmit={handleSubmit}>
                <label>Tournament Name</label><br/>
                <Form.Control type="text" placeholder="tournament name" value={tournament} onChange={(e)=>setTournament(e.target.value)} /><br/>
                <label>Team 1 Name</label><br/>
                <Form.Control type="text" placeholder="team1" value={team1} onChange={(e)=>setTeam1(e.target.value)} /><br/>
                <label>Team 1 Logo</label><br/>
                <Form.Control type="file" accept="image/*" onChange={(e)=>setFile1(e.target.files[0])}/><br/>
                <label>Team 2 Name</label><br/>
                <Form.Control type="text" placeholder="team2" value={team2} onChange={(e)=>setTeam2(e.target.value)}/><br/>
                <label>Team 2 Logo</label><br/>
                <Form.Control type="file" accept="image/*" onChange={(e)=>setFile2(e.target.files[0])} /><br/>
                <Form.Control type="datetime-local" value={deadline} onChange={(e)=>setDeadline(e.target.value)} /><br/>
            <label>Select team1 Players</label>
            <Select
            options={option1}
            onChange={setTeam1Players}
            searchable
            multi
            a
            /><br/>
            <label>Select team2 Players</label>
            <Select
            options={option1}
            onChange={setTeam2Players}
            searchable
            multi
            />
            <input type="submit"/>
            <br/>
            </Form>
            </Col>
            <Col md = {3}></Col>
            </Row>
        </div>
    )
}