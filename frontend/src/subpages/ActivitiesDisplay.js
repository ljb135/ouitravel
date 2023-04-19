import { Form, Container, Card, Button, ListGroup, InputGroup, Col, Row, Badge, Modal, CloseButton, Spinner, FormGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ActivitiesDisplay(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Card className='my-4 shadow'>
            <Card.Body>
                <h4 className='d-flex align-items-center card-title'>Activities
                    <Badge className='ms-2 add-button' as={Button}>+</Badge>    
                </h4>
                <ListGroup variant='flush'>
                    <hr className='my-0' />
                </ListGroup>
            </Card.Body>
        </Card>
    )
}

export default ActivitiesDisplay;