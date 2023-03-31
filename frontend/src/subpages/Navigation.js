import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';

function Navigation(props){
    const navigate = useNavigate();
    
    function signOut(){
        var requestOptions = {
            method: 'POST',
            redirect: 'follow',
            'credentials': 'include'
        };

        fetch("http://localhost:3001/logout", requestOptions)
        .then(response => {
            if(response.ok){
                props.setName(null);
                navigate('/', { replace: true });
            }
            else{
                alert(response.text());
            }
        });
    }
    // fetch("localhost:3001/users")

    if(props.name !== null){
        return(
            <Navbar bg="light" variant="light">
                <Container>
                <Navbar.Brand as={Link} to="/">OuiTravel</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/trips">Trips</Nav.Link>
                    <Nav.Link as={Link} to="/paymentList">PaymentList</Nav.Link>
                    <Nav.Link as={Link} to="/history">History</Nav.Link>
                </Nav>
                <Nav>
                    <NavDropdown title={"Hi, " + props.name}>
                        <NavDropdown.Item href="#account">Profile</NavDropdown.Item>
                        <NavDropdown.Item href="#account">Friends</NavDropdown.Item>
                        <NavDropdown.Item href="#account">Payment</NavDropdown.Item>
                        <NavDropdown.Item onClick={signOut}>Sign out</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                </Container>
            </Navbar>
        );
    } else {
        return(
            <Navbar bg="light" variant="light">
                <Container>
                <Navbar.Brand as={Link} to="/">OuiTravel</Navbar.Brand>
                <Nav>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/paymentList">PaymentList</Nav.Link>
                </Nav>
                </Container>
            </Navbar>
        );
    }

    // return(
    //     <Navbar bg="light" variant="light">
    //         <Container>
    //         <Navbar.Brand href="/">OuiTravel</Navbar.Brand>
    //         <Nav className="me-auto">
    //             <Nav.Link href="/">Home</Nav.Link>
    //             <Nav.Link href="trips">Trips</Nav.Link>
    //             <Nav.Link href="history">History</Nav.Link>
    //         </Nav>
    //         <Nav>
    //             <NavDropdown title="Account">
    //                 <NavDropdown.Item href="#account">Profile</NavDropdown.Item>
    //                 <NavDropdown.Item href="#account">Friends</NavDropdown.Item>
    //                 <NavDropdown.Item href="#account">Payment</NavDropdown.Item>
    //             </NavDropdown>
    //         </Nav>
    //         </Container>
    //     </Navbar>
    // );
}

export default Navigation