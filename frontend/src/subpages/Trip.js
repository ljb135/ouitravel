import { Form, Container, Card, Button, ListGroup, InputGroup, Col, Row, Badge, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function CollaboratorsDisplay(props){
  const[collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      credentials: "include"
    };

    let collabs = [];

    props.collaborators.forEach(collaborator => {
      fetch("http://localhost:3001/user/" + collaborator, requestOptions)
      .then(response => response.json())
      .then(json => collabs = [...collabs, json.first_name + " " + json.last_name])
      .catch(() => setCollaborators([]));
    });

    setTimeout(() => setCollaborators(collabs), 200);
  }, [props]);

  let items;
  if(collaborators && collaborators.length !== 0){
    items = collaborators.map(collaborator =>
      <ListGroup.Item className="d-flex justify-content-between">
        {collaborator}
        <button type="button" className="btn-close" aria-label="Close"></button>
      </ListGroup.Item>
    );
  }

  return(
    <Card>
      <Card.Body>
        <Card.Title>
          Collaborators
        </Card.Title>
        <ListGroup>
          {items}
        </ListGroup>
        <InputGroup className='mt-3'>
            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
            <Form.Control
              placeholder="Email"
              aria-label="Email"
              aria-describedby="basic-addon1"
            />
            <Button id="button-addon2">
              Add Collaborator
            </Button>
          </InputGroup>
      </Card.Body>
    </Card>
  )
}

function FlightsDisplay(props){

}

function NewHotelModal(props){
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(props.trip.start_date);
  const [endDate, setEndDate] = useState(props.trip.end_date);
  const [visibility, setVisibility] = useState(false);

  const [loading, setLoading] = useState(false);
  const [activeHotelId, setActiveHotelId] = useState(false);
  const [hotels, setHotels] = useState(null);
  const handleChange = (hotelId) => (event, expanded) => {
    setActiveHotelId(expanded ? hotelId : false);
  };

  useEffect(() => {
    console.log(startDate.substring(0,10))

    fetch(`http://localhost:3001/amadeus/hotels?cityCode=${props.trip.destination_id}&checkInDate=${startDate.substring(0,10)}&checkOutDate=${endDate.substring(0,10)}`)
    .then((resp) => resp.json())
    .then((hotels) => {
      console.log(hotels.data);
      setHotels(hotels.data);
      setLoading(false);
    });
  });

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

  return(
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Hotel Stay</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formStartDate">
            <Form.Label>Check-in Date</Form.Label>
            <Form.Control
              type="date"
              defaultValue={props.trip.start_date.toString().substring(0,10)}
              onChange={(e) => setStartDate(e.target.value)}/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formEndDates">
            <Form.Label>Check-out Date</Form.Label>
            <Form.Control
              type="date"
              defaultValue={props.trip.end_date.toString().substring(0,10)}
              onChange={(e) => setEndDate(e.target.value)}/>
          </Form.Group>
        </Col>
      </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
          Add Hotel Booking
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function HotelsDisplay(props){
  const[show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return(
    <Card className='mt-4'>
      <Card.Body>
      <Card.Title>Hotels
        <Badge className='ms-2 add-button' as={Button} onClick={handleShow}>+</Badge>
        <NewHotelModal show={show} handleClose={handleClose} trip={props.trip}/>
      </Card.Title>
      </Card.Body>
    </Card>
  )
}

function AttractionsDisplay(props){

}

function TripInfo(props){
  const[creator, setCreator] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  return(
    <Card className="mt-4">
      <Card.Header className="d-flex justify-content-between">
        <h3>Editing Trip to {props.trip.destination_id}</h3>
        <Button variant='danger'>Delete Trip</Button>
      </Card.Header>
      <Card.Body>
      <Row className='mb-2'>
        <Col>
          <Form.Group className="mb-3" controlId="formStartDate">
            <Form.Label as="h5">Start Date</Form.Label>
            <Form.Control
              type="date"
              defaultValue={props.trip.start_date.toString().substring(0,10)}
              onChange={(e) => setStartDate(e.target.value)}/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formEndDates">
            <Form.Label as="h5">End Date</Form.Label>
            <Form.Control
              type="date"
              defaultValue={props.trip.end_date.toString().substring(0,10)}
              onChange={(e) => setEndDate(e.target.value)}/>
          </Form.Group>
        </Col>
      </Row>
        <CollaboratorsDisplay collaborators={props.trip.collaborator_ids}/>
        <FlightsDisplay flights={props.trip.flight_ids}/>
        <HotelsDisplay trip={props.trip}/>
        <AttractionsDisplay activities={props.trip.activity_ids}/>
      </Card.Body>
    </Card>
  )
}

function Trip() {
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

  let body;

  if(trip){
    body = <TripInfo trip={trip}/>
    console.log(trip);
  }

  return (
    <Container>
      {body}
    </Container>
  );
}

export default Trip;
