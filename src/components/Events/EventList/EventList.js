import React from "react";

import './EventList.css';
import EventItem from './EventItem/EventItem';

const eventList = ({events, authUserId, onViewDetail}) => {
    const eventListItems = events.map(event =>
        <EventItem
            key={event._id}
            eventId={event._id}
            title={event.title}
            price={event.price}
            date={event.date}
            userId={authUserId}
            creatorId={event.creator._id}
            onDetail={onViewDetail}
        />
    );

    return (
        <ul className="event__list">
            {eventListItems}
        </ul>
    )
};

export default eventList;