import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { Buffer } from 'buffer';

function Explore() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tripInfo, setTripInfo] = useState({});
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [tripsData, setTripsData] = useState([]);
  const [comments, setComments] = useState([]);
  const [modalType, setModalType] = useState('tripInfo');
  const [commentInput, setCommentInput] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);


  useEffect(() => {
    const fetchPostsAndTrips = async () => {
      try {
        const [postsRes, tripsRes] = await Promise.all([
          fetch('http://localhost:3001/returnallposts', { credentials: 'include' }),
          fetch('http://localhost:3001/trip/returntrips', { credentials: 'include' }),
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

  const handleShowComments = async (postId) => {
    const res = await fetch(`http://localhost:3001/return_comments/${postId}`);
    if (res.ok) {
      const data = await res.json();
      setComments(data);
      setShowModal(true);
      setModalType('comments');
    } else {
      console.error(`Failed to get comments for post with ID ${postId}`);
    }
  };

  const filteredPosts = selectedLocation ? posts.map(post => ({
    ...post, 
    trip: tripsData.find(trip => trip._id === post.trip_id)
  })).filter(post => post.trip?.destination_id === selectedLocation) : posts.map(post => ({
    ...post,
    trip:tripsData.find(trip => trip._id === post.trip_id)
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const res = await fetch(`http://localhost:3001/add_comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        comment: commentInput,
        post_id: selectedPost._id
      }),
      credentials: 'include'
    });

    if (res.ok) {
      const data = await res.json();
      setComments([...comments, data]);
      setModalType('newcomment');
      setCommentInput('');
      setSelectedPost(null);
      setShowModal(false);
    } else {
      console.error(`Failed to create comment for post`);
    }
  };

  const handleAddComment = (post) => {
    setCommentInput('');
    setSelectedPost(post);
    setShowModal(true);
    setModalType('addComment')
  }
  

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
                <Card.Title>{post.creator_name}</Card.Title>
                <Card.Text>{post.comment}</Card.Text>
                <Button variant="primary" onClick={() => handleShowModal(post.trip_id)}>View Trip Info</Button>
                <Button variant = "secondary" onClick ={() => handleShowComments(post._id)}>Comments</Button>
                <Button variant = "success" onClick={() => handleAddComment(post)}>Add Comment</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={() => {
        setShowModal(false)
        setComments([]);
      }}>
        <Modal.Header closeButton>
        <Modal.Title>
          {modalType === 'comments'
            ? 'Comments'
            : modalType === 'tripInfo'
            ? 'Trip Info'
            : 'Add Comment'}
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'comments' 
            ? (
              <ul>
                {comments.map(comment => (
                  <li key={comment._id}>
                    {comment.creator_name}:{comment.comment}
                  </li>
                ))}
              </ul>
            ) 
            : modalType ==='tripInfo' 
            ?(
              <div>
                <p><strong>Location:</strong> {tripInfo.destination_id}</p>
                <p><strong>Start Date:</strong> {new Date(tripInfo.start_date).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(tripInfo.end_date).toLocaleDateString()}</p>
              </div>
            ):(
              <form onSubmit={handleSubmit}>
                <label>
                  Comment:
                  <input type="text" value={commentInput} onChange={e => setCommentInput(e.target.value)} />
                </label>
                <button type="submit">Submit</button>
              </form>
              
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      
    </div>
  );
}

export default Explore;