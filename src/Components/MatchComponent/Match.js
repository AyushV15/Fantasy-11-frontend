import { useContext, useEffect, useReducer, useState ,useRef} from "react"
import { useAsyncValue, useNavigate, useParams } from "react-router-dom"
import axios from "../../Axios/axios"
import { Tab,Tabs,Image, Col,Row, Button,Card,ProgressBar, ToastContainer} from "react-bootstrap"
import "./Match.css"
import gif from "../../Images/scoreUpdate.gif"
import Countdown from "react-countdown"
import TeamPreview from "../TeamComponents/TeamPreview"
import MatchUpdate from "./MatchUpdates"
import CreateContest from "../ContestComponenets/CreateContest"
import JoinContest from "../ContestComponenets/JoinContest"
import ViewMyContest from "../ContestComponenets/viewMyContest"
import Swal from "sweetalert2"
import Marquee from "react-fast-marquee";
import {SnackbarProvider,enqueueSnackbar} from "notistack"


import io from "socket.io-client";
import {  useSelector } from "react-redux"
import { toast } from "react-toastify"
import { MatchContext } from "../../Context/Context"


const socket = io.connect("http://localhost:3300")

const userContestReducer = (state,action) => {
    switch(action.type){
        case "SET_CONTESTS" : {
            return [...action.payload]
        }
        case "UPDATE_CONTEST" : {
            return state.map(contest => {
                const teams = contest.teams.map(team =>{
                   const t = team.team.map(ele =>{
                        const player = action.payload.find(e => ele._id == e._id)
                        if(player){
                            return {...ele , score : player.score }
                        }
                    })
                    return {...team , team : t}
                })
                return {...contest , teams : teams}
            }) 
        }
        default : {
            return [...state]
        }
    }
}


