import { Card, Button, ListGroup, Badge, Modal, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ActivityItem(props){
    function addActivity(e){
        e.preventDefault();
        
        const requestOptions = {
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
        <ListGroup.Item className='d-flex justify-content-between'>
            <div>{props.activity.name} {props.activity.rating ? `(${props.activity.rating}⭐)` : null}</div>
            <Button onClick={(e) => addActivity(e)}>+</Button>
        </ListGroup.Item>
    );
}

function NewActivityModal(props) {
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState([]);

    function getActivities(){
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

    useEffect(() => {
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
                <ListGroup>
                    {loading ? <div className='d-flex justify-content-center'>
                                    <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div> : activityItems}
                </ListGroup>
            </Modal.Body>
        </Modal>
    )
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
                </ListGroup>
            </Card.Body>
        </Card>
    )
}

export default ActivitiesDisplay;