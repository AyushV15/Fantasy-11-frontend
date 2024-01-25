import { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Modal, Table,Image } from "react-bootstrap";

export default function ViewMyContest({ele,close,match,m}){

    const [modal,setModal] = useState(true)
    const [team,setTeam] = useState([])

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
                            const t1 = a.team.reduce((acc,cv)=>{
                              if(cv.C){
                                acc += cv.score * 2
                              }else if(cv.VC){
                                acc += cv.score * 1.5
                              }
                              else{
                                acc += cv.score
                              }
                              return acc
                            },0)
                            const t2 = b.team.reduce((acc,cv)=>{
                              if(cv.C){
                                acc += cv.score * 2
                              }else if(cv.VC){
                                acc += cv.score * 1.5
                              }
                              else{
                                acc += cv.score
                              }
                              return acc
                            },0)
                            return t2 - t1
                          }).map((e,i) => {
                            return(
                              <ListGroup.Item 
                              variant= {match && new Date(match.deadline) || new Date(m.deadline)  < new Date() ? (i + 1 <= ele.prizeBreakup.length ? "success" : "danger") : ("") }
                              onClick={()=>setTeam(e.team)}><b style={{fontSize : "10px"}}>Rank {i+1}</b> {e.userId.username}</ListGroup.Item>
                            )
                          })}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            <Modal show = {team.length > 0} onHide={()=>setTeam([])} >
              <Modal.Body>
              <Modal.Header>
                <h3>Points - {team.reduce((acc,cv)=>{
                  if(cv.C){
                    acc += cv.score * 2
                  }else if(cv.VC){
                    acc += cv.score * 1.5
                  }
                  else{
                    acc += cv.score
                  }
                  return acc
                },0)}</h3>
              </Modal.Header>
                    <Table>
                      <thead>
                          <tr>
                            <th>Players</th>
                            <th>Points</th>
                          </tr>
                      </thead>
                      <tbody>
                          {team.map(e =>{
                            return(
                              <tr>
                                <td> 
                                {e.role == "wk" && <Image src= "https://fantasy11.s3.ap-south-1.amazonaws.com/Images/wicket.png" width={20}/>}
                                {e.role == "bowl" && <Image src= "https://fantasy11.s3.ap-south-1.amazonaws.com/Images/Bat.png" width={18}/>}
                                {e.role == "all" && <Image src= "https://fantasy11.s3.ap-south-1.amazonaws.com/Images/All.png" width={18}/>}
                                {e.role == "bat" && <Image src= "https://fantasy11.s3.ap-south-1.amazonaws.com/Images/Ball.png" width={18}/>}
                                {e.name}
                                </td>
                                <td>{e.score} </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </Table>
              </Modal.Body>
            </Modal>
        </div>
    )
}