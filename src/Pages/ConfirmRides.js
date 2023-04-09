import React from 'react'
import RidesCard from '../Components/RidesCard'
import { useEffect, useState } from 'react'
import axiosApi from '../Common/AxiosApi';

function ConfirmRides() {
    const [rides, setRide] = useState([]);
    //const userSub = userData.sub;
    const userDetails = JSON.parse(localStorage.getItem("LoggedInUserDet"))
    const userSub = userDetails['sub'];

    useEffect(() => {

        const rideUrl = "/ridemanagement"

        axiosApi.post(rideUrl, {
            "path": "allRideRequests",
            "currentUser": userSub
        })
            .then(res => {
               /// console.log(res.data.allRequests);
                 const requestsDet = [];
                 requestsDet.push(res.data.allRequests);
                // console.log(requestsDet)

                requestsDet.map((rides) => {
                    setRide(rides);
                    //console.log(rides)
                    return (<></>)
                });

            });
        //console.log(ride);
    }, []

    );

    return (
        <div>
            <RidesCard rides={rides} />
        </div>
    )
}

export default ConfirmRides