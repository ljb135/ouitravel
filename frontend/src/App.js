import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Navigation from './subpages/Navigation';
import Dashboard from './subpages/Dashboard';
import Trip from './subpages/Trip';
import Login from './subpages/Login';
import Register from "./subpages/Register";
import PaymentList from "./subpages/Payments";
import History from './subpages/History';
import Explore from "./subpages/Explore";
import MyPostsContainer from "./subpages/MyPostsContainer";
import FriendPostList from "./subpages/friendPost";
import Paypal from "./subpages/Paypal";
import Friends from "./subpages/Friends"

// const name = window.localStorage.getItem("Name");


function isloggedIn(setName){
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    credentials: "include"
  };
  
  fetch("http://localhost:3001/user", requestOptions)
  .then(response => response.json())
  .then(json => setName(json[0]["first_name"]))
  .catch(() => setName(null));
}

function checkAuthentication(nextState, replace, next){
  console.log("Checking authentication")
  if(!isloggedIn()){
    replace({
      pathname: "/session",
      state: {nextPathname: nextState.location.pathname}
    });
  }
  next();
}

function App() {
  const [name, setName] = useState(null);

  useEffect(() => {
    isloggedIn(setName);
  }, []);
  
  return (
    <BrowserRouter>
      <Navigation name={name}/>
        <Routes>
          <Route path='/' element={(name !== null) ? <Dashboard/> : <Login setName={setName}/>}></Route>
          <Route path="/explore" element={<Explore/>}></Route>
          <Route path="/mypostscontainer" element={<MyPostsContainer/>}></Route>
          <Route path="/friendsPost" element={<FriendPostList/>}></Route>
          {/* <Route path='/login' element={<Login setName={setName}/>}></Route> */}
          <Route path="/register" element={<Register setName={setName}/>}></Route>
          <Route path="/friends" element={<Friends/>}></Route>
          <Route path="/paypal" element={<Paypal/>} onEnter={checkAuthentication}></Route>
          <Route path="/Payments" element={<PaymentList/>} onEnter={checkAuthentication}></Route>
          <Route path="/trip/:id" element={<Trip/>} onEnter={checkAuthentication}></Route>
          <Route path="/history" element={<History />} />
        </Routes>
    </BrowserRouter>
  );
}



export default App;
