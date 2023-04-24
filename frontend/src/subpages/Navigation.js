import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';

function Navigation(props){
    const navigate = useNavigate();
    
    function signOut(){
        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow',
            'credentials': 'include'
        };

        fetch("http://localhost:3001/session", requestOptions)
        .then(response => {
            if(response.ok){
                navigate(0);
            }
            else{
                alert(response.text());
            }
        });
    }

    if(props.name !== null){
        return(
            <Navbar bg="light" variant="light">
                <Container>
                <Navbar.Brand as={Link} to="/" className='title'>OuiTravel</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <NavDropdown title="Media">
                        <NavDropdown.Item as={Link} to="/explore">Explore</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/mypostscontainer">My Posts</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/friendpostko">Friends</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link as={Link} to="/history">History</Nav.Link>
                </Nav>
                <Nav>
                    <NavDropdown title={"Hi, " + props.name}>
                        <NavDropdown.Item href="#account">Profile</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/friends">Friends</NavDropdown.Item>
                        <NavDropdown.Item href="/Payments">Payment History</NavDropdown.Item>
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
                {/* <Nav>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </Nav> */}
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