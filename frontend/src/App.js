import React from 'react';
import './App.css';
import ImageCarousel from "./ImageCarousel";
import ImageGallery from "./ImageGallery";

class App extends React.Component {

  constructor() {
    super();
    this.urlImages = "http://localhost:3030/memes/images";
    this.urlMemeTemplates = "http://localhost:3030/memes/memeTemplate";
    this.urlMemes = "http://localhost:3030/memes/memes";
    this.state = {
      captionTop: '',
      captionBottom: '',
      images: [],
      currentImage: {},
      selectedUrl: ''
    };
    this.handleChange = this.handleChange.bind(this);

    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    // initial get request
    this.url =  this.urlImages;
    this.get_memes(this.url);
  }

  handleDropdownChange(event) {
    console.log("event value", event.target.value);
    this.setState({selectedUrl: event.target.value}, () => {
      console.log(this.state.selectedUrl);
      this.get_memes(this.state.selectedUrl);
    });
  }

  get_memes(url) {
    fetch(url)
        .then(response => response.json())
        .then(json =>
          this.setState({
            'images': json.data.images,
            'currentImage': json.data.images[0],
          })
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
      return (
          <div className="App">
            <select value={this.state.selectedUrl} onChange={this.handleDropdownChange}>
              <option value={this.urlImages}>Images</option>
              <option value={this.urlMemeTemplates}>Templates</option>
              <option value={this.urlMemes}>Memes</option>
            </select>
            <h1>Currently No images Saved</h1>
          </div>
      )
    } else {
      return (
          <div className="App">
            <select value={this.state.selectedUrl} onChange={this.handleDropdownChange}>
              <option value={this.urlImages}>Images</option>
              <option value={this.urlMemeTemplates}>Templates</option>
              <option value={this.urlMemes}>Memes</option>
            </select>
            <div className="left">
              <ImageGallery currentImage={this.state.currentImage} images={this.state.images}
                            changeCurrentImage={this.onChangeCurrentImage}/>
            </div>
            <div className="middle">
              <ImageCarousel image={this.state.currentImage} captionTop={this.state.captionTop}
                             captionBottom={this.state.captionBottom}/>
            </div>
            <div className="control right">
              <input name="captionTop" value={this.state.captionTop} placeholder='Enter Caption 1'
                     onChange={this.handleChange}/>
              <input name="captionBottom" value={this.state.captionBottom} placeholder='Enter Caption 2'
                     onChange={this.handleChange}/>
            </div>
            <button name="saveButton" onClick={this.handleSaveAsTemplate.bind(this)}>Save as template</button>
          </div>)
    }
  }
}

export default App;
