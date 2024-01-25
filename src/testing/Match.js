import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Image } from 'react-bootstrap';
import CSK from "../Images/CSK.png"
import MUM from "../Images/Mumbai.png"
import Countdown from 'react-countdown';
import { useEffect } from 'react';


export default function Match(){
    

    const date = new Date("2023-12-20T12:00:00")
    const d = date.getTime() - Date.now()
    console.log(d)
    
    return(






    <div>   
    <Card className="text-center">
      <Card.Header>IPL 2024</Card.Header>
      <Card.Body>
        <Card.Title>
        <p></p>
        <Image src={MUM} rounded style={{height : "200px"}} />  
            VS
        <Image src={CSK} rounded style={{height : "200px"}}/>
        </Card.Title>
        <Button variant="primary">Create Team</Button>
      </Card.Body>
      <Card.Footer className="text-muted">
      <Countdown date={Date.now() + d}/>
      </Card.Footer>
    </Card>
        </div>
    )
}