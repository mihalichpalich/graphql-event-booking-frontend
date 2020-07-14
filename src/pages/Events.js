import React, {useState, useContext, useEffect} from "react";

import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import axios from "../core/axios";
import {AuthContext} from "../context/auth-context";

const EventsPage = () => {
    const {token} = useContext(AuthContext);
    const titleElRef = React.createRef();
    const priceElRef = React.createRef();
    const dateElRef = React.createRef();
    const descriptionElRef = React.createRef();
    const [events, setEvents] = useState([]);
    const [creating, setCreating] = useState(false);

    const startCreateEventHandler = () => {
        setCreating(true);
    };

    const modalConfirmHandler = () => {
        setCreating(false);

        const title = titleElRef.current.value;
        const price = +priceElRef.current.value;
        const description = descriptionElRef.current.value;
        const date = dateElRef.current.value;
        const event = {title, price, date, description};

        for (let key in event) {
            if (key !== "price" && event[key].trim().length === 0) {
                return
            }
            if (key === "price" && event["price"] <= 0) {
                return;
            }
        }

        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {
                        title: "${title}", 
                        description: "${description}", 
                        price: ${price},
                        date: "${date}"
                    })
                    {
                        _id
                        title
                        description
                        date
                        price
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        };

        axios.post('http://localhost:3001/graphql', requestBody, {
            headers: {Authorization: "Bearer " + token}
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!')
                }

                return res.data
            })
            .then(resData => {
                fetchEvents()
            })
            .catch(err => {
                console.log(err)
            })
    };

    const modalCancelHandler = () => {
        setCreating(false);
    };

    const fetchEvents = () => {
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        date
                        price
                    }
                }
            `
        };

        axios.post('http://localhost:3001/graphql', requestBody)
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!')
                }

                return res.data
            })
            .then(resData => {
                const events = resData.data.events;
                setEvents(events)
            })
            .catch(err => {
                console.log(err)
            })
    };

    useEffect(fetchEvents, []);

    return (
        <>
            {creating && <Backdrop/>}
            {creating && (
                <Modal
                    title="Add Event"
                    canCancel
                    canConfirm
                    onCancel={modalCancelHandler}
                    onConfirm={modalConfirmHandler}
                >
                    <form action="">
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={titleElRef}/>
                        </div>

                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={priceElRef}/>
                        </div>

                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={dateElRef}/>
                        </div>

                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                cols="30" rows="4"
                                ref={descriptionElRef}
                            ></textarea>
                        </div>
                    </form>
                </Modal>
            )}
            {token && (
                <div className="events-control">
                    <p>Share your own events!</p>
                    <button className="btn" onClick={startCreateEventHandler}>Create Event</button>
                </div>
            )}
            <ul className="events__list">
                {events.map(event => <li key={event._id} className="events__list-item">{event.title}</li>)}
            </ul>
        </>
    )
};

export default EventsPage