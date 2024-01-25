
import "./TeamPreview.css"
import { Row ,Badge,Figure} from "react-bootstrap"
import { useNavigate } from "react-router-dom"


export default function TeamPreview({team,match}){

    const navigate = useNavigate()
 
    const calculatePoints = () =>{
        const points = team.team.reduce((acc,cv) =>{
            if(cv.C){
                acc += 2 * cv.score
            }
            else if(cv.VC){ 
                acc += 1.5 * cv.score
            }else{
                acc += cv.score
            }
            return acc
        },0)
        return points
    }

    return(
        <div>
        
        <h3 style={{textAlign : "center"}}>Points - {calculatePoints()}</h3>
        {match && new Date(match.deadline) > new Date() && <button onClick={()=>navigate(`/match/${match._id}/create-team`)}>Edit Team</button>}
        
        <div className="team">
            <Row className="teamrow">
                <b>Wicket Keeper</b>
                <div className="display-player">
                    
                    {team.team.filter(ele => ele.role === "wk").map(e => {
                        return (
                            <Figure key={e._id}>
                                <Figure.Image
                                height={50}
                                width={60}
                                src={`https://fantasy11.s3.ap-south-1.amazonaws.com/players/${e.pic}`}
                                />
                                <Figure.Caption className="player-badge">
                                {e.C && <Badge style={{height : "20px"}} bg="primary">C</Badge>}
                                {e.VC && <Badge style={{height : "20px"}} bg="warning">VC</Badge>}
                                <Badge style={{height : "20px"}} bg="dark">{e.name}</Badge>
                                <Badge style={{height : "20px"}} bg="dark">{e.C && e.score * 2}{e.VC && e.score * 1.5}{(!e.C && !e.VC) && e.score }</Badge>
                                </Figure.Caption>
                            </Figure>
                        )
                    })}
                </div>
            </Row>
            <Row className="teamrow">
            <b>Batsman</b>
            <div>
           
            {team.team.filter(ele => ele.role === "bat").map(e => {
                        return (
                            <Figure key={e._id}>
                                <Figure.Image
                                height={50}
                                width={60}
                                src={`https://fantasy11.s3.ap-south-1.amazonaws.com/players/${e.pic}`}
                                />
                                <Figure.Caption className="player-badge">
                                {e.C && <Badge style={{height : "20px"}} bg="primary">C</Badge>}
                                {e.VC && <Badge style={{height : "20px"}} bg="warning">VC</Badge>}
                                <Badge style={{height : "20px"}} bg="dark">{e.name}</Badge>
                                <Badge style={{height : "20px"}} bg="dark">{e.C && e.score * 2}{e.VC && e.score * 1.5}{(!e.C && !e.VC) && e.score}</Badge>
                                </Figure.Caption>
                            </Figure>
                        )
                    })}
            </div>
            </Row>
            <Row className="teamrow">
            <b>All Rounders</b>
            <div>
            {team.team.filter(ele => ele.role === "all").map(e => {
                        return (
                            <Figure key={e._id}>
                                <Figure.Image
                                height={50}
                                width={60}
                                src={`https://fantasy11.s3.ap-south-1.amazonaws.com/players/${e.pic}`}
                                />
                                <Figure.Caption className="player-badge">
                                {e.C && <Badge style={{height : "20px"}} bg="primary">C</Badge>}
                                {e.VC && <Badge style={{height : "20px"}} bg="warning">VC</Badge>}
                                <Badge style={{height : "20px"}} bg="dark">{e.name}</Badge>
                                <Badge style={{height : "20px"}} bg="dark">{e.C && e.score * 2}{e.VC && e.score * 1.5}{(!e.C && !e.VC) && e.score}</Badge>
                                </Figure.Caption>
                            </Figure>
                        )
                    })}
            </div>
            </Row>
            <Row className="teamrow">
            <b>Bowlers</b>
            <div>
            {team.team.filter(ele => ele.role === "bowl").map(e => {
                        return (
                            <Figure key={e._id}>
                                <Figure.Image
                                height={50}
                                width={60}
                                src={`https://fantasy11.s3.ap-south-1.amazonaws.com/players/${e.pic}`}
                                />
                                <Figure.Caption className="player-badge">
                                {e.C && <Badge style={{height : "20px"}} bg="primary">C</Badge>}
                                {e.VC && <Badge style={{height : "20px"}} bg="warning">VC</Badge>}
                                <Badge style={{height : "20px"}} bg="dark">{e.name}</Badge>
                                <Badge style={{height : "20px"}} bg="dark">{e.C && e.score * 2}{e.VC && e.score * 1.5}{(!e.C && !e.VC) && e.score}</Badge>
                                </Figure.Caption>
                            </Figure>
                        )
                    })}
            </div>
            </Row>
            
        </div>
        </div>
    )
}