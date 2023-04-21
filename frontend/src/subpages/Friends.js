import { Container, ListGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
// import './Friends.css';
// import { exampleList } from './FriendList.js';

// we create output inside the container (HTML)
function Friends(props) {
    const FriendParams = useParams();
    const [friends, setFriends] = useState(null);
    const [user1Email, setUser1Email] = useState("");
    const [user2Email, setUser2Email] = useState("");
    const [stat, setStatus] = useState();

    
    function getFriends() {
        const fetchData = async() => {
            const response = await fetch('http://localhost:3001/friends', {
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

    // Adding a friend into a list
    function postFriends(event) {
        event.preventDefault();


        const submitFriends = async() => {

            const postRes = await fetch('http://localhost:3001/addfriend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user1_email: user1Email,
                    user2_email: user2Email,
                    status: true
                }),
                'credentials': 'include'
            });

            const postResJson = await postRes.json()
            setFriends(postResJson)
        }

        submitFriends();
        getFriends();
    }
    
    // useEffect(() => {
    //     postFriends();
    // }, []);

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

    let items;

    if(friends !== null){
        items = friends.map((friend) => <FriendItem friend={friend}/>);
        // items = [<FriendItem/>, <FriendItem/>, ...]
    }

    return (
        <Container>
            <h1>Friends list</h1>
            <h2>Friends</h2>
            <ListGroup>
                {items}
            </ListGroup>
            <button> Delete All</button>


            <h2>Pending</h2>
            {/* <ListGroup>
                
            </ListGroup> */}
            <button>Accept All</button>
        </Container>
    );
}

function FriendItem({friend}){
    return(
        <ListGroup.Item>
            {friend.user2_email}
        </ListGroup.Item>
    )
}

// function PendingItem({friend})

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
