class ImageDisplay extends React.Component {
    constructor(props) {
      super(props);
      this.state = { imageSrc: null };
    }
  
    componentDidMount() {
      const id = this.props.id;
      fetch(`/postList/${id}`)
        .then(res => res.json())
        .then(data => {
          const binaryData = atob(data.data);
          const blob = new Blob([new Uint8Array(binaryData.length).fill().map((_, i) => binaryData.charCodeAt(i))]);
          const imageSrc = URL.createObjectURL(blob);
          this.setState({ imageSrc });
        });
    }
  
    render() {
      return (
        <img src={this.state.imageSrc} alt="Image" />
      );
    }
  }
  
  // Render the component with the image ID as a prop
  ReactDOM.render(<ImageDisplay id="123" />, document.getElementById('root'));