import React, {useState, useContext, useEffect} from "react";

import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import axios from "../core/axios";
import {AuthContext} from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";

const EventsPage = () => {
    const {token, userId} = useContext(AuthContext);
    const titleElRef = React.createRef();
    const priceElRef = React.createRef();
    const dateElRef = React.createRef();
    const descriptionElRef = React.createRef();
    const [events, setEvents] = useState([]);
    const [creating, setCreating] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
                setEvents([...events, resData.data.createEvent])
            })
            .catch(err => {
                console.log(err)
            })
    };

    const modalCancelHandler = () => {
        setCreating(false);
        setSelectedEvent(null)
    };

    const bookEventHandler = () => {

    };

    const fetchEvents = () => {
        setIsLoading(true);

        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        date
                        price
                        creator {
                            _id                            
                        }
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
                setEvents(events);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            })
    };

    useEffect(fetchEvents, []);

    const showDetailHandler = eventId => {
        setSelectedEvent(() => {
            const selectedEvent = events.find(e => e._id === eventId);
            return selectedEvent
        })
    };

    return (
        <>
            {(creating || selectedEvent) && <Backdrop/>}
            {creating && (
                <Modal
                    title="Add Event"
                    canCancel
                    canConfirm
                    onCancel={modalCancelHandler}
                    onConfirm={modalConfirmHandler}
                    confirmText="Confirm"
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
            {selectedEvent && (
                <Modal
                    title={selectedEvent.title}
                    canCancel
                    canConfirm
                    onCancel={modalCancelHandler}
                    onConfirm={bookEventHandler}
                    confirmText="Book"
                >
                    <h1>{selectedEvent.title}</h1>
                    <h2>${selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString('ru-RU')}</h2>
                    <p>{selectedEvent.description}</p>
                </Modal>
            )}
            {token && (
                <div className="events-control">
                    <p>Share your own events!</p>
                    <button className="btn" onClick={startCreateEventHandler}>Create Event</button>
                </div>
            )}
            {isLoading ? <Spinner/> : <EventList events={events} authUserId={userId} onViewDetail={showDetailHandler}/>}
        </>
    )
};

export default EventsPage