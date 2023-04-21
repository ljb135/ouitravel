import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { Buffer } from 'buffer';

function FriendPostList() {
  const [posts, setPosts] = useState([]);
  const[friends, setFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tripInfo, setTripInfo] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001/friends', { ///friendsPostList/:id
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setFriends(data);
      })
      .catch(err => {
        console.error(err);
      });
      
  }, []);

  
    
  useEffect(() =>{
  friends.map(friend=> {
    fetch(`/friendsPostList/${friend.user2_email}`, { ///friendsPostList/:id
      credentials: 'include'
    })
      .then(res => console.log(res))
      .then(data => {
        setPosts(data);
      })
      .catch(err => {
        console.error(err);
      });
  })
}, []);
  
  console.log(JSON.stringify(friends));
  console.log(JSON.stringify(posts));
  
  


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

  return (
    <div>
      <h1>Friends Posts</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {friends.map(friend => (
          <div key={friend._id} className="col">
            <Card>


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
          <p><strong>Start Date:</strong> {new Date(tripInfo.start_date).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(tripInfo.end_date).toLocaleDateString()}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FriendPostList;
