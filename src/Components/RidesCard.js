import React, { useState } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/material';
import { Container } from '@mui/system';
import { Buffer } from 'buffer';
import axiosApi from '../Common/AxiosApi';
import Swal from 'sweetalert2';

const RidesCard = (props) => {


    let navigate = useNavigate();

    let rideManagementUrl = "/ridemanagement"
    const userDetails = JSON.parse(localStorage.getItem("LoggedInUserDet"))
    const userSub = userDetails['sub'];

    const handleOnClickRequests = (ride) => {
        console.log(ride)
        const ride_id = ride.ride_id

        console.log(ride_id)
        const requestDetail = {
            "path": "rideRequest",
            "requestDetail": {
                "ride_id": ride_id,
                "requested_by": userSub,
                "isConfirmed" : "N"
            }
        }
        console.log(requestDetail)
        axiosApi.post(rideManagementUrl, requestDetail).then(res => {
            if (res.data['statusCode'] === 200) {
                console.log(res)
                Swal.fire({
                    title: "Ride Requested",
                    icon: 'success',
                    text: "Redirecting in a second...",
                    timer: 2000,
                    showConfirmButton: false
                }).then(function () {
                    window.location.reload()
                })
            } else {
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
        });

    }

    const handleOnClickConfirmRides = (ride) => {
        const confirmRideDet = {
            "path": "confirmRide",
            "rideDetails": ride.ride_details,
            "ride_id" : ride.ride_id,
            "requested_by" : ride.requested_by_sub,
            "request_id" : ride.request_id
        }
        console.log(confirmRideDet)

        axiosApi.post(rideManagementUrl,confirmRideDet).then(res =>
            {
                if (res.data['statusCode'] === 200) {
                    console.log(res)
                    Swal.fire({
                        title: "Ride Confirmed",
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
            }).catch(err =>{

            })
    }

    return (
        <div>
            <Container>
                <Grid
                    container
                    spacing={3}
                    justify="center"
                    style={{ marginTop: "1%" }}
                >
                    {props.rides.map((rides, index) => {
                        console.log(rides)
                        if (rides['form']) {
                            if (rides.ride_details.posted_by === userSub) {
                                return (
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card sx={{ maxWidth: 345, margin: 5 }}>
                                            <CardContent align='left'>
                                                <Typography gutterBottom variant="h5" component="div">Requests</Typography>
                                                <Typography>
                                                    Requested By : {rides.requested_by}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" name="rideDate">
                                                    Ride Date : {rides.ride_details.ride_date}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" name="qty" >
                                                    Origin : {rides.ride_details.origin}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" name="price">
                                                    Destination : {rides.ride_details.destination}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" name="price">
                                                    Stop : {rides.ride_details.stop}
                                                </Typography>
                                               
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" onClick={() => handleOnClickConfirmRides(rides)}>Confirm</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )
                            }
                        }
                        else {
                            const postedByArray = rides.posted_by.split(",");
                            if (postedByArray[0] !== userSub) {
                                return (
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card sx={{ maxWidth: 345, margin: 5 }}>
                                            <CardContent align='left'>
                                                <Typography gutterBottom variant="h5" component="div">Rides</Typography>
                                                <Typography name="rideDate">
                                                    {rides.ride_date}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" name="qty" >
                                                    Origin : {rides.origin}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" name="price">
                                                    Destination : {rides.destination}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" name="price">
                                                    Stop : {rides.stop}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" name="price">
                                                    Available Seats : {rides.available_seat}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" name="price">
                                                    Posted By : {postedByArray[1]}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" onClick={() => handleOnClickRequests(rides)}>Request</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                );
                            }
                        }
                    }
                    )}
                </Grid>
            </Container>
        </div>

    );
};

export default RidesCard