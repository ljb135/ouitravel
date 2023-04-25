import React, { useState, useEffect } from 'react';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import { Card, Button, Modal } from 'react-bootstrap';
import { Buffer } from 'buffer';

function History() {
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tripInfo, setTripInfo] = useState({});
  const [chartData, setChartData] = useState(null);
  const [posts, setPosts] = useState([]);


  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    credentials: 'include'
  };

  useEffect(() => {
    fetch('http://localhost:3001/trip-history', requestOptions)
    .then(response => response.json())
    .then(json => {
      setTrips(json);
    })
    .catch(error => {
      console.error('Error fetching trip data:', error);
      setTrips(null);
    });
  }, []);
  
  const handleShowModal = async(tripId) => {
    try {
      const res = await fetch(`http://localhost:3001/trip/id/${tripId}`, {
        credentials: 'include',
      });
      if(res.ok){
        const data = await res.json();
        setTripInfo(data);
        const hotelprices = [];
        const flightprices = [];
        const activityprices = [];
        const hotelpromises = data.hotel_ids.map(hotelId => {
          return fetch(`http://localhost:3001/hotel/${hotelId}`, requestOptions)
            .then(response => {
              if(!response.ok) {
                throw new Error(`Error fetching hotel data for trip with hotel_id ${hotelId}: ${response.status}`);
              }
              return response.json();
            })
              .then(hotel=> {
                hotelprices.push(hotel.price);
            })
        });
  
        const flightpromises = data.flight_ids.map(flightId => {
          return fetch(`http://localhost:3001/flight/${flightId}`, requestOptions)
            .then(response => {
              if(!response.ok) {
                throw new Error(`Error fetching flight data for trip with flight_id ${flightId}: ${response.status}`);
              }
              return response.json();
            })
            .then(flight => {
              flightprices.push(flight.price);
            });
        });
  
        const activitypromises = data.activity_ids.map(activityId => {
          return fetch(`http://localhost:3001/activity/${activityId}`, requestOptions)
            .then(response => {
              if(!response.ok) {
                throw new Error(`Error fetching activity data for trip with activity_id ${activityId}: ${response.status}`);
              }
              return response.json();
            })
            .then(activity => {
              activityprices.push(activity.price);
            });
        });
  
        Promise.all([
          Promise.all(hotelpromises),
          Promise.all(flightpromises),
          Promise.all(activitypromises),
        ])
          .then(() => {
            const chartData = {
              labels: ['Hotels', 'Flights', 'Activities'],
              datasets: [
                {
                  data: [
                    hotelprices.reduce((acc, curr) => acc + curr, 0),
                    flightprices.reduce((acc, curr) => acc + curr, 0),
                    activityprices.reduce((acc, curr) => acc + curr, 0),
                  ],
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                },
              ],
            };
            setChartData(chartData);
          })
      }
    } catch (error) {
      console.error('Error fetching trip data:', error);
      setTripInfo({});
      setChartData(null);
    }

    setShowModal(true);
    fetch('http://localhost:3001/postList', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(posts => {
        // filter posts based on specific trip ID
        const filteredPosts = posts.filter(post => post.trip_id === tripId);
        setPosts(filteredPosts);
      })
      .catch(err => {
        console.error(err);
      });

   };
   

  {chartData && (
    <Pie data={chartData} />
  )}
  return (
    <div>
      <h1>My Trip History</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {trips.map(trip => (
          <div key={trip._id} className="col">
            <Card>
              {trip.image && <Card.Img variant="top" src={`data:image/jpeg;base64,${Buffer.from(trip.image).toString('base64')}`} />}
              <Card.Body>
                <Card.Text>{trip.destination_name}</Card.Text>
                <Button variant="primary" onClick={() => handleShowModal(trip._id)}>View Trip Info</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Trip Info</Modal.Title>
  </Modal.Header>
 <Modal.Body>
  <p><strong>Location:</strong> {tripInfo.destination_name}</p>
  <p><strong>Total Price:</strong> {tripInfo.price}</p>
  {chartData && <Pie data={chartData} />}
  {posts.map(post => {
  // Check if the post belongs to the current trip
  if (post.trip_id === tripInfo._id) {
    return (
      <div key={post._id} className="col">
        Photos From The Trip:
        {post.image && <Card.Img variant="top" src={`data:image/jpeg;base64,${Buffer.from(post.image).toString('base64')}`} />}
      </div>
    );
  }
})}
</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
  </Modal.Footer>
</Modal>
    </div>
  );
}


export default History;



