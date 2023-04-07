// Neha Dadarwala - neha.dadarwala@dal.ca

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {useNavigate} from "react-router-dom";
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function CollapsibleExample() {

  const userDetails = JSON.parse(localStorage.getItem("LoggedInUserDet"))
  const loggedinUserName = userDetails ?  userDetails['given_name'] : null
  
  function handleLogout() {
    localStorage.clear();
  }

  return (

    <Navbar collapseOnSelect expand="lg" className="color-nav" variant="light">
      <Container >
        <Navbar.Brand href="/Profile">RideShare</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/postRide">Post Ride</Nav.Link>
            <Nav.Link href="/availableRides">Available Rides</Nav.Link>
            <Nav.Link href="/rideRequests">Ride Requests</Nav.Link>
            <Nav.Link href="/"onClick={handleLogout} >Log out</Nav.Link>
          </Nav>
          <p>Logged In As : {loggedinUserName}</p>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  
  );
}

export default CollapsibleExample;
