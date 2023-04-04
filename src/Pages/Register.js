import React from 'react';
import '../App.css';
import { TextField, Box, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axiosApi from '../Common/AxiosApi';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';

function Register() {

  const [errorMessage, setErrorMessage] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [user, setUser] = useState({});
  const formattedPhoneNumber = "";

  const config = {
    headers: {
// replace with your domain name
'Access-Control-Allow-Origin': '*','Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'}
    
  };
  let navigate = useNavigate();

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserDetails(values => ({ ...values, [name]: value }));
  }

  const userAttributes = [
    { Name: 'phone_number', Value: userDetails.phone_number },
    { Name: 'given_name', Value: userDetails.first_name },
    { Name: 'family_name', Value: userDetails.last_name },
    { Name: 'address', Value: userDetails.address },
    { Name: 'custom:city', Value: userDetails.city },
    { Name: 'custom:country', Value: userDetails.country },
    { Name: 'custom:province', Value: userDetails.province },
  ];

  const registerUser = {
    "userAttributes": userAttributes,
    "email": userDetails.email,
    "password": userDetails.password,
    "path" : "registerUser"
  }

  //----
  const handleSubmit = (e) => {
    e.preventDefault();
    const registerUserUrl = "/register"
    const path = "/confirmUser"
    console.log(registerUser)

    axiosApi.post(registerUserUrl,registerUser)
            .then(res => {
              if(res.data['statusCode'] === 200)
              {
                navigate(path, { replace: true, state: userDetails })
              }else
              {
                console.log(res.data)
              } 
            })

  }


  // const validateForm = (values) => {
  //     const errors = {};

  //     const EMAIL_REGX = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  //     const PASSWORD_REGX =  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  //     const ONLY_LETTERS_REGX = /^[a-zA-Z]+$/;

  //     if (!values.first_name) {
  //         errors.first_name = "FirstName is empty";
  //     }
  //     else if(!ONLY_LETTERS_REGX.test(values.firstname))
  //     {
  //         errors.first_name = "First Name accepts letters only"
  //     }
  //     if (!values.last_name) {
  //         errors.last_name = "LastName is empty";
  //     }
  //     else if(!ONLY_LETTERS_REGX.test(values.lastname))
  //     {
  //         errors.last_name = "Last Name accepts letters only"
  //     }
  //     if (!values.email) {
  //         errors.email = "Email is empty";
  //     }
  //     else if(!EMAIL_REGX.test(values.email))
  //     {
  //         errors.email = "Not a Valid Email";
  //     }
  //     if (!values.password) {
  //         errors.password = "Password is empty";
  //     }
  //     else if(!PASSWORD_REGX.test(values.password))
  //     {
  //         errors.password = "Password should contain alpha-numeric and special characters & Minimum length should be 8 characters";
  //     }
  //     if (!values.confirmpassword) {
  //         errors.confirmpassword = "ConfirmPassword is empty";
  //     }
  //     else
  //     {
  //         if(values.password !== values.confirmpassword)
  //         {
  //             errors.confirmpassword ="Password & Confirm Password is not Matched";
  //         }
  //     }
  //     return errors;
  // }

  // const userDetailsPage = (e) => {
  //     e.preventDefault();
  //     //setErrorMessage(validateForm(userDetails));
  //     setIsSubmit(true);
  // }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="first_name"
            label="First Name"
            name="first_name"
            value={userDetails.first_name}
            onChange={handleInput}
            autoComplete="first_name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="last_name"
            label="Last Name"
            name="last_name"
            value={userDetails.last_name}
            onChange={handleInput}
            autoComplete="last_name"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={userDetails.email}
            onChange={handleInput}
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            //type="number"
            name="phone_number"
            label="Phone Number"
            id="phone_number"
            value={userDetails.phone_number}
            onChange={handleInput}
            autoComplete="phone"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={userDetails.password}
            onChange={handleInput}
            autoComplete="current-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirm_password"
            label="Confirm Password"
            type="password"
            id="confirm_password"
            value={userDetails.confirm_password}
            onChange={handleInput}
            autoComplete="current-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="address"
            label="Address"
            id="address"
            value={userDetails.address}
            onChange={handleInput}
            autoComplete="address"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="city"
            label="City"
            id="city"
            value={userDetails.city}
            onChange={handleInput}
            autoComplete="city"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="province"
            label="Province"
            id="province"
            value={userDetails.province}
            onChange={handleInput}
            autoComplete="province"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="country"
            label="Country"
            id="country"
            value={userDetails.country}
            onChange={handleInput}
            autoComplete="country"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default Register;