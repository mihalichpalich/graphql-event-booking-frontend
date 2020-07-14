import React from "react";

import './EventItem.css';

const eventItem = ({eventId, title, userId, creatorId, price, date, onDetail}) => (
    <li key={eventId} className="events__list-item">
        <div>
            <h1>{title}</h1>
            <h2>${price} - {new Date(date).toLocaleDateString('ru-RU')}</h2>
        </div>
        <div>
            {userId === creatorId ? (
                <p>You are the owner of this event</p>
            ) : (
                <button className="btn" onClick={onDetail.bind(this, eventId)}>View Details</button>
                //bind применяется для того, чтобы ф-я onDetail не применялась сразу
            )}
        </div>
    </li>
);

export default eventItem;