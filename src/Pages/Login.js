import React from 'react';
import '../App.css';
import { TextField, Box, Button, Grid, Link } from '@mui/material';
import { useState, useEffect , useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axiosApi from '../Common/AxiosApi';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ApiContext from '../Common/ApiContext';

function SignIn() {

  const [loginDetails, SetLoginDetails] = useState({})

  const signIn = {
    "path": "signin",
    "user": loginDetails
  }

  const { setUserData } = useContext(ApiContext);

  let navigate = useNavigate()


  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    SetLoginDetails(values => ({ ...values, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const registerUserUrl = "/register"
    const path = "/postRide"
    console.log(signIn)

    axiosApi.post(registerUserUrl, signIn)
      .then(res => {
        if (res.data['statusCode'] === 200) {
          console.log(res.data.userDetails)
          setUserData(res.data.userDetails);
          navigate(path)
        } else {
          console.log(res.data)
        }
      })
  }

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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleInput}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleInput}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default SignIn