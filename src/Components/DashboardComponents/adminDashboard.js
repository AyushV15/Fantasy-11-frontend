import { useEffect, useReducer, useState } from "react"
import axios from "../../Axios/axios"
import { Tab, Tabs,Col , Row ,Table, Button, InputGroup, Placeholder} from "react-bootstrap"
import "./adminDashboard.css"
import Swal from "sweetalert2"
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import {format} from "date-fns"

const reducer = (state,action) =>{
        switch(action.type){
            case "SET_USERS" : {
                return [...state,...action.payload]
            }
            case "UPDATE_USERS" : {
                return state.map(ele =>{
                    if(ele._id == action.payload._id){
                        return {...ele,...action.payload}
                    }else{
                        return {...ele}
                    }
                })
            }
            default : {
                return [...state]
            }
        }
}


const playerReducer = (state,action) =>{
    switch(action.type){
        case "SET_PLAYERS" : {
            return [...state,...action.payload]
        }
        case "DELETE" : {
            return state.filter(ele => ele._id !== action.payload)
        }
        default : {
            return [...state]
        }
    }
}



export default function AdminDashboard(){

    const navigate = useNavigate()
    const [users,dispatch] = useReducer(reducer,[])
    const [players,playerdispatch] = useReducer(playerReducer,[])
    const [matches,setMatches] = useState([])
    const [search,setSearch] = useState('')
    const [playerSearch,setPlayerSearch] = useState("")
    const [role,setRole] = useState("")
    const [country,setCoutry] = useState("")
    const countryCodes = ['AUS', 'BAN', 'ENG', 'IND', 'NZ','PAK', 'SA', 'SL', 'WI', 'AFG','ZIM', 'IRE', 'NED', 'SCO', 'UAE',
        'NEP', 'OMA', 'PNG', 'NAM', 'CAN','KEN', 'HK']

    
    useEffect(()=>{
        (async () =>{
            try{
                const response = await axios.get("api/users",{headers : {
                    Authorization : localStorage.getItem('token')
                }})
                dispatch({type : "SET_USERS", payload : response.data })
                console.log(response.data)
                
            }catch(e){
                console.log(e)
            } 
        })()
    },[])

    useEffect(()=>{
        (async () =>{
            try{
                const response = await axios.get("api/matches",{headers : {
                    Authorization : localStorage.getItem('token')
                }})
                setMatches(response.data)
                console.log(response.data)
            }catch(e){
                console.log(e)
            } 
        })()
    },[])

    useEffect(()=>{
        (async () =>{
            try{
                const response = await axios.get("api/players",{headers : {
                    Authorization : localStorage.getItem('token')
                }})
                playerdispatch({type : "SET_PLAYERS",payload : response.data})
                console.log(response.data)
            }catch(e){
                console.log(e)
            } 
        })()
    },[])

    const handleClick = async (id,status) =>{
        const body = {
            id,
            status
        }
        const confirm =  window.confirm("are you sure")

        if(confirm){
            try{
                const response = await axios.put("api/users",body,{headers : {
                    Authorization : localStorage.getItem('token')
                }})
                setMatches(response.data)
                
                console.log(response.data)
            }catch(e){
                console.log(e)
            } 
        }
    }

    const handleDelete = async (id) =>{
        const {value : confirm} = await Swal.fire({
            title : "are you sure you want to delete this player ?",
            showConfirmButton : true
        })
        if(confirm){
            try{
                const response = await axios.delete(`api/players/${id}`,{
                    headers : {
                        Authorization : localStorage.getItem("token")
                    }
                })
                console.log(response)
                playerdispatch({type : "DELETE" , payload : response.data._id})
                console.log(response.data._id)
                toast.success("Player Deleted Successfully")
            }catch(e){
                console.log(e)
            }
        }
    }
    
    return(
        <div>
            <Row>
                <Col md = {2}>
                </Col>
                <Col md = {8}>
                <Tabs className="match-tabs" justify>
                <Tab eventKey="Users" title = "Users">
                    <div className="search-user">
                    <input type="text" value={search} placeholder="search by username" onChange={(e)=>setSearch(e.target.value)}></input>
                    
                    </div>
                    <Table className="users-table" striped bordered hover>
                        <thead>
                            <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.filter(ele => ele.username.toLowerCase().includes(search.toLowerCase())).map(ele =>{
                                if(ele.role !== "admin"){
                                    return(
                                        <tr key={ele._id}>
                                            <td>{ele.username}</td>
                                            <td>{ele.email}</td>
                                            <td>{ele.mobile}</td>
                                            <td><Button onClick={()=>handleClick(ele._id,ele.isActive)} size="sm" 
                                                variant={ele.isActive ? "danger" : "primary" }>
                                                {ele.isActive ? "DE-ACTIVATE" : "ACTIVATE" }
                                            </Button>
                                            </td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="Matches" title = "Matches">
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                        
                            <th>Match</th>
                            <th>Date</th>
                            <th>Players</th>
                            <th>Contest</th>
                            <th>revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matches.map(ele => {
                                return(
                                    <tr key={ele._id}>
                                        <td>{ele.team1} vs {ele.team2}</td>
                                        <td>{format(new Date(ele.deadline),"dd MMM yyyy")}</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td><button>go to match</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="Players" title = "Players">
                    <div className="search-user">
                    <input type="text" value={playerSearch} placeholder="search by username" onChange={(e)=>setPlayerSearch(e.target.value)}></input>
                    <select value = {role} onChange={(e)=>setRole(e.target.value)}>
                        <option value={""}>Sort by role</option>
                        <option value={"wk"}>wk</option>
                        <option value={"bat"}>bat</option> 
                        <option value={"all"}>all</option>
                        <option value={"bowl"}>bowl</option>
                    </select>
                    <select value = {country} onChange={(e)=>setCoutry(e.target.value)}>
                        <option value={""}>Sort by country</option>
                        {countryCodes.map((ele,i) =>{
                            return(<option key={i} value={ele}>{ele}</option>)
                        })} 
                    </select>
                    <Button size="sm" onClick={()=>navigate("/create-player")}>Create Player</Button>
                    </div><br/>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Country</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.filter(ele =>{
                                if(role){
                                    return ele.role == role
                                }else{
                                    return ele
                                }
                            }).filter(ele =>{
                                if(country){
                                    return ele.nationality == country
                                }else{
                                    return ele
                                }
                            }).filter(ele => ele.name.toLowerCase().includes(playerSearch.toLowerCase())).map(ele => {
                                return(
                                    <tr key={ele._id}>
                                        <td>{ele.name}</td>
                                        <td>{ele.role}</td>
                                        <td>{ele.nationality}</td>
                                        <td><Button variant="danger" size="sm" onClick={()=>handleDelete(ele._id)}>Delete</Button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    <div>
                        
                    </div>
                </Tab>
            </Tabs>
                </Col>
                <Col md = {2}>
                
                </Col>
            </Row>
            <ToastContainer/>
        </div>
    )
}