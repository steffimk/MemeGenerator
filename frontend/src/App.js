import React from 'react';
import './App.css';
import ImageCarousel from "./components/ImageCarousel";
import ImageGallery from "./components/ImageGallery";
import EditorControl from "./components/EditorControl";

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
    this.url =  "http://localhost:3030/memes"; //"https://api.imgflip.com/get_memes"
    this.get_memes(this.url);
  }

  get_memes(url) {
    fetch(url)
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

  handleSaveAsTemplate = () => {
    const memeTemplateToSave = {...this.state.currentImage, captions: [this.state.captionTop, this.state.captionBottom], id: this.state.currentImage.id + "mt"}
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

  handleChange = (event, index) => {
    console.log(event)
    if (index == 0) {
      this.setState({captionTop: event.target.value});
    } else if (index == 1){
      this.setState({captionBottom: event.target.value});
    } else {
      this.setState({[event.target.name]: event.target.value});
    }
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
        <ImageCarousel image={this.state.currentImage} captionTop={this.state.captionTop} captionBottom={this.state.captionBottom}/>
      </div>
      <div className="control right">
        <EditorControl captions={[this.state.captionTop, this.state.captionBottom]} changeListener={this.handleChange}/>
        <button name="saveButton" onClick={this.handleSaveAsTemplate.bind(this)}>Save as template</button>
      </div>
      
      </div>)
  }
}

export default App;
