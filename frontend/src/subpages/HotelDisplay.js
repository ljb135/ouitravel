import { Form, Card, Button, Col, Row, Badge, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';

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
  
      fetch(`http://localhost:3001/amadeus/hotels?cityCode=${props.trip.destination_id}`)
      .then((resp) => resp.json())
      .then((hotels) => {
        console.log(hotels.data);
        setHotels(hotels.data);
        setLoading(false);
      });
    }, [props]);
  
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

export default HotelsDisplay;