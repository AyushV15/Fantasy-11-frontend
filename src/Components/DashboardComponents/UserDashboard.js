import LOGO from "../../Images/LOGO.jpg"
import {Image,ListGroup,Button,Nav,Navbar,Carousel,Offcanvas,Card,Row,Col,Tabs, Tab, Modal, Badge} from "react-bootstrap"
import { useEffect, useState } from "react"
import axios from "../../Axios/axios"
import {PersonCircle,Wallet2,Bell,BoxArrowRight, Trophy} from "react-bootstrap-icons"
import banner1 from "../../Images/banner1.png"
import money from "../../Images/money.gif"
import banner2 from "../../Images/banner2.png"
import "./UserDashboard.css"
import { Link,useNavigate } from "react-router-dom"
import ListMatches from "../MatchComponent/ListMatches"
import { jwtDecode } from "jwt-decode"
import { useSelector ,useDispatch} from "react-redux"
import { getStartUser } from "../../Actions/userAction"
import UpcomingMatches from "../MatchComponent/UpcomingMatches"
import LiveMatches from "../MatchComponent/LiveMatches"
import CompletedMatches from "../MatchComponent/CompletedMatches"
import { toast,ToastContainer } from "react-toastify"
import { getStartWallet } from "../../Actions/walletAction"
import { clearNotification, getStartNotification } from "../../Actions/notificationAction"
import {formatDistance} from "date-fns"
import noNotifications from "../../Images/noNotifications.jpg"
import io from "socket.io-client"

const socket = io.connect("http://localhost:3300")

