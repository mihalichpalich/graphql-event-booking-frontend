import React, {useState, useEffect, useContext} from "react";
import axios from "../core/axios";

import {AuthContext} from "../context/auth-context";
import Spinner from '../components/Spinner/Spinner';

const BookingsPage = () => {
    const {token} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState([]);

    const fetchBookings = () => {
        setIsLoading(true);

        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        event {
                            _id
                            title
                            date
                        }
                    }
                }
            `
        };

        axios.post('/graphql', requestBody, {
            headers: {Authorization: "Bearer " + token}
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!')
                }

                return res.data
            })
            .then(resData => {
                const bookings = resData.data.bookings;
                setBookings(bookings);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            })
    };

    useEffect(fetchBookings, []);

    return (
        <>
            {isLoading ? <Spinner/> : (
                <ul>
                    {bookings.map(
                        booking => (
                            <li key={booking._id}>
                                {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}
                            </li>
                        )
                    )}
                </ul>
            )}
        </>
    )
};

export default BookingsPage