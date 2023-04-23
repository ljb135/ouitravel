import { Form, Container, Card, Button, ListGroup, InputGroup, Col, Row, Badge, Modal, CloseButton, Spinner, FormGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function format_date(date){
    date = new Date(date);
    return (date.getMonth()+1) + "/" + (date.getDate()+1) + "/" + date.getFullYear();
}

function formatTime(str){
    let departureTime = str.substring(11,16);
    let departureHour = Number(departureTime.substring(0,2));

    if(departureHour > 12){
        departureTime = departureHour - 12 + departureTime.substring(2) + " PM";
    }
    else departureTime = departureHour + departureTime.substring(2) + " AM";
    return departureTime
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
                    <NewFlightModal show={show} handleClose={handleClose} trip={props.trip} update={props.update}/>
                </h4>
                <ListGroup variant='flush'>
                    <hr className='my-0' />
                    {props.trip.flight_ids.map(id => <FlightListItem flight={id} trip={props.trip} update={props.update}/>)}
                </ListGroup>
            </Card.Body>
        </Card>
    )
}

function FlightListItem(props) {
    const [airline, setAirline] = useState(null);
    const [travelClass, setTravelClass] = useState(null);
    const [price, setPrice] = useState(null);
    const [startLocation, setStartLocation] = useState(null);
    const [destinationLocation, setDestinationLocation] = useState(null);
    const [departureDepartureTime, setDepartureDepartureTime] = useState(new Date());
    const [departureArrivalTime, setDepartureArrivalTime] = useState(new Date());
    const [returnDepartureTime, setReturnDepartureTime] = useState(new Date());
    const [returnArrivalTime, setReturnArrivalTime] = useState(new Date());
    const [flightOffer, setFlightOffer] = useState(null);

    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            'credentials': 'include'
        };

        fetch("http://localhost:3001/flight/" + props.flight, requestOptions)
            .then(response => response.json())
            .then(json => {
                setAirline(json.airline);
                setTravelClass(json.travelClass);
                setPrice(json.price);
                setStartLocation(json.start_location);
                setDestinationLocation(json.destination_location);
                setDepartureDepartureTime(new Date(json.departure_departure_time));
                setDepartureArrivalTime(new Date(json.departure_arrival_time));
                setReturnDepartureTime(new Date(json.return_departure_time));
                setReturnArrivalTime(new Date(json.return_arrival_time));
                setFlightOffer(json.flight_offer);         
            });
    }, []);

    function removeFlight(e){
        e.preventDefault();
    
        const requestOptions = {
          method: 'DELETE',
          'credentials': 'include'
        };
    
        fetch(`http://localhost:3001/flight/${props.flight}/trip/${props.trip._id}`, requestOptions)
        .then(response => {
            if(response.ok){
              props.update();
            }
            else{
              alert(response.text());
            }
        });
    }

    return (
        <ListGroup.Item className='my-1'>
            <div className='d-flex justify-content-between'>
                <h5 className='mb-1'>{`${airline} - ${travelClass}`}</h5><CloseButton className='ms-2' onClick={(e) => removeFlight(e)}></CloseButton>
            </div>
            <div>
                {`${startLocation} (${departureDepartureTime.toLocaleDateString()} ${departureDepartureTime.toLocaleTimeString()}) →  
                ${destinationLocation} (${departureArrivalTime.toLocaleDateString()} ${departureArrivalTime.toLocaleTimeString()})`}
            </div>
            <div className='mb-1'>
                {`${destinationLocation} (${returnDepartureTime.toLocaleDateString()} ${returnDepartureTime.toLocaleTimeString()}) → 
                ${startLocation} (${returnArrivalTime.toLocaleDateString()} ${returnArrivalTime.toLocaleTimeString()})`}
            </div>
            {/* <div>{description}</div> */}
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
        //   console.log(flights.data);
          setLoading(false);
        });
    }

    useEffect(() => {
        getFlights();
      }, [props, travelClass]);

    let flightItems = [];

    for(let i = 0; i < flights.length; i++){
      flightItems.push(
        <FlightItem eventKey={i} trip={props.trip} flight={flights[i]} dict={dict} travelClass={travelClass} update={props.update} close={props.handleClose}/>
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

    function addFlight(e){
        e.preventDefault();
    
        // console.log(props.flight);
    
        const body = new URLSearchParams({
            airline: props.dict.carriers[props.flight.validatingAirlineCodes],
            travelClass: props.travelClass,
            price: props.flight.price.total,
            start_location: departureFlight.departure.iataCode,
            destination_location: departureFlight.arrival.iataCode,
            departure_departure_time: departureFlight.departure.at,
            departure_arrival_time: departureFlight.arrival.at,
            return_departure_time: returnFlight.departure.at,
            return_arrival_time: returnFlight.arrival.at,
            flight_offer: JSON.stringify(props.flight)
        });
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: body,
            redirect: 'follow',
            'credentials': 'include'
        };
    
        fetch("http://localhost:3001/flight/", requestOptions)
        .then(response => response.json())
        .then(body => addFlightToTrip(body))
        .catch(err => alert(err));
    }

    function addFlightToTrip(id){
        const requestOptions = {
          method: 'PUT',
          'credentials': 'include'
        };
    
        fetch(`http://localhost:3001/flight/${id}/trip/${props.trip._id}`, requestOptions)
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
        <ListGroup.Item key={props.eventKey}>
            <h5>{props.dict.carriers[props.flight.validatingAirlineCodes]}</h5>
            <h6 className='my-1'>Departure:</h6>
            <div>{departureFlight.departure.iataCode} ({departureFlight.departure.at.substring(0, 10)} {formatTime(departureFlight.departure.at)}) → {departureFlight.arrival.iataCode} ({departureFlight.arrival.at.substring(0, 10)} {formatTime(departureFlight.arrival.at)})</div>
            <h6 className='mt-2 mb-1'>Return:</h6>
            <div>{returnFlight.departure.iataCode} ({returnFlight.departure.at.substring(0, 10)} {formatTime(returnFlight.departure.at)}) → {returnFlight.arrival.iataCode} ({returnFlight.arrival.at.substring(0, 10)} {formatTime(returnFlight.arrival.at)})</div>
            <Button className='mt-2' onClick={(e) => addFlight(e)}>{props.flight.price.total} {props.flight.price.currency}</Button>
        </ListGroup.Item>
    )
}

export default FlightsDisplay;