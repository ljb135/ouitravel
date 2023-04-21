import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { Buffer } from 'buffer';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tripInfo, setTripInfo] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001/postList', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setPosts(data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleDelete = async(postId) => {
    const res = await fetch(`http://localhost:3001/delete/${postId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if(res.ok){
      setPosts(posts.filter(post => post._id !== postId));
    } else {
      console.error(`Failed to delete post with ID ${postId}`);
    }
  };

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
      <h1>My Posts</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {posts.map(post => (
          <div key={post._id} className="col">
            <Card>
              {post.image && <Card.Img variant="top" src={`data:image/jpeg;base64,${Buffer.from(post.image).toString('base64')}`} />}
              <Card.Body>
                <Card.Text>{post.comment}</Card.Text>
                <Button variant="danger" onClick={() => handleDelete(post._id)}>Delete</Button>
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

export default PostList;
