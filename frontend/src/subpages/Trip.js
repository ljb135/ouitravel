import { Form, Container, Card, Button, ListGroup, InputGroup, Col, Row} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import HotelsDisplay from './HotelDisplay';
import FlightsDisplay from './FlightsDisplay';

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
    <Card className="shadow mt-4">
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

function AttractionsDisplay(props){

}

function TripInfo(props){
  const [creator, setCreator] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [destination, setDestination] = useState("");
  const[show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  function handleDelete(e){
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
        method: 'DELETE',
        headers: myHeaders,
        body: body,
        redirect: 'follow',
        'credentials': 'include'
    };
  
    fetch("http://localhost:3001/trip/" + props.trip._id, requestOptions)
    .then(response => {
        if(response.ok){
          navigate("/");
        }
        else{
          alert(response.text());
        }
    });
  }

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
    <>
      <div className="my-3 d-flex justify-content-between">
        <h2>Trip to {props.trip.destination_id}</h2>
        <Button variant='danger' onClick={(e) => handleDelete(e)}>
          Delete
        </Button>
      </div>
      <Card className='shadow'>
        <Card.Body>
        <Row>
          <Col>
            <Form.Group className="" controlId="formStartDate">
              <Form.Label as="h5">Start Date</Form.Label>
              <Form.Control
                type="date"
                defaultValue={props.trip.start_date.toString().substring(0,10)}
                onChange={(e) => setStartDate(e.target.value)}/>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="" controlId="formEndDates">
              <Form.Label as="h5">End Date</Form.Label>
              <Form.Control
                type="date"
                defaultValue={props.trip.end_date.toString().substring(0,10)}
                onChange={(e) => setEndDate(e.target.value)}/>
            </Form.Group>
          </Col>
        </Row>
        </Card.Body>
      </Card>
      <CollaboratorsDisplay collaborators={props.trip.collaborator_ids}/>
      <FlightsDisplay trip={props.trip}/>
      <HotelsDisplay trip={props.trip} update={props.update}/>
      <AttractionsDisplay activities={props.trip.activity_ids}/>
    </>
  )
}

function Trip() {
  const tripParams = useParams();
  const[trip, setTrip] = useState(null);

  function updateTrip(){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      credentials: "include"
    };
    
    fetch("http://localhost:3001/trip/id/" + tripParams.id, requestOptions)
    .then(response => response.json())
    .then(json => setTrip(json))
    .catch(() => setTrip(null));
  }

  useEffect(() => {
    updateTrip();
  }, [tripParams]);

  let body;

  if(trip){
    body = <TripInfo trip={trip} update={updateTrip}/>
    console.log(trip);
  }

  return (
    <Container>
      {body}
    </Container>
  );
}

export default Trip;
