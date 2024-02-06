import Home from './Components/HomeComponents/Home';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Login from './Components/HomeComponents/Login';
import Register from './Components/HomeComponents/Register';
import UserDashboard from './Components/DashboardComponents/UserDashboard';
import UserProfile from './Components/DashboardComponents/UserProfile';
import Match from './Components/MatchComponent/Match';
import CreateTeam from './Components/TeamComponents/CreateTeam';
import CreateMatch from './Components/MatchComponent/createMatch';
import CreateContest from './Components/ContestComponenets/CreateContest';
import { useEffect, useReducer, useState } from 'react';

import FantasyScoreSystem from './Components/DashboardComponents/FantasyScoreSystem';
import Success from './Components/PaymentComponents/Success';
import Failure from './Components/PaymentComponents/Failure';
import axios from './Axios/axios';
import { MatchContext } from './Context/Context';
import AdminDashboard from './Components/DashboardComponents/adminDashboard';
import ForgotPassword from './Components/HomeComponents/ForgotPassword';
import CreatePlayer from './Components/PlayerComponents/createPlayer';



const matchReducer = (state,action) =>{
    switch(action.type){
      case "SET_MATCHES" : {
        return [...action.payload]
      }
      case "UPDATE_MATCH" : {
        console.log(action.payload , "action")
        return state.map(ele => {
          if(ele._id == action.payload._id){
            return {...ele, ...action.payload}
          }else{
            return {...ele}
          }
        })
      }
      default : {
        return [...state]
      }
    }
}

const pageReducer = (state,action) =>{
  switch(action.type){
    case "INCREMENT" : {
      return state + 1
    }
    case "DECREMENT" : {
      return state - 1
    }
    default : {
      return state
    }
  }
}

function App(){
  
  const [page,pagedispatch] = useReducer(pageReducer,1)
  const [render,setRender] = useState(false)

  useEffect(()=>{
    (async()=>{
      try{
          const response = await axios.get(`api/upcoming-matches?page=${page}`)
          matchdispatch({type :"SET_MATCHES", payload : response.data})
      }catch(e){
          console.log(e)
      }
  })()
  },[page,render])

  const refresh = () =>{
    setRender(!render)
  }

  const [matches,matchdispatch] = useReducer(matchReducer,[])
  
  return (
    <div>
      <MatchContext.Provider value={{
        page ,
        matches ,
        pagedispatch,
        refresh,
        matchdispatch
      }}>
       <BrowserRouter>
            <Routes>
            <Route path = "/" element = {<Home/>}/>
            <Route path = "/login" element = {<Login/>}/>
            <Route path='/register' element = {<Register/>}/>
            <Route path='/dashboard' element = {<UserDashboard/>}/>
            <Route path='/match/:id' element = {<Match/>}/>
            <Route path='/create-match' element = {<CreateMatch/>}/>
            <Route path='/userprofile' element = {<UserProfile/>}/>
            <Route path='/match/:id/create-team' element = {<CreateTeam/>}/>
            <Route path='/match/:id/create-contest' element = {<CreateContest/>}/>
            <Route path='/fantasy-points-system' element = {<FantasyScoreSystem/>}/>
            <Route path='/success' element = {<Success/>}/>
            <Route path='/failure' element = {<Failure/>}/>
            <Route path='/admin-dashboard' element = {<AdminDashboard/>}/>
            <Route path='/forgot-password' element = {<ForgotPassword/>}/>
            <Route path='/create-player' element = {<CreatePlayer/>}/>
            </Routes>
        </BrowserRouter>
        </MatchContext.Provider>
    </div> 
  )
}

export default App;
