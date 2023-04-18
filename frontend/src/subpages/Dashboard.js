import './Dashboard.css';
import { Card, Container, Row, ListGroup, Badge, Button, Modal, Form, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

function format_date(date){
  date = new Date(date);
  return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
}

function TripCard(props) {
  const navigate = useNavigate();
  const[creator, setCreator] = useState(null);
  const [hovered, setHovered] = useState(false);
  const hoverOn = () => setHovered(true);
  const hoverOff = () => setHovered(false);
  // const[destination, setDestination] = useState(null);

  useEffect(() => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      credentials: "include"
    };
    
    fetch("http://localhost:3001/user/" + props.trip.creator_id, requestOptions)
    .then(response => response.json())
    .then(json => setCreator(json.first_name + " " + json.last_name))
    .catch(() => setCreator(null));
  }, [props]);

  function redirectToTrip(){
    navigate('/trip/' + props.trip._id);
  }

  function countPeople(){
    if(props.trip.collaborator_ids.length === 0){
      return "1 Person"
    }
    else{
      return props.trip.collaborator_ids.length + 1 + " People"
    }
  }

  let pill;
  const startDate = new Date(props.trip.start_date);
  const currentDate = new Date(new Date().getFullYear(),new Date().getMonth(), new Date().getDate());
  console.log(props.trip.start_date.replaceAll('-','/'));
  console.log(currentDate);
  console.log(startDate);

  if(props.trip.status === "Pending" && startDate > currentDate){
    pill = <Badge pill bg="warning" text="dark"> Pending </Badge>; 
  }
  else if(props.trip.status === "Paid"){
    pill = <Badge pill bg="success"> Paid </Badge>; 
  }
  else{
    pill = <Badge pill bg="danger"> Expired </Badge>;
  }

  const cardStyle = {
    transform: hovered ? 'scale(1.05)' : 'none',
    transition: 'all 0.3s ease-in-out',
    'minWidth': 280, cursor: "pointer"
  };

  return(
    <Card tag="a" className={hovered ? 'shadow' : 'shadow'} style={cardStyle} onClick={redirectToTrip} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between">
          Trip to {props.trip.destination_id}
          {pill}
          {/* <Badge className="edit-button" as={Button} onClick={redirectToTrip}>🖉</Badge> */}
        </Card.Title>
        <Card.Subtitle className='mb-2 text-muted'>
          {format_date(props.trip.start_date)} - {format_date(props.trip.end_date)}
        </Card.Subtitle>
        <Card.Subtitle className='mb-1 text-muted'>
          {countPeople()}
        </Card.Subtitle>
      </Card.Body>
      <ListGroup className="list-group-flush card-body p-0">
        <ListGroup.Item className="d-flex justify-content-between">
          Flights
          {props.trip.flight_ids.length > 0 ? <Badge bg="success">✓</Badge> : <Badge bg="danger">✕</Badge>}
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          Hotels
          {props.trip.hotel_ids.length > 0 ? <Badge bg="success">✓</Badge> : <Badge bg="danger">✕</Badge>}
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          Activities
          <Badge bg="secondary">{props.trip.activity_ids.length}</Badge>
        </ListGroup.Item>
      </ListGroup>
      <Card.Footer>Created by {creator}</Card.Footer>
    </Card>
  );
}

function NewTripModal(props){
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visibility, setVisibility] = useState(false);

  function updateLocations(query){
    setIsLoading(true);
    fetch(`http://localhost:3001/amadeus/search?keyword=${query}`)
    .then((resp) => resp.json())
    .then((locations) => {
      console.log(locations.data);
      setLocations(locations.data);
      setIsLoading(false);
    }).catch((err) => console.log(err));
  }

  function handleSubmit(e){
    e.preventDefault();

    const body = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      destination_id: destination,
      visibility: visibility
    });
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: body,
        redirect: 'follow',
        'credentials': 'include'
    };

    fetch("http://localhost:3001/trip/", requestOptions)
    .then(response => {
        if(response.ok){
          props.update();
          props.handleClose();
        }
        else{
          alert(response.text());
        }
    });
  }

  const filterBy = () => true;

  return(
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Trip</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form.Group className="mb-3" controlId="formDestination">
        <Form.Label>Destination</Form.Label>
        <AsyncTypeahead
          filterBy={filterBy}
          labelKey={option => `${option.name}, ${option.address.countryName}`}
          placeholder='Search for a destination'
          id='formDestination'
          isLoading={isLoading}
          minLength={3}
          options={locations}
          onSearch={updateLocations}
          renderMenuItemChildren={(option) => (
            <span>{`${option.name}, ${option.address.countryName}`}</span>
          )}
          onChange={(selected) => setDestination(selected[0].iataCode)}
        />
      </Form.Group>

      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => setStartDate(e.target.value)}/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formEndDates">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => setEndDate(e.target.value)}/>
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group  className="mb-3" controlId="formVisibility">
        <Form.Switch
          label="Set Visible to Friends"
          onChange={(e) => setVisibility(e.target.checked)}/>
      </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
          Create Trip
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function UserTrips(){
  const[trips, setTrips] = useState(null);
  const[show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
  if(trips && trips.length !== 0){
    cards = trips.map(trip =>
    <ListGroup.Item key={trip._id} className='border-0'>{<TripCard trip={trip}/>}</ListGroup.Item>);
  }
  else{
    cards = <h6 className='m-1'>You don't have any trips yet. Click the "+" icon above to create one.</h6>
  }

  return (
    <Row>
      <h2 className='my-3 mx-2'>
        Your trips
        <Badge className='ms-2 add-button' as={Button} onClick={handleShow}>+</Badge>
        <NewTripModal show={show} handleClose={handleClose} update={getTrips}/>
      </h2>
      <hr/>
      <ListGroup className='cardgroup pb-3' horizontal='sm' style={{'overflowY': 'auto'}}>
        {cards}
      </ListGroup>
      <hr/>
    </Row>
  );
}

function Dashboard() {
  return(
    <Container>
      {UserTrips()}
    </Container>
  )
}

export default Dashboard;
