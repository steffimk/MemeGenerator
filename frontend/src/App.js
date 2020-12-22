import React from 'react';
import './App.css';
import ImageCarousel from "./ImageCarousel";
import ImageGallery from "./ImageGallery";

class App extends React.Component {

  constructor() {
    super();
    this.urlTemplates = "http://localhost:3030/memes/templates";
    this.urlMemes = "http://localhost:3030/memes/memes";
    this.state = {
      captionTop: '',
      captionBottom: '',
      images: [],
      currentImage: {},
    };
    this.handleChange = this.handleChange.bind(this);

    // initial get request
    this.get_memes(this.urlTemplates);
  }

  
  get_memes(url) {
    fetch(url)
        .then(response => response.json())
        .then(json => {
          console.log(json.data);
          this.setState({
            'images': json.data.images,
            'currentImage': json.data.images[0],
          })
        }
          );
  }

  componentDidMount(){
  }

  handleSaveAsTemplate = () => {
    const memeTemplateToSave = {...this.state.currentImage, captions: [this.state.captionTop, this.state.captionBottom], id: this.state.currentImage.id + "mt"}
    fetch(this.urlMemeTemplates, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(memeTemplateToSave),
      })
    .then(response => response.json())
    .then(json => {
      if (json.success) {
        this.setState({images: json.data.images})
        console.log('Success', json)
      }
    })
    .catch((error) => {console.error('Error:', error);})
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  onChangeCurrentImage = (newCurrentImage) =>
   this.setState({currentImage: newCurrentImage})

  render () {
    if(this.state.images.length === 0 || !this.state.currentImage) {
      return (<div className="App">
      <div className="left">
        <ImageGallery currentImage={this.state.currentImage} images={this.state.images} changeCurrentImage={this.onChangeCurrentImage}/>
      </div>
      <div className="middle">
        <ImageCarousel image={this.state.currentImage} captions={this.state.captions}/>
      </div>
      <div className="control right">
        <input name="captionTop" value={this.state.captionTop} placeholder='Enter Caption 1' onChange={this.handleChange}/>
        <input name="captionBottom" value={this.state.captionBottom} placeholder='Enter Caption 2' onChange={this.handleChange}/>
      </div>
      <button name="saveButton" onClick={this.handleSaveAsTemplate.bind(this)}>Save as template</button>
      </div>)
    }
  }
}

export default App;
