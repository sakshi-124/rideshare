import React from 'react'
import RidesCard from '../Components/RidesCard'
import { useEffect, useState } from 'react'
import ApiContext from '../Common/ApiContext';
import { useContext } from 'react';
import axiosApi from '../Common/AxiosApi';

function AvailableRides() {
    const [rides, setRide] = useState([]);
    const { userData } = useContext(ApiContext);
    //const userSub = userData.sub;

    useEffect(() => {

        const rideUrl = "/ridemanagement"

        axiosApi.post(rideUrl, {
            "path": "availableRides",
            "loggedinUser": "8ed44ead-aede-49ea-ba94-8512d6d2eed5"
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