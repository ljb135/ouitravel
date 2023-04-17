import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';

function PostList() {
    const [posts, setPosts] = useState([]);
  
    useEffect(() => {
        fetch('http://localhost:3001/postList', {
            credentials: 'include'
        })
          .then(res => res.json())
          .then(data => {
            setPosts(data);
          })
          .catch(err => {
            console.error(err);
          });
      }, []);

      const handleDelete = async(postId) => {
        const res = await fetch(`http://localhost:3001/delete/${postId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if(res.ok){
            setPosts(posts.filter(post => post._id !== postId));
        }else {
            console.error(`Failed to delete post with ID ${postId}`);
        }
      };
  
      return (
        <div>
          <h1>My Posts</h1>
          <ul>
            {posts.map(post => (
              <li key={post._id}>
                <p>{post.comment}</p>
                {post.image && <img src={`data:image/jpeg;base64,${Buffer.from(post.image).toString('base64')}`} />}
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      );
}

export default PostList;

