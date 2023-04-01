import './App.css';
import { Card, Container, Row, ListGroup, Badge, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';

function format_date(date){
  date = new Date(date);
  return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
}

function TripCard(props) {
  const[creator, setCreator] = useState(null);
  // const[destination, setDestination] = useState(null);

  function getCreator(){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      credentials: "include"
    };
    
    fetch("http://localhost:3001/user/" + props.trip.creator_id, requestOptions)
    .then(response => response.json())
    .then(json => setCreator(json.first_name + " " + json.last_name))
    .catch(() => setCreator(null));
  }

  useEffect(() => {
    getCreator();
  }, []);

  return(
    <Card style={{'min-width': 280}}>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between">
          Trip to New York City
          <Badge className='ms-2' as={Button}>🖉</Badge>
        </Card.Title>
        <Card.Subtitle className='mb-2 text-muted'>
          {format_date(props.trip.start_date)} - {format_date(props.trip.end_date)}
        </Card.Subtitle>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item className="d-flex justify-content-between">
          Flights
          <Badge bg="success">✓</Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          Hotels
          <Badge bg="danger">✕</Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          Activities
          <Badge bg="secondary">0</Badge>
        </ListGroup.Item>
      </ListGroup>
      <Card.Footer>Created by {creator}</Card.Footer>
    </Card>
  );
}

function UserTrips(){
  const[trips, setTrips] = useState(null);

  function getTrips(){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      credentials: "include"
    };
    
    fetch("http://localhost:3001/trip/user", requestOptions)
    .then(response => response.json())
    .then(json => setTrips(json))
    .catch(() => setTrips(null));
  }

  useEffect(() => {
    getTrips();
  }, []);

  let cards;
  if(trips){
    cards = trips.map(trip => <ListGroup.Item className='border-0'>{<TripCard trip={trip}/>}</ListGroup.Item>);
  }

  return (
    <Row>
      <h2 className='my-3 mx-2'>Your trips</h2>
      <ListGroup horizontal='sm' style={{'overflow-y': 'auto'}}>
        {cards}
      </ListGroup>
    </Row>
  );
}

function Home() {
  return(
    <Container>
      {UserTrips()}
    </Container>
  )
}

export default Home;
