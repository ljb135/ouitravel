import React, { useState, useEffect } from 'react';

function CreatePost() {
  const [showForm, setShowForm] = useState(false);
  const [caption, setCaption] = useState('');
  const [picture, setPicture] = useState('');
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');


  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:3001/trip/user', {
            credentials: 'include'
        });
        console.log(response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrips();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('trip_id', selectedTripId);
    formData.append('caption', caption);
    formData.append('image', picture);
    
    try {
        // Send a POST request to the API to create a new post
        const response = await fetch('http://localhost:3001/post', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        alert('Post created');
        

        // Reset the form fields
        setCaption('');
        setPicture(null);
        setSelectedTripId('');
        setShowForm(false);
    }catch (error) {
        console.error('Error:', error);
    }

        
  };

  
    

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Create Post</button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>
            Caption:
            <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
          </label>
          <br />
          <label>
            Picture:
            <input type="file" onChange={(e) => setPicture(e.target.files[0])} />
          </label>
          <br />
          <label>
            Select a Trip:
            <select value={selectedTripId}onChange={(e)=>setSelectedTripId(e.target.value)} >
                <option value="">--Select a Trip--</option>
                {trips.map((trip) =>(
                    <option key={trip._id} value={trip._id}>
                        {trip.destination_id} ({trip.start_date} - {trip.end_date})
                    </option>
                ))}
            </select>
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      )}
      
    </div>
  );
}






export default CreatePost;
