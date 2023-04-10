import React from 'react';
import '../App.css';
import { TextField, Box, Button } from '@mui/material';
import { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axiosApi from '../Common/AxiosApi';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

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

  const { register, handleSubmit, formState: { errors } } = useForm();

  const userAttributes = [
    { Name: 'phone_number', Value: "+1" + userDetails.phone_number },
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
  const submitUser = (e) => {
    //e.preventDefault();
    const registerUserUrl = "/register"
    const path = "/confirmUser"
    console.log(registerUser)

    axiosApi.post(registerUserUrl,registerUser)
            .then(res => {
              if(res.data['statusCode'] === 200)
              {
                console.log(res)
                navigate(path, { replace: true, state: userDetails })
              }else
              {
                Swal.fire({
                  title: res.data.body,
                  icon: 'warning',
                  text: "Redirecting in a second...",
                  timer: 2000,
                  showConfirmButton: false
              }).then(function () {
                window.location.reload()
              })
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
        <Box component="form" novalidate onSubmit={handleSubmit(submitUser)}sx={{ mt: 1 }}>
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
          //   {...register("first_name", {
          //     onChange: (e) => { handleInput(e) },
          //     //required: "First Name is required",
          //     pattern: {
          //         message: "First Name is required"
          //     },
          //     validate: () => {
          //         if (userDetails.first_name !== "") {
          //             return true;
          //         } else {
          //             return "First Name is required";
          //         }
          //     }
              
          // })}
          // error={Boolean(errors.first_name)}
          //               helperText={errors.first_name?.message}
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
          //     {...register("email", {
          //     onChange: (e) => { handleInput(e) },
          //     pattern: {
          //       value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
          //       message: "Not a valid Email"
          //     },
          //     validate: () => {
          //         if (userDetails.email !== "") {
          //             return true;
          //         } 
          //         else {
          //             return "Email is Required";
          //         }
          //     }
          // })}
          // error={Boolean(errors.email)}
          //               helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="number"
            name="phone_number"
            label="Phone Number"
            id="phone_number"
            value={userDetails.phone_number}
            onChange={handleInput}
            autoComplete="phone"
              {...register("phone_number", {
              onChange: (e) => { handleInput(e) },
              //required: "First Name is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Phone Number must be 10 digits"
              },
              validate: () => {
                  if (userDetails.phone_number !== "") {
                      return true;
                  } 
                  else {
                      return "Phone Number is Required";
                  }
              }
          })}
          error={Boolean(errors.phone_number)}
                        helperText={errors.phone_number?.message}
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
          <Grid container>
            <Grid item>
              <Link href="/" variant="body2">
                {"Have an account? SignIn"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      
    </Container>
  )
}

export default Register;