export default function OneMatch(){
    
    const navigate = useNavigate()
    const [userContest,userContestDispatch] = useReducer(userContestReducer , [])
    const [sUpdate,setSUpdate] = useState(false)
    const [rankCalculated,setRankCalculated] = useState(false)
    const [team ,setTeam] = useState(null)
    const [mycontest,setMyContest] = useState(false)
    const [selectedmyContest,setSelectedMyContest] = useState({})
    const [selectedContest,setSelectedContest] = useState({})
    const [updateContest,setUpdateContest] = useState(false)
    const [teamUpdate,setTeamUpdate] = useState([])
    const [modal,setModal] = useState(false)
    const [contest,setContest] = useState([])

    const {id} = useParams() //getting the match id from url
    const {matches,matchdispatch} = useContext(MatchContext)

    const user = useSelector(state=>{
        return state.user
   })

    console.log(userContest)
    const match = matches.find(ele => ele._id == id)
    const m = !match && Object.keys(user).length > 0 && user.matches.find(ele => ele._id == id)

    const joinMatchRoom = (matchId) => {
        socket.emit('joinMatchRoom', matchId);
    }
    
    useEffect(() => {
        // joining room using match id
        joinMatchRoom(id);
        socket.on('update', (data) => {
            // setRefresh(data);
            setTeamUpdate(data)//data
            console.log(data,"data")
            setSUpdate(true)
            setTimeout(()=>{
                setSUpdate(false)
            },10000)
        });


        socket.on('cancel',(data)=>{
            alert(data)
            navigate('/dashboard')
        })

        socket.on('matchEnded',(data)=>{
            alert(data)
            navigate('/dashboard')
        })

        socket.on("extended",(data)=>{
            matchdispatch({type : "UPDATE_MATCH",payload : data})
        })
        
        return () => {
            socket.off('update');
        }
    }, [socket])
    
    

    useEffect(()=>{ // getting users team from database
        (async() =>{
            try{
                const response = await axios.get(`api/match/${id}/team`,{headers : {
                    Authorization : localStorage.getItem("token")
                }})
                setTeam(response.data)
            }catch(e){
                console.log(e)
            }
        })()
    },[])

    //getting users contest database
    useEffect(()=>{
        (async()=>{
            try{
                const response = await axios.get(`api/contest/${id}`,{headers : {
                    Authorization : localStorage.getItem("token")
                }})
                console.log(response.data,"users contest")
                userContestDispatch({type : "SET_CONTESTS" , payload : response.data})
            }catch(e){
                console.log(e)
            }
        })()
    },[updateContest])

    useEffect(()=>{
        const t = team && team.team.map(ele =>{
            const player = teamUpdate.find(e => ele._id == e._id)
            if(player){
                return {...ele , score : player.score}
            }
        })
        team && setTeam({...team , team : t})
        userContestDispatch({type : "UPDATE_CONTEST" , payload : teamUpdate })
    },[teamUpdate])

    useEffect(()=>{
        (async() =>{
            try{
                const response = await axios.get(`api/match/${id}/contest`,{headers : {
                    Authorization : localStorage.getItem("token")
                }})
                console.log(response,"contest")
                setContest(response.data)
            }catch(e){
                console.log(e)
            }
        })()
    },[updateContest])
 
    const handleJoin = (ele) =>{
        setModal(true)
        setSelectedContest(ele)

    }

    const closeModal = () =>{
        setModal(false)
    }

    const fetchContest = () =>{
        setUpdateContest(!updateContest)
    }
 
    const handleMyContest = (ele) =>{
        setMyContest(true)
        setSelectedMyContest(ele)
    }

    const closeMyContest = () =>{
        setMyContest(false)
    }

    const contestUpdate = async (id) =>{
        try{
            const response = await axios.put(`api/match/${id}/generate-results`)
            setRankCalculated(true)
            toast.success(response.data)
        }catch(e){
            console.log(e)
        }
    }

    const generateResults = async () =>{
        const { value: confirm } = await Swal.fire({
            imageUrl : "https://static.vecteezy.com/system/resources/previews/026/730/449/original/three-business-people-stand-on-the-podium-and-one-businessman-holds-a-trophy-concept-of-success-and-achievement-trend-modern-flat-illustration-vector.jpg",
            imageAlt : "Image",
            imageHeight : "300px",
            title: "You are Generating Results",
            input: "text",
            text: "make sure u have calculated the rank after the match has ended,you wont be able to revert back the changes",
            inputLabel : `Enter ${m._id}/admin`,
            inputValidator: (value) => {
                return value !== `${m._id}/admin` && "matchid does not match";
            },
            showCancelButton : true,
            inputPlaceholder: `Enter ${m._id}/admin`
          });
          if(confirm == `${m._id}/admin`) {
              try{
                  await axios.put(`api/match/${m._id}/declare-results`,{},{headers : {
                    Authorization : localStorage.getItem('token')
                  }})
                  toast.success("Results Generated Successfully")
                  navigate("/dashboard")
              }catch(e){
                  toast.error(e.response.data)
              }
            }
    }

    const cancelMatch = async () =>{
        const { value : confirm} = await Swal.fire({
            icon : "error",
            imageHeight : "300px",
            title: "You are Cancelling the Match",
            input: "text",
            text: "you wont be able to revert back the changes",
            inputLabel : `Enter ${match ? match._id : m._id}/admin`,
            inputValidator: (value) => {
                return value !== `${match ? match._id : m._id}/admin` && "matchid does not match";
            },
            showCancelButton : true,
            inputPlaceholder: `Enter ${match ? match._id : m._id}/admin`
          });
          if(confirm == `${match ? match._id : m._id}/admin`) {
              try{
                  await axios.delete(`api/match/${match ? match._id : m._id}/cancel-match`,{
                    headers : {
                        Authorization : localStorage.getItem('token')
                    }
                  })
                  toast.success("match cancelled Generated Successfully")
              }catch(e){
                  console.log(e)
              }
            }
    }

    const extendDeadline = async () => {

        const { value: formValues } = await Swal.fire({
            title: "Extend Deadline",
            html: `
              <input id="deadline" type="datetime-local" required>
              <input id="message" type="text">
            `,
            focusConfirm: false,
            preConfirm: () => {
              const deadlineValue = document.getElementById("deadline").value;
              const messageValue = document.getElementById("message").value.trim();
          
              if(!deadlineValue){
                Swal.showValidationMessage("Deadline is Required");
                return false;
              }
              if (new Date(deadlineValue) < new Date()) {
                Swal.showValidationMessage("Deadline should be greater than today");
                return false;
              }
          
              if (messageValue.length === 0) {
                Swal.showValidationMessage("Message is required");
                return false;
              }
          
              return {
                deadline: new Date(deadlineValue),
                message: messageValue,
              };
            },
          })
          if (formValues) {
              try{
                  const response = await axios.put(`api/matches/${id}`,formValues,{
                      headers : {
                          Authorization : localStorage.getItem("token")
                      }
                  })
              }catch(e){
                  console.log(e)
              }
        }
    }

    const cancelContests = async () =>{
        try{
            const response = await axios.delete(`/api/match/${id}/cancel-contests`,{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            })
            toast.success("unfilled contests cancelled successfully")
            
        }catch(e){
            toast.error(e.response.data)
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
            
            
                {match ? (
            <div className="match-navbar">
             <h1> { match.tournament}</h1>
                <div className="d-flex flex-row align-items-center">
                    <Image src={`https://fantasy11.s3.ap-south-1.amazonaws.com/matches/${ match.team1logo}`} className="nav-team1"/>
                <p>{ match.team1name}</p> 
                <p>vs</p> 
                <p>{ match.team2name}</p>
                <Image src={`https://fantasy11.s3.ap-south-1.amazonaws.com/matches/${match.team2logo}`} className="nav-team1"/>
                </div>
            </div>
            ):(
                m && (
            <div className="match-navbar">
                <h1> {m.tournament}</h1>
                <div className="d-flex flex-row align-items-center">
                    <Image src={`https://fantasy11.s3.ap-south-1.amazonaws.com/matches/${m.team1logo}`} className="nav-team1"/>
                <p>{m.team1name}</p> 
                <p>vs</p> 
                <p>{m.team2name}</p>
                <Image src={`https://fantasy11.s3.ap-south-1.amazonaws.com/matches/${m.team2logo}`} className="nav-team1"/>
                </div>
            </div>
            ))}

                {match && match.message !== "stop" &&
                <div>
                    <Marquee
                    direction="right"
                    > 
                        <p>{match && match.message}</p>
                    </Marquee>
                </div>}
        
            <div style={{display : "flex",justifyContent : "center"}}>
                {sUpdate && <Image src={gif} width={200}/> }
            </div>
          
            {user.role == "admin" && (
            <div>
            {m && !m.isCompleted &&<Button size="sm" variant = "success" onClick={()=>contestUpdate(m._id)}>Calculate Rank</Button>}
            {match && !match.isCompleted && <Button size="sm" onClick={()=>navigate(`/match/${match ? match._id : m._id}/create-contest`)}>Create Contest</Button>} 
            {rankCalculated && <Button variant = "info" onClick={generateResults}>Generate Results</Button>}
            {!m.isCompleted && <Button size="sm" variant = "danger" onClick={cancelMatch}>Cancel Match</Button>}
            {m && !m.isCompleted && <Button size="sm" variant="warning" onClick={cancelContests}>Cancel Contest</Button>}

            {match && !match.isCompleted && <Button size="sm" variant="secondary" onClick={extendDeadline}>Extend Deadline</Button>}
            </div>
            )}
            {user.role == "user" && <Row>
                <Col md = {2}>
            </Col>
                <Col md = {8}>
                <Tabs className="match-tabs" defaultActiveKey="Contest" id="justify-tab-example" justify>
                    <Tab eventKey="Contest" title="Contest">
                    
                        <Tabs className="match-tabss" defaultActiveKey={match && new Date(match.deadline) > new Date() ? "All Contest" : "My Contest"} id="justify-tab-example" justify>

                        {(match || m) && new Date(match?.deadline || m.deadline) > new Date() && (

                            <Tab eventKey="All Contest" title="All contest">     
                        {team ? (

                            contest.length == 0 || contest.every(ele => ele.slots == ele.teams.length) ? (
                                <h3>No Contests Found , Check again later</h3>
                            ) : (
                            contest.map(ele =>{
                                if(ele.slots !== ele.teams.length){
                                    return(
                                        <Card>
                                            <Card.Header as="h5">1st prize {ele.totalPrize} 💰</Card.Header>
                                            <Card.Body>
                                            <Card.Title>Slots - {ele.slots}</Card.Title>
                                            <Card.Title>Winners - {ele.winners}</Card.Title>
                                            <Card.Title>
                                            <ProgressBar variant="success" now={ele.teams.length} max={ele.slots} />
                                            </Card.Title>
                                            { !(team && ele.teams.find(ele => ele == team._id)) && 
                                            <Button variant="primary" onClick={()=>handleJoin(ele)}> Rs {ele.entryFee}</Button>
                                            }
                                             
                                        </Card.Body>
                                        </Card>
                                    )
                                }
                            }))
                        ) : (
                            contest.length == 0 ? <h3>No Contests Found , Check again later</h3> :
                            "Create a Team to view Contest"
                        )}
                            </Tab>
                        )}    
                            <Tab eventKey="My Contest" title="My contest" >
                                {userContest.map(ele =>{
                                    return(
                                        <Card>
                                            <Card.Header as="h5">1st prize {ele.totalPrize} 💰</Card.Header>
                                            <Card.Body>
                                            <Card.Title>Slots - {ele.slots}</Card.Title>
                                            <Card.Title>Winners - {ele.winners}</Card.Title>
                                            <Button variant="primary" onClick={()=>handleMyContest(ele)}>view</Button>
                                        </Card.Body>
                                        </Card>
                                    )
                                })}
                                
                            </Tab>
                        </Tabs>
                    </Tab>
                    <Tab eventKey="Team" title="Team">
                        <div className="create-team-button">
                        {team ? (
                            <div>
                                <TeamPreview team={team} match={match}/>
                            </div>
                        ) : (<Button onClick={()=>navigate(`/match/${match._id}/create-team`)}>Create Team</Button>)}
                        </div>
                    </Tab>
                </Tabs>
                </Col>
                <Col md = {2}>
                </Col>
            </Row>}

            {(match||m )&& user.role == "admin" && <MatchUpdate m = {match ? match : m}/>}
            
            {modal && <JoinContest 
            closeModal = {closeModal} 
            ele = {selectedContest} 
            team={team}
            fetchContest={fetchContest}
            />}

            {mycontest && <ViewMyContest
            ele = {selectedmyContest}
            close = {closeMyContest}
            match = {match}
            m={m}
            />}
        <ToastContainer/>
        </div>
    )
}