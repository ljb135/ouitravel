import logo from './logo.svg';
import './App.css';
import { Card, Container, Row, Col, Stack, ListGroup, Badge } from 'react-bootstrap';

function Home() {
  return (
    <Container>
      <h1 className='my-4'>Your trips</h1>
      <Stack direction="horizontal" gap={3}>
        <Card>
          <Card.Body>
            <Card.Title>Trip to New York City</Card.Title>
            <Card.Subtitle className='mb-2 text-muted'>8/12/2023 - 3/30/2024</Card.Subtitle>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item className="d-flex justify-content-between">
              Flights
              <Badge bg="success">✓</Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              Hotels
              <Badge bg="danger">✕</Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              Activities
              <Badge bg="secondary">0</Badge>
            </ListGroup.Item>
          </ListGroup>
          <Card.Footer>Created by User1</Card.Footer>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Trip2</Card.Title>
          </Card.Body>
          <Card.Footer>Created by User2</Card.Footer>
        </Card>
      </Stack>
    </Container>
  );
}

export default Home;
