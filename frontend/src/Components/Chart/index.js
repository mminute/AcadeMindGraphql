import React from 'react';
import { Bar as BarChart } from 'react-chartjs';

const BOOKINGS_BUCKETS = {
  cheap: {
    min: 0,
    max: 100,
  },
  normal: {
    min: 100,
    max: 200,
  },
  expensive: {
    min: 200,
    max: 100000,
  },

}

export default function Chart({ bookings }) {
  const chartData = {
    labels: [],
    datasets: [],
  };

  let values = [];

  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = bookings.reduce((prev, current) => {
      if (current.event.price >= BOOKINGS_BUCKETS[bucket].min && current.event.price < BOOKINGS_BUCKETS[bucket].max) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);

    values.push(filteredBookingsCount);

    chartData.labels.push(bucket);

    chartData.datasets.push({
      fillColor: 'rgba(220,220,220,0.5)',
      strokeColor: 'rgba(220,220,220,0.8)',
      highlightFill: 'rgba(220,220,220,0.75)',
      highlightStroke: 'rgba(220,220,220,1)',
      data: values,
    });

    values = [...values]
    values[values.length - 1] = null;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <BarChart data={chartData}/>
    </div>
  );
}
