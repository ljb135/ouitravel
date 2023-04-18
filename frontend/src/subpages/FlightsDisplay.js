import { Form, Container, Card, Button, ListGroup, InputGroup, Col, Row, Badge, Modal, CloseButton, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function format_date(date){
    date = new Date(date);
    return (date.getMonth()+1) + "/" + (date.getDate()+1) + "/" + date.getFullYear();
}

function FlightsDisplay(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Card className='mt-4 shadow'>
            <Card.Body>
                <h4 className='d-flex align-items-center card-title'>Flights
                    <Badge className='ms-2 add-button' as={Button} onClick={handleShow}>+</Badge>
                    <NewFlightModal show={show} handleClose={handleClose} trip={props.trip} />
                </h4>
                <ListGroup variant='flush'>
                    <hr className='my-0' />
                    {props.trip.flight_ids.map(id => <FlightListItem hotel={id} />)}
                </ListGroup>
            </Card.Body>
        </Card>
    )
}

function FlightListItem(props) {
    const [hotelName, setHotelName] = useState(null)
    const [description, setDescription] = useState(null);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [numRooms, setNumRooms] = useState(null);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            'credentials': 'include'
        };

        fetch("http://localhost:3001/hotel/" + props.hotel, requestOptions)
            .then(response => response.json())
            .then(json => {
                setDescription(json.room_description);
                setCheckInDate(json.check_in);
                setCheckOutDate(json.check_out);
                setHotelName(json.hotel_name);
                setNumRooms(json.num_rooms);
                setPrice(json.price);
            });
    });

    return (
        <ListGroup.Item className='my-1'>
            <div className='d-flex justify-content-between'>
                <h5 className='my-0'>{hotelName}</h5><CloseButton className='ms-2'></CloseButton>
            </div>
            <div className='mb-1'>{format_date(checkInDate)} - {format_date(checkOutDate)} • {numRooms} Rooms</div>
            <div>{description}</div>
            <Badge className='mt-2' bg="success"><h6 className='m-0'>${price}</h6></Badge>
        </ListGroup.Item>
    )
}

function NewFlightModal(props) {

    const [destination, setDestination] = useState("");
    const [visibility, setVisibility] = useState(false);

    const [loading, setLoading] = useState(false);
    const [flights, setFlights] = useState([]);

    function getFlights(){
        if(!props.show || props.trip.destination_id === "NYC"){
            return;
        }
        setLoading(true);
        fetch(`http://localhost:3001/amadeus/flights?origin=${"NYC"}&destination=${props.trip.destination_id}&departureDate=${props.trip.start_date.slice(0,10)}&returnDate=${props.trip.end_date.slice(0,10)}&adults=${1}`)
        .then((resp) => resp.json())
        .then((flights) => {
          console.log(flights);
        });
    }

    // function handleSubmit(e) {
    //     e.preventDefault();

    //     const body = new URLSearchParams({
    //         start_date: startDate,
    //         end_date: endDate,
    //         destination_id: destination,
    //         visibility: visibility
    //     });
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: body,
    //         redirect: 'follow',
    //         'credentials': 'include'
    //     };

    //     fetch("http://localhost:3001/trip/", requestOptions)
    //         .then(response => {
    //             if (response.ok) {
    //                 props.update();
    //                 props.handleClose();
    //             }
    //             else {
    //                 alert(response.text());
    //             }
    //         });
    // }

    useEffect(() => {
        getFlights();
      }, [props]);

    let flightItems = [];

    for(let i = 0; i < flights.length; i++){
      // console.log(hotels[i])
      flightItems.push(
        // <FlightItem eventKey={i} flight={flights[i]} check_in={startDate} check_out={endDate} trip={props.trip._id} update={props.update} close={props.close}/>
      )
    }

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Book a Flight</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="formStartDate">
                            <Form.Label>Departure Date</Form.Label>
                            <Form.Control
                                type="date"
                                defaultValue={props.trip.start_date.toString().substring(0, 10)}
                                onChange={(e) => setStartDate(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="formEndDates">
                            <Form.Label>Return Date</Form.Label>
                            <Form.Control
                                type="date"
                                defaultValue={props.trip.end_date.toString().substring(0, 10)}
                                onChange={(e) => setEndDate(e.target.value)} />
                        </Form.Group>
                    </Col>
                </Row> */}
                <ListGroup>
                    {loading ? <div className='d-flex justify-content-center'>
                                    <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div> : flightItems}
                </ListGroup>
            </Modal.Body>
        </Modal>
    )
}

function FlightItem(){
    return(
        <></>
    )
}

export default FlightsDisplay;