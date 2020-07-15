import React, {useState, useEffect, useContext} from "react";
import axios from "../core/axios";

import {AuthContext} from "../context/auth-context";
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';

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

    const deleteBookingHandler = bookingId => {
        setIsLoading(true);

        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!) {
                    cancelBooking(bookingId: $id)
                    {
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: bookingId
            }
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
            .then(() => {
                setBookings(bookings.filter(booking => booking._id !== bookingId));
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false)
            })
    };

    useEffect(fetchBookings, []);

    return (
        <>
            {isLoading ? (
                <Spinner/>
            ) : (
                <BookingList bookings={bookings} onDelete={deleteBookingHandler}/>
            )}
        </>
    )
};

export default BookingsPage