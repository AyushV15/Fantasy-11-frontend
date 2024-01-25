import { useContext, useState } from "react"
import axios from "../../Axios/axios"
import { Image ,Button,Card } from "react-bootstrap"
import "./MatchUpdates.css"
import { toast,ToastContainer } from "react-toastify"
import { MatchContext } from "../../Context/Context"
import { useParams } from "react-router-dom"

export default function MatchUpdate({m}){

    const [match,setMatch] = useState(m)
    const [team1,setTeam1] = useState(m.team1players)
    const [team2,setTeam2] = useState(m.team2players)
    const [score,setScore] = useState("")

    const update1 = (id) =>{
        const update = team1.map(ele =>{
            if(id == ele._id){
                ele.score += Number(score)
                return ele
            }
            else{
                return {...ele}
            }
        })
        setTeam1(update)
        setScore(0)
    }

    const update2 = (id) =>{
        const update = team2.map(ele =>{
            if(id == ele._id){
                ele.score += Number(score)
                return ele
            }
            else{
                return {...ele}
            }
        })
        setTeam2(update)
        setScore(0)
    }

    const updateMatch = async () =>{
        const data = match
        match.team1players = team1
        match.team2players = team2

        try{
            const response = await axios.put(`api/match/${match._id}/score-updates`,data,{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            })
            toast.success("Scores updated")
            console.log(response)
        
        }catch(e){
            console.log(e)
        }
    }

    return(
        <div>
            <Button variant="dark" onClick={updateMatch}>updateMatch</Button>
            <div className="update-players" >
            {team1.map(ele =>{
                return(
                    <Card border="light" bg="dark" text="light" style={{ width: '200px'}}>
                        <Card.Img  variant="top" src={`https://fantasy11.s3.ap-south-1.amazonaws.com/players/${ele.pic}`} />
                    <Card.Body>
                        <Card.Title >{ele.name}</Card.Title>
                        <Card.Text>Score - {ele.score}
                        <br/>
                        <input type="number"  onChange={(e)=>setScore(e.target.value)} style={{width : "50px"}}/><Button variant="danger" size="sm" onClick={()=>update1(ele._id)}>+</Button>
                        </Card.Text>
                    </Card.Body>
                </Card>
                )
            })}
          
            {team2.map(ele =>{
                return(
                    <Card bg="danger" text="light" style={{ width: '200px'}}>
                        <Card.Img  variant="top" src={`https://fantasy11.s3.ap-south-1.amazonaws.com/players/${ele.pic}`} />
                    <Card.Body>
                        <Card.Title >{ele.name}</Card.Title>
                        <Card.Text>Score - {ele.score}
                        <br/>
                        <input type="number"  onChange={(e)=>setScore(e.target.value)} style={{width : "50px"}}/><Button variant="dark" size="sm" onClick={()=>update2(ele._id)}>+</Button>
                        </Card.Text>
                    </Card.Body>
                </Card>
                )
            })}

            </div>
            <ToastContainer/>
        </div>
    )
}