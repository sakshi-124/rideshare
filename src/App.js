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

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/confirmUser' element={<Confirm/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
