import {Box,Stepper,Step,StepLabel,Button} from '@mui/material'
import {Tabs,Tab,ListGroup,Image, Row, Col, Modal, Table, Badge} from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import "./CreateTeam.css"
import Countdown from 'react-countdown';
import {MatchContext} from "../../Context/Context"
import { useContext, useEffect, useReducer, useState } from "react"
import { useNavigate, useParams ,useHistory } from "react-router-dom"
import axios from "../../Axios/axios"



const teamReducer = (state,action) => {
    switch(action.type){
       case "ADD_PLAYER" : {
            return [...state,action.payload]
        }
       case "REMOVE_PLAYER" : {
            return state.filter(e => e._id !== action.payload._id) 
       } 
       case "SET_TEAM" : {
            return [...action.payload]
       }
       default : {
        return [...state]
       }
    }
}

const playersReducer = (state,action) =>{
    switch(action.type){
        case "SET_PLAYERS" : {
            return [...action.payload]
        }
        case "ALL" : {
            return [...action.payload]
        }
        case "TEAM1" : {
            return [...action.payload]
        }
        case "TEAM2" : {
            return [...action.payload]
        }
        default : {
            return [...state]
        }
    }
}

export default function CreateTeam(){

    const [steps,setSteps] = useState([1,2,3,4,5,6,7,8,9,10,11])
    
    // const [team,setTeam] = useState([])
    const [edit,setEdit] = useState(false)
    const [team,dispatch] = useReducer(teamReducer,[])
    const [modal,setModal] = useState(false)
    const [captain,setCaptain] = useState("")
    const [viceCaptain,setViceCaptain] = useState("")
    
    const {id} = useParams()
    const navigate = useNavigate()

    const {matches} = useContext(MatchContext)
    const match = matches.find(ele => ele._id == id)

    const [players,playerdispatch] = useReducer(playersReducer,[])

    useEffect(()=>{
        if(match){
            localStorage.setItem("match",JSON.stringify(match))
        }
    },[])

    useEffect(()=>{
        const match = JSON.parse(localStorage.getItem('match'))
        console.log(match,"hihik")
        if(match){
            playerdispatch({type : "SET_PLAYERS", payload : [...match.team1players ,...match.team2players]})
        }
    },[])

    console.log(edit ,"edit")
    useEffect(()=>{ // getting users team from database
        (async() =>{
            try{
                const response = await axios.get(`api/match/${id}/team`,{headers : {
                    Authorization : localStorage.getItem("token")
                }})
                console.log(response.data,"users team")
                if(response.data){
                    setEdit(true)
                }
                if(response.data){
                    dispatch({type : "SET_TEAM" , payload : response.data.team})
                }
                
            }catch(e){
                console.log(e)
            }
        })()
    },[])

    const selectCVC = () =>{
        if(team.filter(e => e.role == "wk").length < 1){
            return toast.info("Please Select Atleast One Wicket Keeper")
        }
        if(team.filter(e => e.role == "bat").length < 3){
            return toast.info("Please Select Atleast 2 Batsman")
        }
        if(team.filter(e => e.role == "all").length < 1){
            return toast.info("Please Select Atleast One Allrounder")
        }
        if(team.filter(e => e.role == "bowl").length < 3){
            return toast.info("Please Select Atleast 3 Bowlers")
        }
        setModal(true)
    }
    
    const handleSubmit = async () =>{ 
        const finalTeam = team.map(ele =>{
            if(ele.name == captain){
                return {...ele , C : true , VC : false}
            }
            else if(ele.name == viceCaptain){
                return {...ele, VC : true , C : false}
            }
            else{
                return {...ele , C: false , VC : false}
            }
        })

        const formdata = {
            team : finalTeam 
        }
        console.log(finalTeam)
        if(!edit){
            try{
                const response = await axios.post(`api/match/${id}/create-team`,formdata,{
                    headers : {
                        Authorization : localStorage.getItem("token")
                    }
                })
                toast.success("team created successfully")
                navigate(`/match/${id}`,{replace :true})
            }catch(e){
                if(e.response.data?.error){
                    return e.response.data.error.map(ele => toast.error(ele.msg))
                }
                toast.error(e.response.data)
                console.log(e)
            }
        }else{
            try{
                const response = await axios.put(`api/match/${id}/edit-team`,formdata,{
                    headers : {
                        Authorization : localStorage.getItem("token")
                    }
                })
                navigate(`/match/${id}`,{replace :true})
            }catch(e){
                toast.error(e.response.data)
            }
        }

    } 

    return(
        <div>
             <div className="match-countdown">
                {match && (
                <Countdown
                date={(Date.now() + (new Date(match.deadline).getTime() - Date.now()))}
                onComplete={()=>{
                    alert("Deadline has passed")
                    navigate('/dashboard',{replace : true})
                }}
                />
                )}
            </div>
            <Stepper activeStep={team.length} style={{ background: 'black', padding: '10px', color : "green" }}>
                {steps.map(ele =>{
                    return(
                        <Step >
                            <StepLabel></StepLabel>
                        </Step>
                    )
                })}
            </Stepper>
            <div className='create-team-inst'>
                <p>Select Minimun - Wicketkeeper : 1 , Batsman : 3 , Allrounder : 1 , Bowler : 3</p>
            </div>
            {match && (
                    <div className='sort-players'>
                        <Button onClick={()=>{
                            playerdispatch({type : "ALL" , payload : [...match.team1players,...match.team2players]})
                        }}>All</Button>
                        <Button onClick={()=>{
                            playerdispatch({type : "TEAM1" , payload : match.team1players})
                        }}
                        >{match.team1}</Button>
                        <Button onClick={()=>{
                            playerdispatch({type : "TEAM2" , payload : match.team2players})
                        }}
                        >{match.team2}</Button>
                    </div>
                    )}
            <Row>
                <Col md = {3}></Col>
                <Col md = {6}>
                    
           
            <Tabs className="match-tabs" defaultActiveKey="wicketkeeper" id="justify-tab-example" justify>
                <Tab eventKey={"wicketkeeper"} title = "Wicketkeeper">
                    <ListGroup >
                        {players && players.map(ele => {
                                if(ele.role == "wk"){
                                    return <ListGroup.Item 
                                    variant= {match && match.team1 == ele.team ? "primary" : "dark"}
                                    active = {team.find(e => e._id == ele._id)}>

                                    {team.find(e => e._id == ele._id) ? (
                                        <Button className='float-end' onClick={()=>dispatch({type : "REMOVE_PLAYER" ,payload : ele})}>➖</Button>
                                    ):(
                                    <Button disabled = {team.length == 11} className='float-end' onClick={()=>dispatch({type : "ADD_PLAYER", payload : ele})}>➕</Button>
                                    )} 
                                    <div style={{display : "flex" , alignItems : "center"}}>
                                    <div>
                                    <Image src = {`https://fantasy11.s3.ap-south-1.amazonaws.com/players/${ele.pic}`} style={{height : "70px"}}/>
                                    <Image src={`https://fantasy11.s3.ap-south-1.amazonaws.com/TeamJersey/${ele.team}.png`} style={{height : "30px", position : "absolute",left : "14.9px", top : "60px"}}/>
                                    </div>
                                    <p>{ele.name}</p>
                                    </div>
                                    <b style={{fontSize : "10px", position : "relative", top : "10px"}}>{ele.team}</b>
                                
                                </ListGroup.Item> 
                                }
                        })}
                        
                    </ListGroup>

                </Tab>

                <Tab eventKey={"batsam"} title = "Batsman">
                    <ListGroup>

                        { players && players.map(ele => {
                                if(ele.role == "bat"){
                                    return <ListGroup.Item 
                                    variant= {match && match.team1 == ele.team ? "primary" : "success"}
                                    active = {team.find(e => e._id == ele._id)}>
                                {team.find(e => e._id == ele._id) ? (
                                        <Button className='float-end' onClick={()=>dispatch({type : "REMOVE_PLAYER" ,payload : ele})}>➖</Button>
                                    ):(
                                    <Button disabled = {team.length == 11} className='float-end' onClick={()=>dispatch({type : "ADD_PLAYER", payload : ele})}>➕</Button>
                                    )} 
                                    <div style={{display : "flex" , alignItems : "center"}}>
                                    <div>
                                    <Image src = {`https://fantasy11.s3.ap-south-1.amazonaws.com/players/${ele.pic}`} style={{height : "70px"}}/>
                                    <Image src={`https://fantasy11.s3.ap-south-1.amazonaws.com/TeamJersey/${ele.team}.png`} style={{height : "30px", position : "absolute",left : "14.5px", top : "60px"}}/>
                                    </div>
                                    <p>{ele.name}</p>
                                    </div>
                                    <b style={{fontSize : "10px", position : "relative", top : "10px"}}>{ele.team}</b>
                                </ListGroup.Item> 
                                }
                        })}
                    </ListGroup>
                </Tab>

                <Tab eventKey={"allrounder"} title = "Allrounder">
                    <ListGroup>
                        { players && players.map(ele =>{
                           if(ele.role == "all"){
                            return <ListGroup.Item 
                            variant = {match && match.team1 == ele.team ? "primary" : "success"}
                             active = {team.find(e => e._id == ele._id)}>
                                {team.find(e => e._id == ele._id) ? (
                                        <Button className='float-end' onClick={()=>dispatch({type : "REMOVE_PLAYER" ,payload : ele})}>➖</Button>
                                    ):(
                                    <Button disabled = {team.length == 11} className='float-end' onClick={()=>dispatch({type : "ADD_PLAYER", payload : ele})}>➕</Button>
                                    )} 
                                    <div style={{display : "flex" , alignItems : "center"}}>
                                    <div>
                                    <Image src = {`https://fantasy11.s3.ap-south-1.amazonaws.com/players/${ele.pic}`} style={{height : "70px"}}/>
                                    <Image src={`https://fantasy11.s3.ap-south-1.amazonaws.com/TeamJersey/${ele.team}.png`} style={{height : "30px", position : "absolute",left : "14.5px", top : "60px"}}/>
                                    </div>
                                    <p>{ele.name}</p>
                                    </div>
                                    <b style={{fontSize : "10px", position : "relative", top : "10px"}}>{ele.team}</b>
                            </ListGroup.Item>
                           }
                        })}
                        
                    </ListGroup>
                </Tab>

                <Tab eventKey={"bowler"} title = "Bowler">
                    <ListGroup>
                    {players && players.map(ele =>{
                           if(ele.role == "bowl"){
                            return <ListGroup.Item 
                            variant = {match && match.team1 == ele.team ? "primary" : "success"}
                             active = {team.find(e => e._id == ele._id)}>
                                {team.find(e => e._id == ele._id) ? (
                                        <Button className='float-end' onClick={()=>dispatch({type : "REMOVE_PLAYER" ,payload : ele})}>➖</Button>
                                    ):(
                                    <Button disabled = {team.length == 11} className='float-end' onClick={()=>dispatch({type : "ADD_PLAYER", payload : ele})}>➕</Button>
                                    )} 
                                    <div style={{display : "flex" , alignItems : "center"}}>
                                    <div>
                                    <Image src = {`https://fantasy11.s3.ap-south-1.amazonaws.com/players/${ele.pic}`} style={{height : "70px"}}/>
                                    <Image src={`https://fantasy11.s3.ap-south-1.amazonaws.com/TeamJersey/${ele.team}.png`} style={{height : "30px", position : "absolute",left : "14.5px", top : "60px"}}/>
                                    </div>
                                    <p>{ele.name}</p>
                                    </div>
                                    <b style={{fontSize : "10px", position : "relative", top : "10px"}}>{ele.team}</b>
                            </ListGroup.Item>
                           }
                        })}
                    </ListGroup>
                </Tab>
            </Tabs>
            
            </Col>
            <Col md = {3}>
                <div>
                {team.length == 11 && <button onClick={selectCVC}>select Captain / Vice Captain</button>}
                </div>
            </Col>
            <ToastContainer/>
            </Row>
            
            <Modal show = {modal} onHide={()=>{
                setModal(false)
                setCaptain("")
                setViceCaptain("")
            }}>
                <Modal.Body>
                    <Table>
                        <thead>
                            <tr>
                                <th>Players</th>
                                <th>C</th>
                                <th>VC</th>
                            </tr>
                        </thead>
                        <tbody>
                    {team.map(ele =>{
                        return(
                            <tr>
                                <td>{ele.name}</td>
                                <td>
                                <input type='radio' name='C' disabled = {ele.name == viceCaptain}
                                value={ele.name} onChange={(e)=>setCaptain(e.target.value) }
                                /> 
                                </td>
                                <td>
                                <input type='radio'name='VC' value={ele.name} onChange={(e)=>setViceCaptain(e.target.value)}
                                disabled = {ele.name == captain}/>
                                </td>
                            </tr>
                        )
                    })}

                        </tbody>
                    </Table>
                    
                </Modal.Body> 
                <Modal.Footer>

                    <Button onClick={handleSubmit}
                    disabled = {captain == "" || viceCaptain == ""}
                    variant='primary'>Submit</Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer/>
        </div>
    )
}