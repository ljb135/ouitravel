import { Form, Container, Card, Button, ListGroup, InputGroup, Col, Row, Badge, Modal, CloseButton, Spinner, FormGroup } from 'react-bootstrap';
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
    const [loading, setLoading] = useState(false);
    const [travelClass, setTravelClass] = useState("ECONOMY");
    const [flights, setFlights] = useState([]);
    const [dict, setDict] = useState([]);

    function getFlights(){
        if(!props.show || props.trip.destination_id === "NYC"){
            return;
        }
        setLoading(true);
        fetch(`http://localhost:3001/amadeus/flights?origin=${"NYC"}&destination=${props.trip.destination_id}&departureDate=${props.trip.start_date.slice(0,10)}&returnDate=${props.trip.end_date.slice(0,10)}&adults=${1}&travelClass=${travelClass}`)
        .then((resp) => resp.json())
        .then((flights) => {
          setFlights(flights.data);
          setDict(flights.dictionaries)
          console.log(flights.data);
          setLoading(false);
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
      }, [props, travelClass]);

    let flightItems = [];

    for(let i = 0; i < flights.length; i++){
      flightItems.push(
        <FlightItem eventKey={i} flight={flights[i]} dict={dict} update={props.update} close={props.close}/>
      )
    }

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Book a Flight</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className='mb-3' controlId='formTravelClass'>
                    <Form.Label>Travel Class</Form.Label>
                    <Form.Select
                        defaultValue={"ECONOMY"}
                        onChange={(e) => setTravelClass(e.target.value)}>
                        <option value={"ECONOMY"}>Economy</option>
                        <option value={"PREMIUM_ECONOMY"}>Premium Economy</option>
                        <option value={"BUSINESS"}>Business</option>
                        <option value={"FIRST"}>First</option>
                    </Form.Select>
                </Form.Group>
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

function FlightItem(props){
    let departureFlight = props.flight.itineraries[0].segments[0];
    let returnFlight = props.flight.itineraries[1].segments[0];

    function formatTime(str){
        let departureTime = str.substring(11,16);
        let departureHour = Number(departureTime.substring(0,2));

        if(departureHour > 12 && departureHour < 24){
            departureTime = departureHour - 12 + departureTime.substring(2) + " PM";
        }
        else if(departureHour === 12){
            departureTime = departureHour + departureTime.substring(2) + " PM";
        }
        else departureTime = departureHour + departureTime.substring(2) + " AM";
        return departureTime
    }

    function addFlight(e, offer){
        e.preventDefault();
    
        console.log(props.hotel, offer);
    
        const body = new URLSearchParams({
          _id: offer.id,
          hotel_name: props.hotel.name,
          room_description: offer.room.description.text,
          num_rooms: offer.roomQuantity !== undefined ? offer.roomQuantity : 1,
          price: offer.price.total,
          check_in: offer.checkInDate,
          check_out: offer.checkOutDate
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
    
        fetch("http://localhost:3001/hotel/", requestOptions)
        .then(response => {
            if(response.ok){
              console.log("OK")
            }
            else{
              alert(response.text());
            }
        });
    
        requestOptions = {
          method: 'PUT',
          'credentials': 'include'
        };
    
        fetch(`http://localhost:3001/hotel/${offer.id}/trip/${props.trip}`, requestOptions)
        .then(response => {
            if(response.ok){
              props.update();
              props.close();
            }
            else{
              alert(response.text());
            }
        });
    }

    return(
        <ListGroup.Item>
            <h5>{props.dict.carriers[props.flight.validatingAirlineCodes]}</h5>
            <h6 className='my-1'>Departure:</h6>
            <div>{departureFlight.departure.iataCode} ({departureFlight.departure.at.substring(0, 10)} {formatTime(departureFlight.departure.at)}) → {departureFlight.arrival.iataCode} ({departureFlight.arrival.at.substring(0, 10)} {formatTime(departureFlight.arrival.at)})</div>
            <h6 className='mt-2 mb-1'>Return:</h6>
            <div>{returnFlight.departure.iataCode} ({returnFlight.departure.at.substring(0, 10)} {formatTime(returnFlight.departure.at)}) → {returnFlight.arrival.iataCode} ({returnFlight.arrival.at.substring(0, 10)} {formatTime(returnFlight.arrival.at)})</div>
            <Button className='mt-2' onClick={(e) => null}>{props.flight.price.total} {props.flight.price.currency}</Button>
        </ListGroup.Item>
    )
}

export default FlightsDisplay;