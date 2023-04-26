import { Card, Button, ListGroup, Badge, Modal, Spinner, CloseButton, Accordion } from 'react-bootstrap';
import { useState, useEffect } from 'react';

function ActivityItem(props){
    function addActivity(e){
        e.preventDefault();

        const body = new URLSearchParams({
            _id: props.activity.id,
            name: props.activity.name,
            rating: props.activity.rating !== undefined ? props.activity.rating : 0,
            description: props.activity.description !== undefined ? props.activity.description.replaceAll(/<[^>]+>/g,'') : "",
            price: props.activity.price.amount !== undefined ? props.activity.price.amount : 0,
            longitude: props.activity.geoCode.longitude,
            latitude: props.activity.geoCode.latitude,
        });

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: body,
            'credentials': 'include'
        };

        fetch("http://localhost:3001/activity/", requestOptions)
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
      
          fetch(`http://localhost:3001/activity/${props.activity.id}/trip/${props.trip._id}`, requestOptions)
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
        <Accordion.Item eventKey={props.eventKey}>
            <Accordion.Header>{props.activity.name} {props.activity.rating ? `(${props.activity.rating}⭐)` : null}</Accordion.Header>
            <Accordion.Body>
                <div className='mb-2'>{props.activity.description.replaceAll(/<[^>]+>/g,'')}</div>
                <Button onClick={(e) => addActivity(e)}>{Number(props.activity.price.amount) === 0 ? "Free" : `${Number(props.activity.price.amount).toFixed(2)} ${props.activity.price.currencyCode}`}</Button>
            </Accordion.Body>
        </Accordion.Item>
    );
}

function NewActivityModal(props) {
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        function getActivities(){
            if(props.show === false){
                return;
            }
    
            setLoading(true);
            fetch(`http://localhost:3001/amadeus/activities?longitude=${props.trip.longitude}&latitude=${props.trip.latitude}`)
            .then((resp) => resp.json())
            .then((activityList) => {
                setActivities(activityList.data);
                console.log(activityList)
            //   console.log(flights.data);
                setLoading(false);
            });
        }

        getActivities();
      }, [props]);

    let activityItems = [];

    for(let i = 0; i < activities.length; i++){
      activityItems.push(
        <ActivityItem eventKey={i} trip={props.trip} activity={activities[i]} update={props.update} close={props.handleClose}/>
      )
    }

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add an Activity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Accordion>
                    {loading ? <div className='d-flex justify-content-center'>
                                    <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div> : activityItems}
                </Accordion>
            </Modal.Body>
        </Modal>
    )
}

function ActivityDisplayItem(props){
    const [name, setName] = useState();
    const [rating, setRating] = useState();
    const [description, setDescription] = useState();
    const [price, setPrice] = useState(0);

    useEffect(() => {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow',
          'credentials': 'include'
        };
    
        fetch("http://localhost:3001/activity/" + props.activity_id, requestOptions)
        .then(response => response.json())
        .then(json => {
          setName(json.name);
          setRating(json.rating);
          setPrice(json.price);
          setDescription(json.description);
        });
      }, [props]);

      function removeActivity(e){
        e.preventDefault();
    
        const requestOptions = {
          method: 'DELETE',
          'credentials': 'include'
        };
    
        fetch(`http://localhost:3001/activity/${props.activity_id}/trip/${props.trip._id}`, requestOptions)
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
        <ListGroup.Item>
            <div className='d-flex justify-content-between'>
                <h5>{name} {rating !== 0 ? `(${rating}⭐)` : null}</h5>
                <CloseButton onClick={(e) => removeActivity(e)}/>
            </div>
            {/* <div>{description}</div> */}
            <Badge className='mt-2' bg="success"><h6 className='m-0'>${price.toFixed(2)}</h6></Badge>
        </ListGroup.Item>
    );
}

function ActivitiesDisplay(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Card className='my-4 shadow'>
            <Card.Body>
                <h4 className='d-flex align-items-center card-title my-0'>Activities
                    <Badge className='ms-2 add-button' as={Button} onClick={handleShow}>+</Badge>
                    <NewActivityModal show={show} handleClose={handleClose} trip={props.trip} update={props.update}/>  
                </h4>
                <ListGroup variant='flush'>
                    {props.trip.activity_ids.length !== 0 ? <hr className='mb-0 mt-2'/>  : null}
                    {props.trip.activity_ids.map(activity_id => <ActivityDisplayItem activity_id={activity_id} trip={props.trip} update={props.update}/>)}
                </ListGroup>
            </Card.Body>
        </Card>
    )
}

export default ActivitiesDisplay;