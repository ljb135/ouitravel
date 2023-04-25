import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { Buffer } from 'buffer';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tripInfo, setTripInfo] = useState({});
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [tripsData, setTripsData] = useState([]);

  useEffect(() => {
    const fetchPostsAndTrips = async () => {
      try {
        const [postsRes, tripsRes] = await Promise.all([
          fetch('http://localhost:3001/returnallposts', { credentials: 'include' }),
          fetch('http://localhost:3001/trip/returntrips', { credentials: 'include' })
        ]);
        
        const [postsData, tripsData] = await Promise.all([postsRes.json(), tripsRes.json()]);
        const uniqueLocations = [...new Set([...tripsData.map(trip => trip.destination_id)])];
        setLocations(uniqueLocations);
        setPosts(postsData);
        setTripsData(tripsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostsAndTrips();
  }, []);

  const handleShowModal = async(tripId) => {
    const res = await fetch(`http://localhost:3001/trip/id/${tripId}`, {
      credentials: 'include'
    });
    if(res.ok){
      const data = await res.json();
      setTripInfo(data);
      setShowModal(true);
    } else {
      console.error(`Failed to get trip info with ID ${tripId}`);
    }
  };

  const handleLocationSelect = (event) => {
    setSelectedLocation(event.target.value);
  };

  const filteredPosts = selectedLocation ? posts.map(post => ({ ...post, trip: tripsData.find(trip => trip._id === post.trip_id) })).filter(post => post.trip?.destination_id === selectedLocation) : posts;

  



  return (
    <div>
      <h1>Search Post by Location</h1>
      <div>
        <label htmlFor="location-filter">Filter by location:</label>
        <select id="location-filter" value={selectedLocation} onChange={handleLocationSelect}>
          <option value="">All locations</option>
          {locations.map(location => <option key={location} value={location}>{location}</option>)}
        </select>
      </div>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filteredPosts.map(post => (
          <div key={post._id} className="col">
            <Card>
              {post.image && <Card.Img variant="top" src={`data:image/jpeg;base64,${Buffer.from(post.image).toString('base64')}`} />}
              <Card.Body>
                <Card.Text>{post.comment}</Card.Text>
                <Button variant="primary" onClick={() => handleShowModal(post.trip_id)}>View Trip Info</Button>
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
          <p><strong>Location:</strong> {tripInfo.destination_id}</p>
          <p><strong>Start Date:</strong> {tripInfo.start_date ? new Date(tripInfo.start_date).toLocaleDateString() : ''}</p>
          <p><strong>End Date:</strong>{tripInfo.end_date ? new Date(tripInfo.end_date).toLocaleDateString() : ''}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostList;