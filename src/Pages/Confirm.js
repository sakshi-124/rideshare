import React from 'react';
import '../App.css';
import { TextField, Box, Button ,Grid,Link} from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axiosApi from '../Common/AxiosApi';

function Confirm() {

  const location = useLocation();
  const [verificationCode , setVerificationCode] = useState({})

  const confirmUser = {
    "path" : "confirmUser",
    "email": location.state !== null ? location.state.email : "",
    "verificationCode" : verificationCode.verification_code
  }
  const config = {
    headers: {
// replace with your domain name
'Access-Control-Allow-Origin': '*','Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'}
    
  };

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setVerificationCode(values => ({ ...values, [name]: value }));
  }

  let navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
    const registerUserUrl = "/register"
    const path = "/"

    console.log(confirmUser)

    axiosApi.post(registerUserUrl,confirmUser)
            .then(res => {
              if(res.data['statusCode'] === 200)
              {
                console.log(res)
                navigate(path)
              }else
              {
                console.log(res.data)
              }
            });
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
      <Box component="form"  onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          type="number"
          required
          fullWidth
          id="verification_code"
          label="Verification Code"
          name="verification_code"
          onChange={handleInput}
          autoFocus
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
        Verify
        </Button>
        <Grid container>
          <Grid item>
            <Link href="#" variant="body2">
              {"Resend Verification Code"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Container>
  )
}

export default Confirm