import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from './Pages/Login';
import Register from './Pages/Register';
import PostRide from './Pages/PostRide';
import Confirm from './Pages/Confirm';
import { useState} from 'react';
import RideShareNav from './Components/Navbar';
import AvailableRides from './Pages/AvailableRides';
import ConfirmRides from './Pages/ConfirmRides';

function App() {
  
  return (
    <div>
      <RideShareNav/>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/confirmUser' element={<Confirm/>} />
          <Route path ='/postRide' element = { <PostRide/>}/>
          <Route path ='/availableRides' element = { <AvailableRides/>}/>
          <Route path ='/rideRequests' element = { <ConfirmRides/>}/>
        </Routes>
      </Router>
    </div>

  );
}

export default App;
