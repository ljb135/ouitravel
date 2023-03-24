import { Form, Button, Container, Card, Row, Col} from 'react-bootstrap'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDOB] = useState("");
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault();

        const body = new URLSearchParams({
            email: email,
            password: password,
            first_name: firstName,
            last_name: lastName,
            dob: dob,
            is_mod: false
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

        fetch("http://localhost:3001/register", requestOptions)
        .then(response => {
            if(response.ok){
                response.text().then(name => props.setName(name));
                navigate('/', { replace: true });
            }
            else{
                alert(response.text());
            }
        });
    }

    return (
        <Container>
            <Row className='py-5'>
                <Col md={{span: 6, offset: 3}}>
                    <Card>
                        <Card.Header>Register</Card.Header>
                        <Card.Body>
                            <Form onSubmit={(e) => handleSubmit(e)}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="name@example.com"
                                        onChange={(e) => setEmail(e.target.value)}/>
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formFirstName">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="John"
                                                onChange={(e) => setfirstName(e.target.value)}/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formLastName">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Smith"
                                                onChange={(e) => setlastName(e.target.value)}/>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="formDOB">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        onChange={(e) => setDOB(e.target.value)}/>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        onChange={(e) => setPassword(e.target.value)}/>
                                </Form.Group>

                                <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
                                Submit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
  }
  
  export default Register;