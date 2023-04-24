import { Container, ListGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
// import './Friends.css';
// import { exampleList } from './FriendList.js';

// we create output inside the container (HTML)
function Friends(props) {
    const FriendParams = useParams();
    const [friends, setFriends] = useState(null);
    const [sent, setSent] = useState(null);
    const [received, setReceived] = useState(null);
    const [user1Email, setUser1Email] = useState("");
    const [user2Email, setUser2Email] = useState("");
    const [stat, setStatus] = useState();
    const [target_email, setTargetEmail] = useState("");

    //Get friends list
    function getFriends(status) {

        const query = new URLSearchParams({
            status: "friends"
        });

        const fetchData = async() => {
            const response = await fetch('http://localhost:3001/friends?' + query, {
                method: 'GET',
                redirect: 'follow',
                credentials: "include"
            })
            const jsonRes = await response.json();

            setFriends(jsonRes)
        }
        fetchData();
    }

    useEffect(() => {
        getFriends();
    }, []);

    console.log(friends);
    
    //Get received requests
    function getReceived() {

        const query = new URLSearchParams({
            status: "pending",
            key: "received"
        });

        const fetchData = async() => {
            const response = await fetch('http://localhost:3001/friends?' + query, {
                method: 'GET',
                redirect: 'follow',
                credentials: "include"
            })
            const jsonRes = await response.json();

            setReceived(jsonRes)
        }
        fetchData();
    }

    useEffect(() => {
        getReceived();
    }, []);

    //Get sent requests
    function getSent() {

        const query = new URLSearchParams({
            status: "pending",
            key: "sent"
        });

        const fetchData = async() => {
            const response = await fetch('http://localhost:3001/friends?' + query, {
                method: 'GET',
                redirect: 'follow',
                credentials: "include"
            })
            const jsonRes = await response.json();

            setSent(jsonRes)
        }
        fetchData();
    }

    useEffect(() => {
        getSent();
    }, []);

    // Accpeted a friend (update)
    function putFriends(event) {
        event.preventDefault();

        const updateFriends = async() => {
            const putRes = await fetch('http://localhost:3001/acceptfriend', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(),
                'credentials': 'include'
            });
            const putResJson = await putRes.json();
            setFriends(putResJson);
        }
        updateFriends();
        getFriends();
    }

    // useEffect(() => {
    //     putFriends();
    // }, []);

    function deleteFriends(event) {
        event.preventDefault();

        const removeFriends = async() => {
            const deleteRes = await fetch('http://localhost:3001/removefriend', {
                method: 'DELETE',
                'credentials': 'include'
            });
            const deleteResJson = await deleteRes.json();
            setFriends(deleteResJson);
            // checking for error response
            if(!deleteRes.ok) {

            }
        }

        removeFriends();
        getFriends();
    }

    // useEffect(() => {
    //     deleteFriends();
    // }, []);

    // Send Friend Request
    function handleFriendRequest(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
        
        // Set body using inputted target_email
        const body = new URLSearchParams({
            friend_email: target_email
        });

        // Use body in fetch 'POST' call to /friends:
        fetch('http://localhost:3001/friends', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body,
            redirect: 'follow',
            'credentials': 'include'
        }).then(response => {
            if(response.ok){
                alert(`Friends request sent to ${target_email}`);
            }
            else{
                //alert(`Could not send friend request: ${target_email}`);
            }
        }).catch(error => {
            alert(`Could not send friend request: ${target_email}`);
        });
    }

    // Map friends list
    let items;
    if(friends !== null){
        items = friends.map((friend) => <FriendItem friend={friend}/>);
        // items = [<FriendItem/>, <FriendItem/>, ...]
    }

    // Map received requests
    let receivedItems;
    if(received !== null){
        receivedItems = received.map((friend) => <ReceivedItem friend={friend}/>);
    }

    // Map sent requests
    let sentItems;
    if(sent !== null){
        sentItems = sent.map((friend) => <SentItem friend={friend}/>);
    }

    return (
        <Container>
            <h1>Friends list</h1>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <form method="POST" onSubmit={handleFriendRequest}>
                    <input 
                        type="text" placeholder="Friend's email"
                        value={target_email}
                        onChange={(e) => setTargetEmail(e.target.value)}
                    />
                    <button type="submit">Send friend request</button>
                </form>
            </div>
            
            <hr/>
            <h2>Friends</h2>
            <ListGroup>
                {items}
            </ListGroup>
            <button> Delete All</button>

            <hr/>
            <h2>Received Requests</h2>
            <ListGroup>
                {receivedItems}
            </ListGroup>
            <button>Accept All</button>

            <hr/>
            <h2>Sent Requests</h2>
            <ListGroup>
                {sentItems}
            </ListGroup>
        </Container>
    );
}

function FriendItem({friend}){
    return(
        <ListGroup.Item>
            {friend.user2_email}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button>
                Remove
                </button>
            </div>
        </ListGroup.Item>
    )
}

function handleAccept(){
    
}

function ReceivedItem({friend}){
    return(
        <ListGroup.Item>
            {friend.user2_email}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleAccept}>
                Delete
                </button>
            </div>
        </ListGroup.Item>
    )
}

function SentItem({friend}){
    return(
        <ListGroup.Item>
            {friend.user2_email}
        </ListGroup.Item>
    )
}

export default Friends;

    // functions we need for the Friends (search bar, list ...)
    // const[friends, setFriends] = useState(exampleList)

    // useEffect(() => {
    //         const fetchData = async() => {
    //         const result = await fetch('http://localhost:3001/friends')
    //         const jsonResult = await result.json(); // convert result to Json form

    //         setFriends(jsonResult)
    //     }
    //     fetchData()
    
    // }, [])
    

//     const submitFriend = async() => {
//         const myData = {
//             id: 2,
//             name: 'Chris',
//             email: 'jcl@scarletmail.rutgers.edu'
//         }
        
//         const result = await fetch('http://localhost:3001/friends', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(myData)
//         })

//         const resultInJson = await result.json()
//         setFriends(prev =>[...prev, resultInJson])

// }

    // look on to react boots trap
