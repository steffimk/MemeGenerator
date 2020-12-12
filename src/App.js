import React from 'react';
import './App.css';
import ImageCarousel from "./ImageCarousel";
import ImageGallery from "./ImageGallery";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      captionTop: '',
      captionBottom: '',
      images: [],
      currentImage: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.get_memes();
  }


  get_memes() {
    fetch("https://api.imgflip.com/get_memes")
        .then(response => response.json())
        .then(json =>
          this.setState({
            'images': json.data.memes,
            'currentImage': json.data.memes[0],
          })
          );
  }

  componentDidMount(){
  }


  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  onChangeCurrentImage = (newCurrentImage) =>
   this.setState({currentImage: newCurrentImage})

  render () {
    return (
    <div className="App">
      <div className="left">
        <ImageGallery currentImage={this.state.currentImage} images={this.state.images} changeCurrentImage={this.onChangeCurrentImage}/>
      </div>
      <div className="middle">
        <ImageCarousel image={this.state.currentImage} captions={[this.state.captionTop, this.state.captionBottom]}/>
      </div>
      <div className="control right">
        <input name="captionTop" value={this.state.captionTop} placeholder='Enter First Caption' onChange={this.handleChange}/>
        <input name="captionBottom" value={this.state.captionBottom} placeholder='Enter Second Caption' onChange={this.handleChange}/>
      </div>
      </div>)
  }
}

export default App;
