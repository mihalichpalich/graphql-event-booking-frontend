import React, {useState, useEffect, useContext} from "react";
import axios from "../core/axios";

import {AuthContext} from "../context/auth-context";
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from "../components/Bookings/BookingsChart/BookingsChart";
import BookingsControls from "../components/Bookings/BookingsControls/BookingsControls";

const BookingsPage = () => {
    const {token} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [outputType, setOutputType] = useState('list');

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
                            price
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

    const changeOutputTypeHandler = outputType => {
        if (outputType === 'list') {
            setOutputType('list')
        } else {
            setOutputType('chart')
        }
    };

    useEffect(fetchBookings, []);

    return (
        <>
            {isLoading ? (
                <Spinner/>
            ) : (
                <>
                    <BookingsControls activeOutputType={outputType} onChange={changeOutputTypeHandler}/>
                    <div>
                        {outputType === 'list' ? (
                            <BookingList bookings={bookings} onDelete={deleteBookingHandler}/>
                        ) : (
                            <BookingsChart bookings={bookings}/>
                        )}
                    </div>
                </>

            )}
        </>
    )
};

export default BookingsPage