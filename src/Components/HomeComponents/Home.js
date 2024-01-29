import "bootstrap/dist/css/bootstrap.css"
import {Typewriter} from  "react-simple-typewriter"
import {Image,Button,Nav,Navbar} from "react-bootstrap"
import { SocialIcon } from "react-social-icons"
import "./Navbar.css"
import {Link, useNavigate} from "react-router-dom"
import Accordion from 'react-bootstrap/Accordion';


export default function Home(){
    const navigate = useNavigate()
    const ButtonStyle = {
        background : "white", color : "black" , border : "none",
        marginRight : "20px"
    }
    return(
        <div>
            <Navbar style={{backgroundColor : "#7510ff"}} sticky="top">
                <Navbar.Brand>
                    <Image src = "https://fantasy11.s3.ap-south-1.amazonaws.com/Images/LOGO.jpg" width={"200px"} style={{position : "relative" , left : "100px"}}/>
                </Navbar.Brand>
                <Nav className="ms-auto">
                    <Button style={ButtonStyle} onClick={()=>navigate('/login')}>Login</Button>
                    <Button style={ButtonStyle} onClick={()=>navigate("/register")}>Register</Button>
                </Nav>
            </Navbar>
            <div className="hero">
                <div className="logo"></div>
                <span className="typewriter">
                <Typewriter
                    words={[`India's No.1 Fantasy Platform`,'Lowest Commision', 'Exciting Prizes',]}
                    loop={100}
                    cursor
                    cursorStyle='|'
                    typeSpeed={60}
                    deleteSpeed={50}
            />
                </span>
                <div className="dhoni"></div>
            </div>
            <div className="section1">
                <h4>It's easy to start playing on <span style={{color : "black"}}><b>Fantasy 11</b></span></h4>
                <p>Enter into the thrilling world of Fantasy sports, a strategy-based online sports game wherein you can create a virtual team of real players playing in real life matches. Create your team to win points based on all the players' performance in a live game.</p>

                <div className="stepTitle">
                    <h1>Step 1</h1>
                    <h1>Step 2</h1>
                    <h1>Step 3</h1>
                </div>
                <div className="stepDes">
                    <h4>Select a Match</h4>
                    <h4>Create your Team </h4>
                    <h4>Join a Contest </h4>
                </div>
                <div className="steps"> 
                    <Image  src= "https://fantasy11.s3.ap-south-1.amazonaws.com/Images/step_1.webp" width={"200px"}/>
                    <Image src= "https://fantasy11.s3.ap-south-1.amazonaws.com/Images/step_2.webp" width={"190px"}/>
                    <Image src= "https://fantasy11.s3.ap-south-1.amazonaws.com/Images/step_3.webp" width={"200px"}/>
                </div>
            </div>

            <div className="faq">
                <h3>FAQ's ?</h3>
            </div>
            
            <div className="info">
                
            <Accordion style={{ width: '700px',marginTop : "40px"}} >
                <Accordion.Item eventKey="0">
                    <Accordion.Header><b>What is Fantasy Sports ?</b></Accordion.Header>
                    <Accordion.Body>
                        Fantasy sports is a strategy-based online sports game where you can create a virtual team of real players, playing in live matches worldwide. You earn points and win cash prizes based on the performances of these players in actual matches.
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="1">
                        <Accordion.Header><b>Is it safe to add money to Fantasy 11 ?</b></Accordion.Header>
                        <Accordion.Body>
                        Adding money to your Fantasy11 account is both simple and safe.
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="2">
                        <Accordion.Header><b>How are Fantasy11 points Calculated ?</b></Accordion.Header>
                        <Accordion.Body>
                        Dream11 points system is calculated on the basis of the performance of the player in an actual match.
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
            </div>
            <div className="footer">
                <div className="footerIcon">
                    <Image src="https://fantasy11.s3.ap-south-1.amazonaws.com/Images/BlackLOGO.png" style={{height : "50px"}}/><br/>
                    <SocialIcon url="https://twitter.com"/>
                    <SocialIcon url="https://facebook.com"/>
                    <SocialIcon url="https://linkedin.com"/>
                    <SocialIcon url="https://instagram.com"/>
                </div>
                <Link style={{textDecoration : "none" , color : "white"}}>Terms And Conditons</Link>
                <Link style={{textDecoration : "none" , color : "white"}}>About Us</Link>
                <p style={{fontSize : "18px", color: "white" ,position : "relative" , top : "8px"}}>© <span>Fantasy11 2023</span></p>
            </div>
            <div className="footer2">
                <h6>This game may be habit-forming or financially risky. Play responsibly.</h6>
            </div>
        </div>

    )
}