import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';

function getTrips(setData) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    credentials: 'include'
  };

  fetch('http://localhost:3001/trip-history', requestOptions)
    .then(response => response.json())
    .then(json => {
      const destinations = {};
      json.forEach(trip => {
        const destination = trip.destination_id;
        if (destinations[destination]) {
          destinations[destination] += trip.price;
        } else {
          destinations[destination] = trip.price;
        }
      });
      const chartData = {
        labels: Object.keys(destinations),
        datasets: [
          {
            data: Object.values(destinations),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#44AD32', '#9B59B6']
          }
        ]
      };
      setData(chartData);
    })
    .catch(error => {
      console.error('Error fetching trip data:', error);
      setData(null);
    });
}

const History = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    getTrips(setData);
  }, []);

  return (
    <div>
      <h1>Price by Destination</h1>
      {data ? <Pie data={data} /> : <p>No data to display</p>}
    </div>
  );
};

export default History;
