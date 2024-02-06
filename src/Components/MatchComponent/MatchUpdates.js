import { useContext, useState, useRef,useEffect } from "react"
import axios from "../../Axios/axios"
import { Image ,Button,Card, Modal, Table, Tabs, Tab } from "react-bootstrap"
import "./MatchUpdates.css"
import { toast,ToastContainer } from "react-toastify"
import {format} from "date-fns"
import io from "socket.io-client"
import Select from "react-dropdown-select"

const socket = io.connect("http://localhost:3300")



export default function MatchUpdate({m}){

    // const [match,setMatch] = useState(m)
    // const [team1,setTeam1] = useState(m.team1players)
    // const [team2,setTeam2] = useState(m.team2players)
    // const [match,setMatch] = useState(m)
    const [team1,setTeam1] = useState(m.team1players)
    const [team2,setTeam2] = useState(m.team2players)
    // const [score,setScore] = useState("")
    const [modal,setModal] = useState('')
    const [selectedPlayer,setSelectedPlayer] = useState("")
    const [spotLight,setSpotLight] = useState([])
    const [score ,setScore] = useState({}) //update
    const [breakDown , setBreakDown] = useState({})

    useEffect(() => {
        if (modal) {
          breakDownFunc();
        }
      }, [modal]);
      
    const breakDownFunc = () => {
        const obj = { runs: 0, four: 0, six: 0, halfCentury : 0,century : 0 ,wicket : 0 ,w3Haul : 0 ,w4Haul : 0 ,w5Haul : 0, catch : 0, runOut : 0,stumping : 0 ,maiden : 0};
        selectedPlayer && selectedPlayer.score.forEach((ele) => {
          if (ele.type === "Runs") {obj.runs += ele.points}
          if (ele.type === "Four") {obj.four += ele.points}
          if (ele.type === "Six") {obj.six += ele.points}
          if (ele.type === "HalfCentury") {obj.halfCentury += ele.points}
          if (ele.type === "Century") {obj.century += ele.points}
          if (ele.type === "Wicket") {obj.wicket += ele.points}
          if (ele.type === "3WHaul") {obj.w3Haul += ele.points} 
          if (ele.type === "4WHaul") {obj.w4Haul += ele.points}
          if (ele.type === "5WHaul") {obj.w5Haul += ele.points}
          if (ele.type === "Catch") {obj.catch += ele.points}
          if (ele.type === "Maiden") {obj.maiden += ele.points}
          if (ele.type === "RunOut") {obj.runOut += ele.points}
          if (ele.type === "Stumping") {obj.stumping += ele.points}
        })
        setBreakDown(obj)
      };

    const updateTeam1 = (id,action) =>{
        const update = team1.map(ele =>{
            if(action == "update"){
            if(ele._id == id){
                switch(score.type){
                    case "Four" : {
                        return {...ele , score : [...ele.score ,{ type: "Runs", points: 4, time: new Date() , id : Number(new Date())}, score]}
                    }
                    case "Six" : {
                        return {...ele , score : [...ele.score ,{ type: "Runs", points: 6, time: new Date(), id : Number(new Date())}, score]}
                    }
                    case "Runs" : 
                    case "HalfCentury":
                    case "Century":
                    case "Wicket":
                    case "3WHaul":
                    case "4WHaul":
                    case "5WHaul":
                    case "Maiden":
                    case "Catch":
                    case "RunOut":
                    case "Stumping":
                        return {...ele , score : [...ele.score, {...score , time: new Date(), id : Number(new Date()) }]}
                }
            }
            else{
                return {...ele}
            } 
        }if(action = "undo"){
            if(ele._id == id){
                if((ele.score[ele.score.length - 1].type == "Four") || (ele.score[ele.score.length - 1].type == "Six")){
                    return {...ele , score : ele.score.slice(0, -2)}
                }
                else{
                    return {...ele , score : ele.score.slice(0, -1)}
                }
                
            }
            else{
                return {...ele}
            }
        } 
    })
        setTeam1(update)
    }

    const updateTeam2 = (id,action) =>{
        const update = team2.map(ele =>{
            if(action == "update"){
            if(ele._id == id){
                switch(score.type){
                    case "Four" : {
                        return {...ele , score : [...ele.score ,{ type: "Runs", points: 4, time: new Date() , id : Number(new Date())}, score]}
                    }
                    case "Six" : {
                        return {...ele , score : [...ele.score ,{ type: "Runs", points: 6, time: new Date(), id : Number(new Date())}, score]}
                    }
                    case "Runs" : 
                    case "HalfCentury":
                    case "Century":
                    case "Wicket":
                    case "3WHaul":
                    case "4WHaul":
                    case "5WHaul":
                    case "Maiden":
                    case "Catch":
                    case "RunOut":
                    case "Stumping":
                        return {...ele , score : [...ele.score, {...score , time: new Date(), id : Number(new Date()) }]}
                }
            }
            else{
                return {...ele}
            }
        }if(action = "undo"){
            if(ele._id == id){
                if((ele.score[ele.score.length - 1].type == "Four") || (ele.score[ele.score.length - 1].type == "Six")){
                    return {...ele , score : ele.score.slice(0, -2)}
                }
                else{
                    return {...ele , score : ele.score.slice(0, -1)}
                }
                
            }
            else{
                return {...ele}
            }
        } 
    })
        setTeam2(update)
    }

    
    const updateMatch = async () =>{
        
        const body = {
            team1players : team1,
            team2players : team2
        }
    
        try{
            const response = await axios.put(`api/match/${m._id}/score-updates`,body,{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            })
            toast.success("Scores updated")
            console.log(response)
         
        }catch(e){
            e.response.data.errors.map(ele =>{
                toast.error(ele.msg)
            })
        }
    }


    const handleChange = (e,player) =>{
        const data = {
            type: e.target.options[e.target.selectedIndex].getAttribute("name"),
            points: Number(e.target.value),
            time: new Date()
        }
        setScore(data)
        setSelectedPlayer(player)
    }

    console.log(team1)

    const handleDelete = (player,id) =>{

        const confirm = window.confirm("are you sure")

        if(confirm){

        
      const newArr = player.score.filter(ele =>{
        return ele.id !== id
        })
        const updatedPlayer = {...player , score : newArr} 
        setSelectedPlayer(updatedPlayer)
        
        if(m.team1 == player.team){
            
            const arr = team1.map(ele =>{
                if(ele._id == player._id){
                    return {...ele , ...updatedPlayer}
                }
                else{
                    return {...ele}
                }
            })
            console.log(arr,"arr")
            setTeam1(arr)
        }
        else{
            const arr = team2.map(ele =>{
                if(ele._id == player._id){
                    return {...ele , ...updatedPlayer}
                }
                else{
                    return {...ele}
                }
            })
            setTeam2(arr)
        }
    }
    }



    return(
        <div>
            {new Date(m.deadline) < new Date() && !m.isCompleted && <Button variant="dark" onClick={updateMatch}>updateMatch</Button>}
            <h4>Add to Spotlight</h4>
            <Select
            multi
            searchable
            options={[...m.team1players ,...m.team2players].map(ele => {
                return {value : ele._id , label : ele.name}
            })}
            clearable
            onChange={(values)=>{
                const arr = values.map(ele => ele.value)
                setSpotLight(arr)
            }}
            />
           { console.log(spotLight)}
            <div className="update-players" >
            {team1.filter(ele => {
                if(spotLight.length > 0){
                    if(spotLight.includes(ele._id)){
                        return ele
                    }
                }else{
                    return ele
                }
            }).map(ele =>{
                return(
                    <Card border="light" bg="dark" text="light" style={{ width: '200px'}}>
                        <div style={{overflow : "hidden"}}>
                        <Card.Img  variant="top" src={`https://fantasy11.s3.ap-south-1.amazonaws.com/players/${ele.pic}`} />
                        </div>
                    <Card.Body>
                        <Card.Title >{ele.name}</Card.Title>
                        <Card.Text>Score - {ele.score.reduce((acc,cv)=> acc += cv.points,0)}
                        <br/>
                        <select
                        onChange={(e)=>handleChange(e,ele)}
                        >
                            <option value={""}>Select</option>
                            <option name = "Runs" value={1}>1Run</option>
                            <option name = "Runs" value={2}>2Runs</option>
                            <option name = "Runs" value={3}>3Runs</option>
                            <option name = "Four" value={1}>Four</option>
                            <option name = "Six" value={2}>Six</option>
                            <option name = "HalfCentury" value={10}>Half Century</option>
                            <option name = "Century" value={20}>Century</option>
                            <option name = "Wicket" value={25}>Wicket</option>
                            <option name = "3WHaul" value={10}>3W haul</option>
                            <option name = "4WHaul" value={20}>4W haul</option>
                            <option name = "5WHaul" value={30}>5W haul</option>
                            <option name = "Maiden" value={5}>Maiden</option>
                            <option name = "Catch" value={4}>Catch</option>
                            <option name = "RunOut" value={4}>RunOut</option>
                            <option name = "Stumping" value={10}>Stumping</option>
                        </select>
                        <button onClick={()=>updateTeam1(ele._id,"update")} disabled = {!(selectedPlayer._id == ele._id)}>+</button>
                        <button onClick={()=>updateTeam1(ele._id,"undo")} disabled = {ele.score.length <= 0}>undo</button>
                        <button onClick={()=>{
                            setSelectedPlayer(ele)
                            setModal(true) 
                        }
                        }>view</button>
                       
                        </Card.Text>
                    </Card.Body>
                </Card>
                )
            })}
          
            {team2.filter(ele => {
                if(spotLight.length > 0){
                    if(spotLight.includes(ele._id)){
                        return ele
                    }
                }else{
                    return ele
                }
            }).map(ele =>{ 
                return(
                    <Card bg="danger" text="light" style={{ width: '200px'}}>
                        <Card.Img  variant="top" src={`https://fantasy11.s3.ap-south-1.amazonaws.com/players/${ele.pic}`} />
                    <Card.Body>
                        <Card.Title >{ele.name}</Card.Title>
                        <Card.Text>Score - {ele.score.reduce((acc,cv)=> acc += cv.points,0)}
                        <br/>
                        <select
                        onChange={(e)=>handleChange(e,ele)}
                        >
                            <option value={""}>Select</option>
                            <option name = "Runs" value={1}>1Run</option>
                            <option name = "Runs" value={2}>2Runs</option>
                            <option name = "Runs" value={3}>3Runs</option>
                            <option name = "Four" value={1}>Four</option>
                            <option name = "Six" value={2}>Six</option>
                            <option name = "HalfCentury" value={10}>Half Century</option>
                            <option name = "Century" value={20}>Century</option>
                            <option name = "Wicket" value={25}>Wicket</option>
                            <option name = "3WHaul" value={10}>3W haul</option>
                            <option name = "4WHaul" value={20}>4W haul</option>
                            <option name = "5WHaul" value={30}>5W haul</option>
                            <option name = "Maiden" value={5}>Maiden</option>
                            <option name = "Catch" value={4}>Catch</option>
                            <option name = "RunOut" value={4}>RunOut</option>
                            <option name = "Stumping" value={10}>Stumping</option>
                        </select>
                        <button onClick={()=>updateTeam2(ele._id,"update")} disabled = {!(selectedPlayer._id == ele._id)}>+</button>
                        <button onClick={()=>updateTeam2(ele._id,"undo")} disabled = {ele.score.length <= 0}>undo</button>
                        <button onClick={()=>{
                            setSelectedPlayer(ele)
                            setModal(true) 
                        }
                        }>view</button> 
                        </Card.Text>
                    </Card.Body>
                </Card>
                )
            })}

            </div>
            <Modal show = {modal} onHide={()=>{
                setModal(false)
                }}>
                <Modal.Header>
                    {selectedPlayer.name}
                </Modal.Header>
                <Modal.Body>
                <Tabs defaultActiveKey={"BreakDown"}>
                    <Tab eventKey={"BreakDown"} title = "BreakDown">
                    <Table border={1} striped>
                        <thead>
                            <th>Event</th>
                            <th>Points</th>
                            <th>Actual</th>
                        </thead>
                        <tbody>
                            <tr><td>Runs</td><td>{breakDown.runs}</td><td>{breakDown.runs}</td></tr>
                            <tr><td>Four</td><td>{breakDown.four}</td><td>{breakDown.four}</td></tr>
                            <tr><td>Six</td><td>{breakDown.six}</td><td>{breakDown.six / 2}</td></tr>
                            <tr><td>HalfCentury</td><td>{breakDown.halfCentury}</td><td>{breakDown.halfCentury / 10}</td></tr>
                            <tr><td>Century</td><td>{breakDown.century}</td><td>{breakDown.century / 20}</td></tr>
                            <tr><td>Wicket</td><td>{breakDown.wicket}</td><td>{breakDown.wicket / 25}</td></tr>
                            <tr><td>3WHaul</td><td>{breakDown.w3Haul}</td><td>{breakDown.w3Haul /10}</td></tr>
                            <tr><td>4WHaul</td><td>{breakDown.w4Haul}</td><td>{breakDown.w4Haul /20}</td></tr>
                            <tr><td>5WHaul</td><td>{breakDown.w5Haul}</td><td>{breakDown.w5Haul / 30}</td></tr>
                            <tr><td>Maiden</td><td>{breakDown.maiden}</td><td>{breakDown.maiden / 5}</td></tr>
                            <tr><td>Catch</td><td>{breakDown.catch}</td><td>{breakDown.catch / 4}</td></tr>
                            <tr><td>Runout</td><td>{breakDown.runOut}</td><td>{breakDown.runOut / 4}</td></tr>
                            <tr><td>Stumping</td><td>{breakDown.stumping}</td><td>{breakDown.stumping / 10}</td></tr>
                        </tbody>
                    </Table >
                    </Tab>
                    <Tab eventKey={"List"} title = "List">
                        <Table border={1} striped>
                        <thead>
                            <th>Type</th>
                            <th>Points</th>
                            <th>Time</th>
                            <th>action</th>
                        </thead>
                        <tbody>
                            {selectedPlayer && selectedPlayer.score.map(ele =>{
                                return(<tr>
                                    <td>{ele.type}</td>
                                    <td>{ele.points}</td>
                                    <td>{format(ele.time,"H:mm a")}</td>
                                    <td><Button size="sm" variant="danger" onClick={()=>handleDelete(selectedPlayer,ele.id)}>Delete</Button></td>
                                </tr>)
                            })}
                        </tbody>
                        </Table>
                    </Tab>
                </Tabs>
                </Modal.Body>
            </Modal>
            <ToastContainer/>
        </div>
    )
}