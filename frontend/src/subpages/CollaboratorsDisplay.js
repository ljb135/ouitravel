import { Form, Container, Card, Button, ListGroup, InputGroup, Col, Row} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function CollaboratorsDisplay(props){
    const [creator, setCreator] = useState(null);
    const [collaborators, setCollaborators] = useState([]);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState()

    useEffect(() => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        credentials: "include"
      };
      
      fetch("http://localhost:3001/user/id/" + props.trip.creator_id, requestOptions)
      .then(response => response.json())
      .then(json => setCreator(json.first_name + " " + json.last_name))
      .catch(() => setCreator(null));
    }, [props]);

    useEffect(() => {
        const fetchData = async() => {
            const response = await fetch('http://localhost:3001/friends', {
                method: 'GET',
                redirect: 'follow',
                credentials: "include"
            })
            const jsonRes = await response.json();
            setFriends(jsonRes)
            setSelectedFriend(jsonRes[0].user2_email);
        }
        fetchData();
    }, [props]);
  
    useEffect(() => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        credentials: "include"
      };
  
      let collabs = [];
  
      props.trip.collaborator_ids.forEach(collaborator => {
        fetch("http://localhost:3001/user/id/" + collaborator, requestOptions)
        .then(response => response.json())
        .then(json => collabs = [...collabs, {name: json.first_name + " " + json.last_name, id: json._id}])
        .catch(() => setCollaborators([]));
      });
  
      setTimeout(() => setCollaborators(collabs), 200);
    }, [props]);
  
    let items;
    if(collaborators && collaborators.length !== 0){
      items = collaborators.map(collaborator =>
        <ListGroup.Item className="d-flex justify-content-between">
          {collaborator.name}
          <button type="button" className="btn-close" aria-label="Close" onClick={(e) => removeCollaborator(e, collaborator.id)}></button>
        </ListGroup.Item>
      );
    }

    function addCollaborator(e, email){
      e.preventDefault();

      if(!email){
        return;
      }

      var requestOptions = {
        method: 'GET',
        credentials: "include"
      };

      fetch("http://localhost:3001/user/email/" + email, requestOptions)
      .then(response => response.json())
      .then(body => addCollaboratorToFlight(body[0]._id))
      .catch(err => alert(err));
    }

    function addCollaboratorToFlight(id){
      const requestOptions = {
        method: 'PUT',
        'credentials': 'include'
      };
  
      fetch(`http://localhost:3001/collaborator/${id}/trip/${props.trip._id}`, requestOptions)
      .then(response => {
        if(response.ok){
          props.update();
        }
        else{
          alert(response.text());
        }
      });
    }

    function removeCollaborator(e, id){
      e.preventDefault();
    
      const requestOptions = {
        method: 'DELETE',
        'credentials': 'include'
      };
  
      fetch(`http://localhost:3001/collaborator/${id}/trip/${props.trip._id}`, requestOptions)
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
      <Card className="shadow mt-4">
        <Card.Body>
          <h4 className='d-flex align-items-center card-title'>
            Your Party
          </h4>
          <ListGroup>
            <ListGroup.Item className="d-flex justify-content-between">
              {creator} (Creator)
            </ListGroup.Item>
            {items}
          </ListGroup>
          <InputGroup className='mt-3'>
              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
              <Form.Select
                placeholder="Friend"
                onChange={(e) => setSelectedFriend(e.target.value)}>
                  {friends.map((friend) => <option value={friend.user2_email}>{friend.user2_email}</option>)}
              </Form.Select>
              <Button id="button-addon2" onClick={(e) => addCollaborator(e, selectedFriend)}>
                Add Collaborator
              </Button>
            </InputGroup>
        </Card.Body>
      </Card>
    )
  }

  export default CollaboratorsDisplay;