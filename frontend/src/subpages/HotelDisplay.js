import { Form, Card, Button, Col, Row, Badge, Modal, Accordion, ListGroup, CloseButton } from 'react-bootstrap';
import { useState, useEffect } from 'react';

function format_date(date){
  date = new Date(date);
  return (date.getMonth()+1) + "/" + (date.getDate()+1) + "/" + date.getFullYear();
}

function NewHotelModal(props){
    const [startDate, setStartDate] = useState(props.trip.start_date);
    const [endDate, setEndDate] = useState(props.trip.end_date);
    const [numRooms, setNumRooms] = useState(1);
  
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState([]);

    function getHotels(){
      fetch(`http://localhost:3001/amadeus/hotels?cityCode=${props.trip.destination_id}`)
      .then((resp) => resp.json())
      .then((hotels) => {
        getOffers(hotels.data);
      });
    }

    function getOffers(hotel_list){
      setLoading(true);
      if(hotel_list.length !== 0){
        let ids = hotel_list.map(hotel => hotel.hotelId).slice(0, 150);

        fetch(`http://localhost:3001/amadeus/offers?hotelIds=${ids}&rooms=${numRooms}&checkIn=${startDate.slice(0,10)}&checkOut=${endDate.slice(0,10)}`)
        .then((resp) => resp.json())
        .then((hotelOffers) => {
          if(hotelOffers.data !== undefined && hotelOffers.data.length !== 0){
            // console.log(hotelOffers)
            setHotels(hotelOffers.data);
            setLoading(false);
          }
        }).catch((err) => console.log(err));
      }
    }
  
    useEffect(() => {
      getHotels();
    }, [props, startDate, endDate, numRooms]);

    let hotelItems = [];

    for(let i = 0; i < hotels.length; i++){
      // console.log(hotels[i])
      hotelItems.push(
        <HotelDropdown eventKey={i} hotel={hotels[i]} check_in={startDate} check_out={endDate} numRooms={numRooms} trip={props.trip._id} update={props.update} close={props.close}/>
      )
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
        <Form.Group className="mb-3" controlId="formEndDates">
          <Form.Label>Number of Rooms</Form.Label>
          <Form.Select
            defaultValue={1}
            onChange={(e) => setNumRooms(e.target.value)}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
          </Form.Select>
        </Form.Group>
        <Accordion>
          {loading ? <div>Loading...</div> : hotelItems}
        </Accordion>
        </Modal.Body>
      </Modal>
    )
  }

function HotelDropdown(props){
  return(
    <Accordion.Item eventKey={props.eventKey}>
      <Accordion.Header>
        {props.hotel.hotel.name}
      </Accordion.Header>
      <Accordion.Body>
        <HotelOffers offers={props.hotel.offers} hotel={props.hotel.hotel} trip={props.trip} update={props.update} close={props.close}/>
      </Accordion.Body>
    </Accordion.Item>
  )
}

function HotelOffers(props){

  function addHotel(e, offer){
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
    <ListGroup variant='flush'>
      {props.offers.map((offer) => {
        let info = offer.room.description.text.split("\n")
        let title = info[0]
        let description = info.slice(1).map(line => <div>{line}</div>);
        // console.log(offer);
        return (<ListGroup.Item><h6>{title}</h6>{description}<Button className='mt-2' onClick={(e) => addHotel(e, offer)}>{offer.price.total} {offer.price.currency}</Button></ListGroup.Item>);
      })}
    </ListGroup>
  )
}

function HotelListItem(props){
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

  return(
    <ListGroup.Item className='my-2'>
      <div className='my-0 d-flex justify-content-between'>
        <h5>{hotelName}</h5><CloseButton className='ms-2'></CloseButton>
      </div>
      <div className='mb-1'>{format_date(checkInDate)} - {format_date(checkOutDate)} • {numRooms} Rooms</div>
      <div>{description}</div>
      <div>${price}</div>
    </ListGroup.Item>
  )
}

function HotelsDisplay(props){
    const[show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return(
        <Card className='mt-4'>
        <Card.Body>
          <Card.Title className='d-flex align-items-center'>Hotels
              <Badge className='ms-2 mt-1 add-button' as={Button} onClick={handleShow}>+</Badge>
          </Card.Title>
          <NewHotelModal show={show} handleClose={handleClose} trip={props.trip} update={props.update} close={handleClose}/>
          <ListGroup variant='flush'>
            <hr className='my-0'/>
            {props.trip.hotel_ids.map(id => <HotelListItem hotel={id}/>)}
          </ListGroup>
        </Card.Body>
        </Card>
    )
}

export default HotelsDisplay;