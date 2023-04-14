import { Form, Container, Card, Button, ListGroup, InputGroup, Col, Row, Badge, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function FlightsDisplay(props){
    const[show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return(
        <Card className='mt-4'>
          <Card.Body>
          <Card.Title>Flights
            <Badge className='ms-2 add-button' as={Button} onClick={handleShow}>+</Badge>
            <NewFlightModal show={show} handleClose={handleClose} trip={props.trip}/>
          </Card.Title>
          </Card.Body>
        </Card>
      )
}

function NewFlightModal(props){
    
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState(props.trip.start_date);
    const [endDate, setEndDate] = useState(props.trip.end_date);
    const [visibility, setVisibility] = useState(false);
  

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
                <Modal.Title>Book a Flight</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Row>
                <Col>
                    <Form.Group className="mb-3" controlId="formStartDate">
                        <Form.Label>Departure Date</Form.Label>
                        <Form.Control
                            type="date"
                            defaultValue={props.trip.start_date.toString().substring(0,10)}
                            onChange={(e) => setStartDate(e.target.value)}/>
                         </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" controlId="formEndDates">
                        <Form.Label>Return Date</Form.Label>
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
                    Book a Flight
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default FlightsDisplay;