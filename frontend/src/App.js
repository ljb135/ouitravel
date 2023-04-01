import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Navigation from './subpages/Navigation';
import Home from './subpages/Home';
import Trips from './subpages/Trips';
import Login from './subpages/Login';
import Register from "./subpages/Register";
import Paypal from "./subpages/Paypal";

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
      pathname: "/login",
      state: {nextPathname: nextState.location.pathname}
    });
  }
  next();
}

function App() {
  const [name, setName] = useState(null)

  useEffect(() => {
    isloggedIn(setName);
  }, []);

  return (
    <BrowserRouter>
      <Navigation name={name} setName={setName}/>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login setName={setName}/>}></Route>
          <Route path="/register" element={<Register setName={setName}/>}></Route>
          <Route path="/trips" element={<Trips/>} onEnter={checkAuthentication}></Route>
          <Route path="/paypal" element={<Paypal/>} onEnter={checkAuthentication}></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
