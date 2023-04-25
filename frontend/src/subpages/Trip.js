import { Form, Container, Card, Button, ListGroup, InputGroup, Col, Row, Modal, Alert} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import HotelsDisplay from './HotelDisplay';
import FlightsDisplay from './FlightsDisplay';
import ActivitiesDisplay from './ActivitiesDisplay';
import CollaboratorsDisplay from './CollaboratorsDisplay';
import MapContainer from './MapContainer';
import Paypal from './Paypal';

function TripInfo(props){
  let startDate = props.trip.start_date;
  let endDate = props.trip.end_date;

  const[show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  function handleDelete(e){

    e.preventDefault();

    var requestOptions = {
        method: 'DELETE',
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

  function editDate(){

    const body = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: body,
        redirect: 'follow',
        'credentials': 'include'
    };

    fetch("http://localhost:3001/trip/id/" + props.trip._id, requestOptions)
    .then(response => {
        if(response.ok){
          props.update();
        }
        else{
          alert(response.text());
        }
    });
  }

  return(
    <>
      <div className="my-3 d-flex justify-content-between">
        <h2>Trip to {props.trip.destination_name}</h2>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton/>
          <Modal.Body>
            <Paypal trip={props.trip}/>
          </Modal.Body>
        </Modal>
        <div>
          <Button onClick={handleShow}>Pay Now</Button>
          <Button className="ms-2" variant='danger' onClick={(e) => handleDelete(e)}>
            Delete
          </Button>
        </div>
      </div>
      <Row>
        <Col>
          <Card className='shadow'>
            <Card.Body>
            <Form.Group className="" controlId="formStartDate">
              <Form.Label as="h4">Start Date</Form.Label>
              <Form.Control
                type="date"
                defaultValue={props.trip.start_date.toString().substring(0,10)}
                onChange={(e) => {
                  startDate = e.target.value;
                  editDate();
                }}/>
            </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='shadow'>
            <Card.Body>
            <Form.Group className="" controlId="formEndDates">
              <Form.Label as="h4">End Date</Form.Label>
              <Form.Control
                type="date"
                defaultValue={props.trip.end_date.toString().substring(0,10)}
                onChange={(e) => {
                  endDate = e.target.value;
                  editDate();
                }}/>
            </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <CollaboratorsDisplay trip={props.trip} update={props.update}/>
      <FlightsDisplay trip={props.trip} update={props.update}/>
      <HotelsDisplay trip={props.trip} update={props.update}/>
      <ActivitiesDisplay trip={props.trip}/>
      <MapContainer trip={props.trip} update={props.update}/>
    </>
  )
}

function Trip() {
  const tripParams = useParams();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);

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

    setLoading(false);
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
      {!loading ? body : <Alert className='mt-4'>You do not have permission accessing this trip.</Alert>}
    </Container>
  );
}

export default Trip;
