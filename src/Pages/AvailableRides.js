import React from 'react'
import RidesCard from '../Components/RidesCard'
import { useEffect, useState } from 'react'
import axiosApi from '../Common/AxiosApi';

function AvailableRides() {
    const [rides, setRide] = useState([]);
    //const userSub = userData.sub;
    const userDetails = JSON.parse(localStorage.getItem("LoggedInUserDet"))
    const userSub = userDetails['sub'];

    useEffect(() => {

        const rideUrl = "/ridemanagement"

        axiosApi.post(rideUrl, {
            "path": "availableRides",
            "loggedinUser": userSub
        })
            .then(res => {
                console.log(res);
                const ridesDet = [];
                ridesDet.push(res.data.AvailableRides);
                ridesDet.map((rides) => {
                    setRide(rides);
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

export default AvailableRides