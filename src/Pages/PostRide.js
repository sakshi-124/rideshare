
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import '../App.css';
import { TextField, Box, Button, Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axiosApi from '../Common/AxiosApi';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Autocomplete } from '@mui/material';
import { useForm } from 'react-hook-form';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import Swal from 'sweetalert2';
//import { DateTimePicker } from '@mui/lab';

function PostRide() {
  const [searchResults, setSearchResults] = useState([]);
  const [rideDetail, setRideDetails] = useState({});
  const [dates , setDate] = useState(Dayjs)
  const userDetails = JSON.parse(localStorage.getItem("LoggedInUserDet"))
  const userSub = userDetails['sub'];
  const navigate = useNavigate();

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setRideDetails(values => ({ ...values, [name]: value }));
    console.log({ rideDetail })
    console.log(dates)
    const ride_date = dates.format('DD-MM-YYYY');
    console.log(ride_date)
    setRideDetails({
      ...rideDetail,
      "ride_date" : ride_date,
      "available_seat" : value,
    });
    console.log({ rideDetail })
  }

  const handleOriginChanges = (event, value) => {
    console.log(value)
    if (value) {
      setRideDetails({
        ...rideDetail,
        origin: value.label,
      });
    }
    console.log({ rideDetail })
  }
  const handleDestinationChange = (event, value) => {
    console.log(value)
    if (value) {
      setRideDetails({
        ...rideDetail,
        destination: value.label,
      });
    }
    console.log({ rideDetail })
  }
  const handleDateChange = (event, value) => {
    console.log(value)
    if (value) {
      setDate(value)
    }
    
  }

  const handleStopChange = (event, value) => {
    console.log(value)
    if (value) {
      setRideDetails({
        ...rideDetail,
        stop: value.label,
      });
    }
    console.log({ rideDetail })
  }

  const handleAutoCompleteInput = async (e) => {
    const query = { "search": e.target.value }
    axiosApi.post("/getplaces", query)
      .then(res => {
        if (res.data['statusCode'] === 200) {
          console.log(res)
          if (res.data['result'] && res.data['result'].length > 2) {
            setSearchResults(JSON.parse(res.data['result']))
            console.log({ searchResults })
          }
        } else {
          console.log(res.data)
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(rideDetail)
    const postRide = {
      "path" : "postRide",
      "rideDetails" : rideDetail
    }
    console.log(postRide)
    axiosApi.post("/ridemanagement" , postRide).then(res => {
      if (res.data['statusCode'] === 200) {
        console.log(res)
        Swal.fire({
          title: "Ride Posted",
          icon: 'success',
          text: "Redirecting in a second...",
          timer: 2000,
          showConfirmButton: false
      }).then(function () {
        window.location.reload()
      })
      } else {
        console.log(res.data)
      }
    });
  }
  useEffect(() => {
    setRideDetails({
      ...rideDetail,
      "posted_by" : userSub,
      "status" : 0,
    });
    //console.log(formValues)
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h5">
          Post Ride
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DemoContainer components={['DatePicker']} >
              <DatePicker label="Select Ride Date"
              id = "ride_date"
              value={dates}
              required
              onChange={(newValue) => setDate(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
          <Autocomplete
            id="origin"
            name="origin"
            options={searchResults}
            getOptionLabel={(option) => option.label}
            onChange={handleOriginChanges}
            onInputChange={handleAutoCompleteInput}
            required
            renderInput={(params) => (
              <TextField
                id="origin"
                name="origin"
                {...params}
                label="Origin"
                variant="outlined"
                fullWidth
                required
                margin="normal"
              />
            )}
          />
          <Autocomplete
            id="destination"
            name="destination"
            options={searchResults}
            getOptionLabel={(option) => option.label}
            onChange={handleDestinationChange}
            onInputChange={handleAutoCompleteInput}
            required
            renderInput={(params) => (
              <TextField
                {...params}
                id="destination"
                name="destination"
                label="Destination"
                variant="outlined"
                fullWidth
                required
                margin="normal"
              />
            )}
          />
          <Autocomplete
            id="stop"
            name="stop"
            options={searchResults}
            getOptionLabel={(option) => option.label}
            onChange={handleStopChange}
            onInputChange={handleAutoCompleteInput}
            required
            renderInput={(params) => (
              <TextField
                {...params}
                label="Stop"
                variant="outlined"
                fullWidth
                margin="normal"
                required
              />
            )}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="available_seat"
            label="Available Seat"
            name="available_seat"
            value={rideDetail.available_seat}
            onChange={handleInput}
            autoComplete="last_name"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Post
          </Button>
        </Box>
      </Box>

    </Container>
  );
}


export default PostRide;