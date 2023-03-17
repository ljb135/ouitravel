import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap'
import { useState } from 'react';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e){
        e.preventDefault();

        const body = new URLSearchParams({email: email, password: password});
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: body,
            redirect: 'follow',
            'credentials': 'include'
        };

        fetch("http://localhost:3001/login", requestOptions)
        .then(response => {
            if(response.ok){
                console.log(response.text());
                // window.location.href = "http://localhost:3000";
            }
            else{
                alert(response.text());
            }
        });
    }

    return (
        <Container>
            <Row>
                <Col md={{span: 8, offset: 2}}>
                    <Card>
                        <Card.Header>Login</Card.Header>
                        <Card.Body>
                            <Form action='https://localhost:3001/login' method='POST' onSubmit={(e) => handleSubmit(e)}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        onChange={(e) => setEmail(e.target.value)}/>
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
  
  export default Login;