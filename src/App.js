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
import ApiContext from './Common/ApiContext';
import { useState } from 'react';
import MyComponent from './Pages/accessContext';

function App() {

  const [userData, setUserData] = useState(null);

  return (
    <ApiContext.Provider value={{ userData, setUserData }}>
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/confirmUser' element={<Confirm/>} />
          <Route path ='/postRide' element = { <MyComponent/>}/>
        </Routes>
      </Router>
    </div>
    </ApiContext.Provider>
  );
}

export default App;
