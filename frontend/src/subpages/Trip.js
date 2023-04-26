import { Form, Container, Card, Button, Col, Row, Modal, Alert, Badge} from 'react-bootstrap';
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

  const [show, setShow] = useState(false);
  const [price, setPrice] = useState(0);

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
  
  useEffect(() => {
    const fetchInfo = async () =>{
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        'credentials': 'include'
      };

      let subtotal = await props.trip.hotel_ids.reduce(async (acc, id) => {
        let res = await fetch("http://localhost:3001/hotel/" + id, requestOptions);
        let json = await res.json();
        console.log(json)
        return acc + json.price;
      }, 0);

      subtotal += await props.trip.flight_ids.reduce(async (acc, id) => {
        let res = await fetch("http://localhost:3001/flight/" + id, requestOptions);
        let json = await res.json();
        console.log(json)
        return await acc + json.price;
      }, 0);

      subtotal += await props.trip.activity_ids.reduce(async (acc, id) => {
        let res = await fetch("http://localhost:3001/activity/" + id, requestOptions);
        let json = await res.json();
        console.log(json)
        return await acc + json.price;
      }, 0);

      console.log(subtotal)

      setPrice(subtotal);
    }

    fetchInfo();
  }, [props]);

  function payTrip(){
    let body = new URLSearchParams({
      price: price
    });
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    let requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: body,
      'credentials': 'include'
    };

    fetch(`http://localhost:3001/trip/id/${props.trip._id}`, requestOptions)
    .then(response => {
        if(response.ok){
          props.update();
          handleShow();
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
            <Paypal trip={props.trip} update={props.update} close={handleClose}/>
          </Modal.Body>
        </Modal>
        <div>
          <Badge bg='success' variant='success'><h6 className='m-0'>Total: ${price.toFixed(2)}</h6></Badge>
          {props.trip.status === "Pending" ? <Button className="ms-2" onClick={payTrip}>Pay Now</Button> : null}
          {props.trip.status !== "Paid" ? <Button className="ms-2" variant='danger' onClick={(e) => handleDelete(e)}>Delete</Button> : null}
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
                disabled={props.trip.status === "Paid"}
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
                disabled={props.trip.status === "Paid"}
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
      <ActivitiesDisplay trip={props.trip} update={props.update}/>
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
