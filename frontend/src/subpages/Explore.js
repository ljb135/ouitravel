import React from 'react';
import { Card, CardImg, CardText, CardBody } from 'reactstrap';

class ExplorePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [
        {
          id: 1,
          photoUrl: 'https://example.com/photo1.jpg',
          caption: 'This is the caption for the first post'
        },
        {
          id: 2,
          photoUrl: 'https://example.com/photo2.jpg',
          caption: 'This is the caption for the second post'
        },
        {
          id: 3,
          photoUrl: 'https://example.com/photo3.jpg',
          caption: 'This is the caption for the third post'
        }
      ]
    };
  }

  render() {
    return (
      <div className="explore-page">
        {this.state.posts.map(post => (
          <Card key={post.id}>
            <CardImg top src={post.photoUrl} alt="Post" />
            <CardBody>
              <CardText>{post.caption}</CardText>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }
}

export default ExplorePage;
