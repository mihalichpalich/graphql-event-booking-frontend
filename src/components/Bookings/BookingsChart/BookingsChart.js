import React from "react";
import {Bar as BarChart} from 'react-chartjs';

const BOOKINGS_CHART_BUCKETS = {
    'Free': {
        min: 0,
        max: 0,
        color: 'gray'
    },
    '$': {
        min: 0.01,
        max: 9.99,
        color: 'green'
    },
    '$$': {
        min: 10,
        max: 99.99,
        color: 'yellow'
    },
    '$$$': {
        min: 100,
        max: 999.99,
        color: 'orange'
    },
    '$$$$ and more': {
        min: 1000,
        max: Number.MAX_SAFE_INTEGER,
        color: 'red'
    }
};

const bookingsChart = ({bookings}) => {
    const chartData = {labels: [], datasets: []};
    let values = [];
    const colors = [];

    for (const bucket in BOOKINGS_CHART_BUCKETS) {
        const filteredBookingsCount = bookings.reduce((prev, current) => {
            if (current.event.price > BOOKINGS_CHART_BUCKETS[bucket].min && current.event.price < BOOKINGS_CHART_BUCKETS[bucket].max) {
                return prev +1
            } else {
                return prev
            }
        }, 0);

        values.push(filteredBookingsCount);
        chartData.labels.push(bucket);
        colors.push(BOOKINGS_CHART_BUCKETS[bucket].color);
        chartData.datasets.push({
            fillColor: colors,
            strokeColor: colors,
            data: values
        });

        values = [...values];
        values[values.length - 1] = 0
    }

    return (
        <div style={{textAlign: 'center'}}>
            <BarChart data={chartData}/>
        </div>
    )
};

export default bookingsChart;