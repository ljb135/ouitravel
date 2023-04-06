import Modal, { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Trip(props) {
  const tripParams = useParams();
  const[trip, setTrip] = useState(null);

  useEffect(() => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      credentials: "include"
    };
    
    fetch("http://localhost:3001/trip/id/" + tripParams.id, requestOptions)
    .then(response => response.json())
    .then(json => setTrip(json))
    .catch(() => setTrip(null));
  }, [tripParams]);

  console.log(trip);

  return (
    <Container>
    </Container>
  );
}

export default Trip;