export default function UserDashboard(){

    const [role,setRole] = useState("")
    const [notification,setNotification] = useState(false)
    const [loading , setLoading] = useState(false)
    const [modal,setModal] = useState(false)
    const [showCanvas,setShowCanvas] = useState(false)
    const [amount,setAmount] = useState("")
    const navigate = useNavigate()

    const handleLogout = () =>{ 
      localStorage.clear('token')
      navigate('/')
    }

    useEffect(()=>{
      socket.on('notification',(data) =>{
        dispatch(getStartNotification())
      })
    },[socket])

    

    useEffect(()=>{
      (async ()=>{
          try{
              const id = localStorage.getItem('stripeId')
              const response = await axios.delete(`api/delete-payment/${id}`,{
                  headers : {
                      Authorization : localStorage.getItem('token')
                  }
              })
              if(response){
                  localStorage.removeItem("stripeId")
              }
          }catch(e){
              console.log(e)
          }
      })()
  },[])
    
    const dispatch = useDispatch()
    useEffect(()=>{
      setRole(jwtDecode(localStorage.getItem("token")).role)
      dispatch(getStartUser())
      dispatch(getStartWallet())
      dispatch(getStartNotification())
      
    },[])

    // useEffect(()=>{
    //   socket.on('notification',(data) =>{
    //     alert(data)
    //   })
    // },[socket])

    const notifications = useSelector(state =>{
      return state.notification
    })

    const user = useSelector(state=>{
      return state.user
    }) 

    socket.emit('user', user._id)

    const wallet = useSelector(state =>{
      return state.wallet
    })

    const clearNotifications = async () =>{
      try{
        const response = await axios.delete('api/users/notifications',{headers : {
          Authorization : localStorage.getItem('token')
        }})
        console.log(response)
        dispatch(clearNotification())
      }catch(e){
        console.log(e)
      }
    }

    const makePayment2 = async () =>{
      if(Number(amount) <= 1000){
        const body = {
          id : user._id,
          name : user.username,
          amount : Number(amount)
        }
        console.log(Number(""))
        setLoading(true)

        setTimeout(async ()=>{
        try{
          const response = await axios.post('api/checkout',body,{
            headers : {
              Authorization : localStorage.getItem('token')
            }
          })

          console.log(response.data.id)
          localStorage.setItem('stripeId', response.data.id)
          window.location = response.data.url
  
        }catch(e){
          toast.error(e.response.data.message)
        }
      },500)
      }else{
        toast.error("amount should be less than or equal to 1000")
      }
      
    }

    return(
      <div>

      {/*Side Bar - shows User info, wallet , logout etc*/}
      <Offcanvas show={showCanvas} onHide={()=>setShowCanvas(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
              <h3>Profile</h3> 
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="offcanvas-user-profile">
            {user.profilePic ? (
              <Image src={`https://fantasy11.s3.ap-south-1.amazonaws.com/users/${user.profilePic}`} 
              onClick={()=>navigate('/userprofile')}
              roundedCircle style={{ width: '60px', height: '60px', marginTop: '-15px',border : "2px solid black" }} />
            ) : (
            <PersonCircle 
            onClick={()=>navigate('/userprofile')}
            size={50}/>
            )}
          <p>{user.username}</p> 
          </div>
          <Card className="offcanvas-wallet">
              <Card.Body className="wallet-body" onClick={()=>setModal(true)}>
              <div>
              <p>wallet</p>
              <p>{wallet.amount}</p>
              <Wallet2/>
              </div>  
              </Card.Body>
          </Card>
          <div className="logoutbutton">
          <p>Logout</p>
          <BoxArrowRight style={{fontSize : "30px"}} className = "arrow" onClick={handleLogout}/>
          </div> 
          {role == "admin" && (
            <Button size="sm" onClick={()=>navigate("/create-match")}>Create Match</Button>
          )}   
          <br/>
          <Link to ="/fantasy-points-system">Fantasy Points System</Link><br/>
          {user.role == "admin" && <Link to ="/admin-dashboard">Admin Dashboard</Link> }
        </Offcanvas.Body>
      </Offcanvas>

       {/*Side Bar for Notifications*/}     
      <Offcanvas show = {notification} onHide = {()=>setNotification(false)} placement="end">
      <Offcanvas.Header>
          <Offcanvas.Title>
              <h1>Notifications {notifications.length > 0 && <Button variant = "dark" onClick={clearNotifications}>Clear</Button>} </h1>
          </Offcanvas.Title>
        </Offcanvas.Header>
              <Offcanvas.Body>
              {notifications.length > 0 ? (
              <ListGroup>
                {notifications.map(ele =>{
                  return(
                    <ListGroup.Item>
                      {/* <Image src={winner} height={40}/> */}
                      {ele.text}
                      <p style={{fontSize : "15px"}}><b>{formatDistance(new Date(ele.date),new Date(),{addSuffix : true})}</b></p>
                    </ListGroup.Item>
                  )
                })} 
              </ListGroup>
              ) : (
                <Image src={noNotifications} style={{marginLeft : "40px"}}/>
              )} 
              </Offcanvas.Body>   
      </Offcanvas>

      {/*Navbar Section*/}
      <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: "#7510ff" }} sticky="top" aria-controls="responsive-navbar-nav">
      <Button style={{ backgroundColor: "#7510ff", border: "none", marginRight: "15px" }} onClick={() => setShowCanvas(true)}>
          <PersonCircle style={{ fontSize: "40px" }} />
        </Button>
      <Navbar.Brand>
        <Image src={LOGO} width={"200px"} style={{ maxWidth: "100%", height: "auto" }} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse className="justify-content-end">
        <Nav>
          {notifications.length > 0 && <Badge bg = "none">{notifications.length}</Badge> }
          
          <Bell
          onClick={()=>setNotification(true)}
          style={{ fontSize: "40px", color: "white",marginRight : "25px"}} />
          
          <Wallet2 
          onClick={()=>setModal(true)}
          style={{ fontSize: "40px", color: "white", marginRight : "30px" }} />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
      <Row style={{marginTop : "10px"}}>
        <Col sm={2}></Col>
        <Col sm={8}>

    {/*Slide show Section */}      
    <Carousel>
        <Carousel.Item>
            <Image 
            className="d-block w-100" 
            style={{borderRadius : "20px 20px 20px 20px",height : "250px"}}
            src={banner1}/>
        </Carousel.Item>
        <Carousel.Item>
          <Image 
          className="d-block w-100" 
          style={{borderRadius : "20px 20px 20px 20px",height : "250px"}}
          src={banner2}/>
        </Carousel.Item>
    </Carousel>
    <br/>
    
    {/*Tabs for Upcoming Matches and My Matches*/}
    <Tabs className="match-tabs" defaultActiveKey="Upcoming Matches" id="justify-tab-example" justify >
      <Tab eventKey="Upcoming Matches" title = "Upcoming Matches">
      <ListMatches/>
      </Tab>
      <Tab eventKey="My Matches" title = "My Matches">

        {/*Tabs for User upComing Matches , Live and Completed*/}
        <Tabs className="match-tabs" defaultActiveKey="Upcoming" id="justify-tab-example" justify>
          <Tab eventKey={"Upcoming"} title = "Upcoming">
            <UpcomingMatches user = {user}/>
          </Tab>
          <Tab eventKey={"Live"} title = {<span>Live <Image width={12} src={"https://fantasy11.s3.ap-south-1.amazonaws.com/Images/Live.gif"} /></span>}>
            <LiveMatches user ={user}/>
          </Tab>
          <Tab eventKey={"Completed"} title = "Completed">
            <CompletedMatches user = {user}/>
          </Tab>
        </Tabs>
      </Tab>
    </Tabs>
        </Col>
        <Col sm={2}></Col>
      </Row>

      <Modal show = {modal}  onHide={()=>{
        setModal(false)
        setLoading(false)
        }}>
        <Modal.Header closeButton>
            Wallet - Rs {wallet.amount}
        </Modal.Header>
        <Modal.Body>
        {loading ? (
        <div className="walletModal">
          <Image src={money} width={100}/>
        </div>
        ) : (
          <div className="walletModal">
            <Image width={200} src="https://fantasy11.s3.ap-south-1.amazonaws.com/Images/AddMoney.webp"/><br/>
            <p>Min Amount Should be Rs 10</p>
            <p>Add Amount</p>
            <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} /><br/>
            <Button variant="success" onClick={makePayment2} disabled = {Number(amount) < 10 ||Number(amount) > 1000}>Add money</Button> 
          </div>
        )}
        </Modal.Body>
      </Modal>
      <ToastContainer/>
      </div>
    )
}
 