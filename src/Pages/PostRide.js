
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import '../App.css';
import { TextField, Box, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axiosApi from '../Common/AxiosApi';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Autocomplete } from '@mui/material';
import { useForm } from 'react-hook-form';

function PostRide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [rideDetail, setRideDetails] = useState({});

  const config = {
    headers: {
// replace with your domain name
'Access-Control-Allow-Origin': '*','Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'}
    
  };

  // useEffect(() => {
  //   if (searchQuery) {
  //     axios
  //       .get(`https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`)
  //       .then((response) => {
  //         setSearchResults(response.data);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   } else {
  //     setSearchResults([]);
  //   }
  // }, [searchQuery]);

  const handleResultClick = (location) => {
    setSelectedLocation(location);
  };

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setRideDetails(values => ({ ...values, [name]: value }));
  }

  const handleAutoCompleteInput = async (e) => {
    const query = { "search": e.target.value }
    axios.post("https://7przixh9me.execute-api.us-east-1.amazonaws.com/testRideShare/getPlaces", query)
      .then(res => {
        if (res.data['statusCode'] === 200) {
          console.log(res)
        } else {
          console.log(res.data)
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const registerUserUrl = "/register"
    // const path = "/postRide"
    // console.log(signIn)

    // axiosApi.post(registerUserUrl, signIn)
    //   .then(res => {
    //     if (res.data['statusCode'] === 200) {
    //       console.log(res.data)
    //       navigate(path)
    //     } else {
    //       console.log(res.data)
    //     }
    //   })
  }
  return (
    // <div>
    //   <input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
    //   <ul>
    //     {searchResults.map((result) => (
    //       <li key={result.osm_id} onClick={() => handleResultClick(result)}>
    //         {result.display_name}
    //       </li>
    //     ))}
    //   </ul>
    // </div>
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
        <Box component="form" sx={{ mt: 1, width : "100%" }}>
          <Autocomplete
            options={searchResults}
            getOptionLabel={(searchResults) => searchResults.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Origin"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={handleAutoCompleteInput}
              />
            )}
          />
          <Autocomplete
            options={searchResults}
            getOptionLabel={(option) => searchResults.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Destination"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={handleAutoCompleteInput}
              />
            )}
          />
           <Autocomplete
            options={searchResults}
            getOptionLabel={(option) => searchResults.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Stop"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={handleAutoCompleteInput}
              />
            )}
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