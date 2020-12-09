import React from 'react';
import './App.css';
import ImageCarousel from "./ImageCarousel";
import ImageGallery from "./ImageGallery";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      captions: [],
      images: [],
      currentImage: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.url =  "http://localhost:3030/memes"; //"https://api.imgflip.com/get_memes"
    this.get_memes(this.url);
  }

  get_memes(url) {
    fetch(url)
        .then(response => response.json())
        .then(json => {
          let currentImg = json.data.memes[0];
          this.setState({
            'images': json.data.memes,
            'currentImage': currentImg,
            'captions': currentImg.captions ? currentImg.captions : Array(currentImg.box_count).fill('')
          })
        });
  }

  componentDidMount(){
  }

  handleSaveAsTemplate = () => {
    const memeTemplateToSave = {...this.state.currentImage, captions: this.state.captions}
    console.log(memeTemplateToSave)
    fetch(this.url, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(memeTemplateToSave),
      })
    .then(response => response.json())
    .then(json => { 
      if (json.success) {
        this.setState({images: json.data.memes})
        console.log('Success', json)
      }
    })
    .catch((error) => {console.error('Error:', error);})
  }

  handleChange(event) {
    let newCaptions = [...this.state.captions]
    newCaptions[parseInt(event.target.name.slice(7))] = event.target.value
    this.setState({captions: newCaptions})
  }

  onChangeCurrentImage = (newCurImg) => 
    this.setState({
      currentImage: newCurImg, 
      captions: newCurImg.captions ? newCurImg.captions : Array(newCurImg.box_count).fill('')
    })

  render () {
    return (
    <div className="App">
      <ImageGallery currentImage={this.state.currentImage} images={this.state.images} changeCurrentImage={this.onChangeCurrentImage}/>
      <ImageCarousel image={this.state.currentImage} captions={this.state.captions}/>
      <input name="caption0" value={this.state.captions[0]} placeholder='Enter Caption 1' onChange={this.handleChange}></input>
      <input name="caption1" value={this.state.captions[1]} placeholder='Enter Caption 2' onChange={this.handleChange}></input>
      <button name="saveButton" onClick={this.handleSaveAsTemplate.bind(this)}>Save as template</button>
    </div>)
  }
}

export default App;
