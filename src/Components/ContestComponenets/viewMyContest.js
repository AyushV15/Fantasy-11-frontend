import { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Modal, Table,Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast ,ToastContainer } from "react-toastify";

export default function ViewMyContest({ele,close,match,m}){

    const [modal,setModal] = useState(true)
    const [team,setTeam] = useState({})
    const user = useSelector(state =>{
      return state.user
    })

    console.log(team,"state team")
    const handleTeamView = (e) =>{

      console.log(e,"Team")
      if(new Date(match ? match.deadline : m.deadline) > new Date()){
        if(user._id == e.userId._id){
          setTeam(e)
        }else{
          toast.info("You can only view other players teams , after the match has started")
        }
      }else{
        setTeam(e)
      }
    }

    return(
        <div>
            <Modal show = {modal} onHide={()=>{
              close()
            }}>
                <Modal.Header closeButton>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Amount</th> 
                        </tr>
                      </thead>
                      <tbody>
                        {ele.prizeBreakup.map(e =>{
                            return(
                        <tr>
                          <td>{e.rank}</td>
                          <td>{e.prize}</td>
                        </tr>   
                            )
                        })}
                      </tbody>
                    </Table>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                          {ele.teams.sort((a,b)=>{
                            return b.totalPoints - a.totalPoints
                          }).map((e,i) => {
                            {console.log(e,"teasm")}
                            return(
                              <ListGroup.Item 
                              variant= {m && new Date(m.deadline)  < new Date() ? (i + 1 <= ele.prizeBreakup.length ? "success" : "danger") : ("") }
                              onClick={()=>handleTeamView(e)}><b style={{fontSize : "10px"}}>Rank {i+1}</b> {e.userId.username}
                              
                              </ListGroup.Item>
                            )
                          })}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            <Modal show = {Object.keys(team).length > 0} onHide={()=>setTeam([])} >
              <Modal.Body>
              <Modal.Header>
                <h3>Points - {team.totalPoints}</h3>
              </Modal.Header>
                    <Table>
                      <thead>
                          <tr>
                            <th>Players</th>
                            <th>Points</th>
                          </tr>
                      </thead>
                      <tbody>
                        {console.log(team , "SADF")}
                          {Object.keys(team).length > 0 && team.team.map(e =>{
                            return(
                              <tr>
                                <td> 
                                {e.role == "wk" && <Image src= "https://fantasy11.s3.ap-south-1.amazonaws.com/Images/wicket.png" width={20}/>}
                                {e.role == "bowl" && <Image src= "https://fantasy11.s3.ap-south-1.amazonaws.com/Images/Bat.png" width={18}/>}
                                {e.role == "all" && <Image src= "https://fantasy11.s3.ap-south-1.amazonaws.com/Images/All.png" width={18}/>}
                                {e.role == "bat" && <Image src= "https://fantasy11.s3.ap-south-1.amazonaws.com/Images/Ball.png" width={18}/>}
                                {e.name}
                                </td>
                                <td>{e.score.reduce((acc,cv)=> acc+= cv.points,0)} </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </Table>
              </Modal.Body>
            </Modal>
            <ToastContainer/>
        </div>
    )
}