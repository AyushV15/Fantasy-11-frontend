import { useEffect, useState, useContext } from "react"
import axios from "../../Axios/axios"
import Countdown from 'react-countdown';
import { useNavigate } from "react-router-dom";
import { Card ,Image,Button} from "react-bootstrap";
import "./ListMatch.css"
import { MatchContext } from "../../Context/Context";
import { useSelector } from "react-redux";


export default function ListMatches(){

    // const [matches ,setMatches] = useState([]) previous code
    const [render,setrender] = useState(false)

    const {matches,pagedispatch,page,refresh} = useContext(MatchContext)
    const navigate = useNavigate()

    console.log(matches)
    return(
        <div>   
            {matches && matches.map(ele => {
                
                return(
                    <Card className="text-center mb-4 mt-4"  key={ele._id}>
                        <Card.Header className="cardheader">{ele.tournament}</Card.Header>
                        <Card.Body className="card-body">
        <Card.Title >
        <p>{ele.team1} vs {ele.team2}</p>
        <Image src={`https://fantasy11.s3.ap-south-1.amazonaws.com/matches/${ele.team1logo}`} height={150} width={150}  className="team1"/>  
            VS  
        <Image src={`https://fantasy11.s3.ap-south-1.amazonaws.com/matches/${ele.team2logo}`} height={150} width={150} className="team2"/>
        </Card.Title>
        <Button variant="primary" size="sm" onClick={()=>navigate(`/match/${ele._id}`)}>Enter Match</Button>
      </Card.Body>
      <Card.Footer>
        
      <Countdown className="card-footer"
            date={Date.now() + (new Date(ele.deadline).getTime() - Date.now())}
            onComplete={()=>{
                refresh()
            }}
        />
      </Card.Footer>
        </Card>
            )
            })}

            {page > 1 && <Button onClick={()=>{
                pagedispatch({type : "DECREMENT"})
            }} className="float-start">previous</Button>}
            {matches.length == 2 && 
            <Button onClick={()=>{
                pagedispatch({type : "INCREMENT"})
            }} className="float-end">next</Button>
            }

            {matches.length == 0 && 
            <div className="no-matches">
               <h1>No more matches found</h1>
            </div>
            }
        </div>
    
    )
}