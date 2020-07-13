import React, {useState} from "react";

import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

const EventsPage = () => {
    const [creating, setCreating] = useState(false);

    const startCreateEventHandler = () => {
        setCreating(true);
    };

    const modalConfirmHandler = () => {
        setCreating(false);
    };

    const modalCancelHandler = () => {
        setCreating(false);
    };

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
                    <p>Modal Content</p>
                </Modal>
            )}
            <div className="events-control">
                <p>Share your own events!</p>
                <button className="btn" onClick={startCreateEventHandler}>Create Event</button>
            </div>
        </>
    )
};

export default EventsPage