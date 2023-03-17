import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Navigation(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        credentials: "include"
    };

    var ret;

    fetch("http://localhost:3001/user", requestOptions)
    .then(response => {
        if(response.ok){
            return(
                <Navbar bg="light" variant="light">
                    <Container>
                    <Navbar.Brand href="/">OuiTravel</Navbar.Brand>
                    <Nav>
                        <Nav.Link href="/login">Login</Nav.Link>
                    </Nav>
                    </Container>
                </Navbar>
            );
        }
    });

    return(
        <Navbar bg="light" variant="light">
            <Container>
            <Navbar.Brand href="/">OuiTravel</Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="trips">Trips</Nav.Link>
                <Nav.Link href="history">History</Nav.Link>
            </Nav>
            <Nav>
                <NavDropdown title="Account">
                    <NavDropdown.Item href="#account">Profile</NavDropdown.Item>
                    <NavDropdown.Item href="#account">Friends</NavDropdown.Item>
                    <NavDropdown.Item href="#account">Payment</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            </Container>
        </Navbar>
    );
}

export default Navigation