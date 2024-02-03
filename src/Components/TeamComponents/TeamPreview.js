
import { useEffect, useState } from "react"
import "./TeamPreview.css"
import { Row ,Badge,Figure, Modal,Table,Image} from "react-bootstrap"
import { useNavigate } from "react-router-dom"


export default function TeamPreview({team,match}){

    const navigate = useNavigate()
    const [modal,setModal] = useState(false) 
    const [selectedPlayer,setSelectedPlayer] = useState(null)
    const [breakDown ,setBreakDown] = useState({})

    useEffect(()=>{
        if(modal){
            breakDownFunc()
        }
    },[modal])

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
 
    // const calculatePoints = () =>{
    //     const points = team.team.reduce((acc,cv) =>{
    //         if(cv.C){
    //             acc += 2 * cv.score.reduce((e,ce)=> e += ce.points,0)
    //         }
    //         else if(cv.VC){ 
    //             acc += 1.5 * cv.score.reduce((e,ce)=> e += ce.points,0)
    //         }else{
    //             acc += cv.score.reduce((e,ce)=> e += ce.points,0)
    //         }
    //         return acc
    //     },0)
    //     return points
    // }

    const handleView = (player) =>{
        setSelectedPlayer(player)
        setModal(true)
    }

    return(
        <div>
        <h3 style={{textAlign : "center"}}>Points - {team.totalPoints}</h3>
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
                                onClick={()=>handleView(e)}
                                />
                                <Figure.Caption className="player-badge">
                                {e.C && <Badge style={{height : "20px"}} bg="primary">C</Badge>}
                                {e.VC && <Badge style={{height : "20px"}} bg="warning">VC</Badge>}
                                <Badge style={{height : "20px"}} bg="dark">{e.name}</Badge>
                                <Badge style={{height : "20px"}} bg="dark">{e.C && e.score.reduce((acc,cv)=>acc+=cv.points,0) * 2}{e.VC && e.score.reduce((acc,cv)=>acc+=cv.points,0) * 1.5}{(!e.C && !e.VC) && e.score.reduce((acc,cv)=>acc+=cv.points,0) }</Badge>
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
                                onClick={()=>handleView(e)}
                                />
                                <Figure.Caption className="player-badge">
                                {e.C && <Badge style={{height : "20px"}} bg="primary">C</Badge>}
                                {e.VC && <Badge style={{height : "20px"}} bg="warning">VC</Badge>}
                                <Badge style={{height : "20px"}} bg="dark">{e.name}</Badge>
                                <Badge style={{height : "20px"}} bg="dark">{e.C && e.score.reduce((acc,cv)=>acc+=cv.points,0) * 2}{e.VC && e.score.reduce((acc,cv)=>acc+=cv.points,0) * 1.5}{(!e.C && !e.VC) && e.score.reduce((acc,cv)=>acc+=cv.points,0)}</Badge>
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
                                onClick={()=>handleView(e)}
                                />
                                <Figure.Caption className="player-badge">
                                {e.C && <Badge style={{height : "20px"}} bg="primary">C</Badge>}
                                {e.VC && <Badge style={{height : "20px"}} bg="warning">VC</Badge>}
                                <Badge style={{height : "20px"}} bg="dark">{e.name}</Badge>
                                <Badge style={{height : "20px"}} bg="dark">{e.C && e.score.reduce((acc,cv)=>acc+=cv.points,0) * 2}{e.VC && e.score.reduce((acc,cv)=>acc+=cv.points,0) * 1.5}{(!e.C && !e.VC) && e.score.reduce((acc,cv)=>acc+=cv.points,0)}</Badge>
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
                                onClick={()=>handleView(e)}
                                />
                                <Figure.Caption className="player-badge">
                                {e.C && <Badge style={{height : "20px"}} bg="primary">C</Badge>}
                                {e.VC && <Badge style={{height : "20px"}} bg="warning">VC</Badge>}
                                <Badge style={{height : "20px"}} bg="dark">{e.name}</Badge>
                                <Badge style={{height : "20px"}} bg="dark">{e.C && e.score.reduce((acc,cv)=>acc+=cv.points,0) * 2}{e.VC && e.score.reduce((acc,cv)=>acc+=cv.points,0) * 1.5}{(!e.C && !e.VC) && e.score.reduce((acc,cv)=>acc+=cv.points,0)}</Badge>
                                </Figure.Caption>
                            </Figure>
                        )
                    })}
            </div>
            </Row>
            <Modal show = {modal} onHide={()=>setModal(false)} >
                <Modal.Header closeButton>
                    <Image height={70} width={80} src={`https://fantasy11.s3.ap-south-1.amazonaws.com/players/${selectedPlayer &&selectedPlayer.pic}`}/>
                    <b>{selectedPlayer && selectedPlayer.name}</b>
                    
                    </Modal.Header>
                <Modal.Body>
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
                </Modal.Body>
            </Modal>
        </div>
        </div>
    )
}