import { useEffect, useReducer, useState } from "react"
import axios from "../../Axios/axios"
import { Tab, Tabs,Col , Row ,Table, Button, Form, Modal} from "react-bootstrap"
import "./adminDashboard.css"
import Swal from "sweetalert2"
import {CaretUpFill,CaretDownFill} from "react-bootstrap-icons"
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
            return {...state, data : action.payload}
        }
        case "DELETE" : {
            const newArr = state.data.filter(ele => ele._id !== action.payload)
            return {...state , data : newArr}
        }
        case "EDIT" : {
            const newArr = state.data.map(ele =>{
                if(ele._id == action.payload._id){
                    return {...ele,...action.payload}
                }else{
                    return {...ele}
                }
            })
            return {...state,data : newArr}
        }
        case "SELECTED_PLAYER" : {
            return {...state , selectedPlayer : {...state.selectedPlayer , ...action.payload}}
        }
        case "SET_MODAL" : {
            return {...state , modal : action.payload}
        }
        default : {
            return [...state]
        }
    }
}


export default function AdminDashboard(){

    const navigate = useNavigate()
    const [players,playerdispatch] = useReducer(playerReducer,{data : [] ,selectedPlayer : {} , modal : false})
    
    const [users,dispatch] = useReducer(reducer,[])
    const [order,setOrder] = useState(true)
    const [stats,setStats] = useState([])
    const [query,setQuery] = useState("deadline")
    const [search,setSearch] = useState('')
    const [playerSearch,setPlayerSearch] = useState("")
    const [role,setRole] = useState("")
    const [country,setCoutry] = useState("")
    const countryCodes = ['AUS', 'BAN', 'ENG', 'IND', 'NZ','PAK', 'SA', 'SL', 'WI', 'AFG','ZIM', 'IRE', 'NED', 'SCO', 'UAE','NEP', 'OMA', 'PNG', 'NAM', 'CAN','KEN', 'HK']
    console.log(query,order)
    
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
                const response = await axios.get(`api/stats?sort=${query}&order=${order}`,{headers : {
                    Authorization : localStorage.getItem('token')
                }})
                setStats(response.data)

            }catch(e){
                console.log(e)
            } 
        })()
    },[query,order]) 

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
                dispatch({type : "UPDATE_USERS" , payload : response.data })
                
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

    const handleSort = (value) =>{
        console.log(value,"handlesort")
        if(value == "deadline"){
            setQuery(value)
            setOrder(!order)
        }
        if(value == "users"){
            setQuery(value)
            setOrder(!order)
        }
        if(value == "contest"){
            setQuery(value)
            setOrder(!order)
        }
        if(value == "revenue"){
            setQuery(value)
            setOrder(!order)
        }
        if(value == "profit"){
            setQuery(value)
            setOrder(!order)
        }
    }

    const handleEdit = (ele) =>{
        playerdispatch({type : "SELECTED_PLAYER" , payload : ele})
        playerdispatch({type : "SET_MODAL" , payload : true})
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()

        const formdata = new FormData()
        for(const key in players.selectedPlayer){
            formdata.append(`${key}`,players.selectedPlayer[key])
        }
        try{
            const response =  await axios.put(`api/players/${players.selectedPlayer._id}`,formdata,{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            })
            console.log(response.data)
            playerdispatch({type : "EDIT" , payload : response.data})
            playerdispatch({type : "SET_MODAL" ,payload : false})
        }catch(e){
            console.log(e)
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
                            <th>Username </th> 
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
                            <th
                            style={{backgroundColor : query == "deadline" && "rgba(0,0,0,0.3)"}}
                            >Date {query == "deadline" && order ? (
                                <CaretUpFill onClick={()=>handleSort('deadline')} className="float-end"/>):
                                (<CaretDownFill onClick={()=>handleSort('deadline')} className="float-end"/>)
                                }
                            </th>
                            <th
                            style={{backgroundColor : query == "users" && "rgba(0,0,0,0.3)"}}
                            >Players {query == "users" && order ? (
                                <CaretUpFill onClick={()=>handleSort('users')} className="float-end"/>):
                                (<CaretDownFill onClick={()=>handleSort('users')} className="float-end"/>)
                                }
                            </th>
                            <th
                            style={{backgroundColor : query == "contest" && "rgba(0,0,0,0.3)"}}
                            >Contests {query == "contest" && order ? (
                                <CaretUpFill onClick={()=>handleSort('contest')} className="float-end"/>):
                                (<CaretDownFill onClick={()=>handleSort('contest')} className="float-end"/>)
                                }
                            </th>
                            <th
                            style={{backgroundColor : query == "revenue" && "rgba(0,0,0,0.3)"}}
                            >Revenue {query == "revenue" && order ? (
                                <CaretUpFill onClick={()=>handleSort('revenue')} className="float-end"/>):
                                (<CaretDownFill onClick={()=>handleSort('revenue')} className="float-end"/>)
                                }
                            </th>
                            <th
                            style={{backgroundColor : query == "profit" && "rgba(0,0,0,0.3)"}}
                            >Profit {query == "profit" && order ? (
                                <CaretUpFill onClick={()=>handleSort('profit')} className="float-end"/>):
                                (<CaretDownFill onClick={()=>handleSort('profit')} className="float-end"/>)
                                }
                            </th>
                            
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map(ele => {
                                return(
                                    <tr key={ele._id}>
                                        <td>{ele.team1} vs {ele.team2}</td>
                                        <td>{format(new Date(ele.deadline),"dd MMM yyyy")}</td>
                                        <td>{ele.users}</td>
                                        <td>{ele.contest}</td>
                                        <td>{ele.revenue}</td>
                                        <td>{ele.profit}</td>
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
                            <th>Image</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Country</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.data.filter(ele =>{
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
                                        <img height={50} src={`https://fantasy11.s3.ap-south-1.amazonaws.com/players/${ele.pic}`}/>
                                        <td>{ele.name}</td>
                                        <td>{ele.role}</td>
                                        <td>{ele.nationality}</td>
                                        <td><Button variant="danger" size="sm" onClick={()=>handleDelete(ele._id)}>Delete</Button><span> </span>
                                        <Button variant="warning" size = "sm" onClick={()=>handleEdit(ele)}>Edit</Button>
                                        </td>
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

            <Modal show = {players.modal} onHide={()=>playerdispatch({type : "SET_MODAL" , payload : false})}>
                <Modal.Header>
                    <h1>Edit Player</h1>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <label>Name</label><br/>
                        <Form.Control type="text" value={players.selectedPlayer.name} onChange={(e)=>{
                            playerdispatch({type : "SELECTED_PLAYER" , payload : {name : e.target.value}})
                        }} required/>
                        <label>Role</label><br/>
                        <Form.Select value={players.selectedPlayer.role} onChange={(e)=>{
                            playerdispatch({type : "SELECTED_PLAYER" , payload : {role : e.target.value}})
                        }} required >
                            <option value={"wk"}>wk</option>
                            <option value={"bat"}>bat</option>
                            <option value={"all"}>all</option>
                            <option value={"bowl"}>bowl</option>
                        </Form.Select>
                        <label>Country</label><br/>
                        <Form.Select value={players.selectedPlayer.nationality} onChange={(e)=>{
                            playerdispatch({type : "SELECTED_PLAYER" , payload : {nationality : e.target.value}})
                        }} required >
                            {countryCodes.map(ele =>{
                                return(
                            <option value={ele}>{ele}</option>
                                )
                            })}
                        </Form.Select>
                        <label>Picture</label><br/>
                        <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e)=>{
                            playerdispatch({type : "SELECTED_PLAYER" , payload : {pic : e.target.files[0]}})
                        }}
                        />
                        <Button type="submit">submit</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
            <ToastContainer/>
        </div>
    )
}