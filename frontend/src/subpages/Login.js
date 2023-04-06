import { Form, Button, Container, Card, Row, Col, Nav } from 'react-bootstrap'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

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

        fetch("http://localhost:3001/session", requestOptions)
        .then(response => {
            if(response.ok){
                response.text().then(name => props.setName(name));
                navigate('/', { replace: true });
            }
            else{
                response.text().then(body => {alert(body)}).catch(e => alert(e));
            }
        });
    }

    return (
        <Container>
            <Row className='py-5'>
                <Col md={{span: 6, offset: 3}}>
                    <Card>
                        <Card.Header>Login</Card.Header>
                        <Card.Body>
                            <Form onSubmit={(e) => handleSubmit(e)}>
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

                                <Row>
                                    <Col>
                                        <Button href="http://localhost:3001/auth/google" variant="outline-dark" role="button" style={{"textTransform":"none"}}>
                                        <img width="20px" style={{"marginBottom":3, "marginRight":5}} alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                                        Login with Google
                                        </Button>
                                    </Col>
                                </Row>

                                <Nav className="mb-2">
                                        <Nav.Link className='px-1' as={Link} to="/register">Don't have an account?</Nav.Link>
                                </Nav>

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