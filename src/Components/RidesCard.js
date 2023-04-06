import React from 'react'
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

const RidesCard = (props) => {


    let navigate = useNavigate();

    let path = '/modifyStock/true';

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
                                            Posted By : {rides.posted_by}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">Request</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </div>
    );
};

export default RidesCard