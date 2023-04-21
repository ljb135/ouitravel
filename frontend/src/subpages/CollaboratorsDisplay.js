import { Form, Container, Card, Button, ListGroup, InputGroup, Col, Row} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function CollaboratorsDisplay(props){
    const [collaborators, setCollaborators] = useState([]);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            const response = await fetch('http://localhost:3001/friends', {
                method: 'GET',
                redirect: 'follow',
                credentials: "include"
            })
            const jsonRes = await response.json();

            console.log(jsonRes)

            setFriends(jsonRes)
        }
        fetchData();
    }, []);
  
    useEffect(() => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        credentials: "include"
      };
  
      let collabs = [];
  
      props.collaborators.forEach(collaborator => {
        fetch("http://localhost:3001/user/" + collaborator, requestOptions)
        .then(response => response.json())
        .then(json => collabs = [...collabs, json.first_name + " " + json.last_name])
        .catch(() => setCollaborators([]));
      });
  
      setTimeout(() => setCollaborators(collabs), 200);
    }, [props]);
  
    let items;
    if(collaborators && collaborators.length !== 0){
      items = collaborators.map(collaborator =>
        <ListGroup.Item className="d-flex justify-content-between">
          {collaborator}
          <button type="button" className="btn-close" aria-label="Close"></button>
        </ListGroup.Item>
      );
    }
  
    return(
      <Card className="shadow mt-4">
        <Card.Body>
          <h4 className='d-flex align-items-center card-title'>
            Collaborators
          </h4>
          <ListGroup>
            {items}
          </ListGroup>
          <InputGroup className='mt-3'>
              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
              <Form.Select
                placeholder="Friend"
                aria-label="Friend"
                aria-describedby="basic-addon1">
                    {friends.map((friend) => <option value={friend.user2_email}>{friend.user2_email}</option>)}
              </Form.Select>
              <Button id="button-addon2">
                Add Collaborator
              </Button>
            </InputGroup>
        </Card.Body>
      </Card>
    )
  }

  export default CollaboratorsDisplay;