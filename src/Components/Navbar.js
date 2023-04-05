// Neha Dadarwala - neha.dadarwala@dal.ca

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {useNavigate} from "react-router-dom";
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function CollapsibleExample() {

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
            <Nav.Link href="//">Log out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  
  );
}

export default CollapsibleExample;
