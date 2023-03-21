import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navigation from './subpages/Navigation';
import Home from './subpages/Home';
import Trips from './subpages/Trips';
import Login from './subpages/Login';

const name = window.localStorage.getItem("Name");

function isloggedIn(){
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    credentials: "include"
  };

  console.log(fetch("http://localhost:3001/user", requestOptions)
  .then(response => {
    if(!response.ok){
      console.log(response.text().then(body => {return(body)}));
    }
    return null;
  }));
}

function checkAuthentication(nextState, replace, next){
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

  if(isloggedIn()){
    setName()
  }

  return (
    <BrowserRouter>
      <Navigation name={name}/>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login setName={setName}/>}></Route>
          <Route path="/trips" element={<Trips/>} onEnter={checkAuthentication}></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
