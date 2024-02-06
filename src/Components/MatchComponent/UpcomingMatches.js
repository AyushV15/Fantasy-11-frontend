import { Card,Image,Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
const _ = require('lodash')


export default function UpcomingMatches({user}){

    const navigate = useNavigate()
   
    return(
        <div>
            {Object.keys(user).length > 0  && user.matches.map(ele =>{
              if(new Date(ele.deadline) > new Date())
              return(
                <Card className="text-center">
                        <Card.Header className="cardheader">{ele.tournament}</Card.Header>
                        <Card.Body className="card-body">
                <Card.Title >
                <p>{ele.team1} vs {ele.team2}</p>
                <Image src={`https://fantasy11.s3.ap-south-1.amazonaws.com/matches/${ele.team1logo}`} width={150} height={150} className="team1"/>  
                  VS  
                <Image src={`https://fantasy11.s3.ap-south-1.amazonaws.com/matches/${ele.team2logo}`} width={150} height={150}  style={{height : "150px"}} className="team2"/>
                </Card.Title>
                <Button variant="primary" size="sm" onClick={()=>navigate(`/match/${ele._id}`)}>View Match</Button>
              </Card.Body>
        </Card>
              )
            })}
        </div>
    )
}