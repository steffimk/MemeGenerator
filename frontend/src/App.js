import React from 'react';
import './App.css';
import ImageCarousel from "./components/ImageCarousel";
import ImageGallery from "./components/ImageGallery";
import EditorControl from "./components/EditorControl";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      captions: [],
      captionPositions_X: [],
      captionPositions_Y: [],
      images: [],
      currentImage: {},
    };
    this.handleChange = this.handleChange.bind(this);
  }

  get_memes(url) {
    fetch(url)
        .then(response => response.json())
        .then(json => {
          this.setState({
            'images': json.data.memes
          });
          this.onChangeCurrentImage(json.data.memes[0]);
        });
  }

  componentDidMount(){
    this.url =  "http://localhost:3030/memes"; //"https://api.imgflip.com/get_memes"
    this.get_memes(this.url);
  }

  handleSaveAsTemplate = () => {
    const memeTemplateToSave = {
      ...this.state.currentImage,
      captions: this.state.captions,
      captionPositions: this.state.captionPositions_X
          .map((x, i) => [x, this.state.captionPositions_Y[i]]),
      id: this.state.currentImage.id + "mt"
    }
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

    if (index !== undefined) {
      this.setState((state) =>  {
        // make a shallow copy of the array to avoid writing directly to state
        let list_state = [...state[event.target.name]];
        list_state[index] = event.target.value;
        return {[event.target.name]: list_state};
      });
    } else {
      this.setState({[event.target.name]: event.target.value});
    }
  }

  onChangeCurrentImage = (newCurrentImage) => {
    function getCaptionPositions(newCurrentImage) {

      if (newCurrentImage.hasOwnProperty("captionPositions")) {
        return newCurrentImage.captionPositions;
      } else {
        let captionPositions = [];
        for (let i = 0; i < newCurrentImage.box_count; i++) {
          captionPositions.push([50, 10 + (90 * i / newCurrentImage.box_count)]);
        }
        return captionPositions;
      }
    }

    function getCaptions(newCurrentImage) {

      if (newCurrentImage.hasOwnProperty("captions")) {
        return newCurrentImage.captions;
      } else {
        let captions = [];
        for (let i = 0; i < newCurrentImage.box_count; i++) {
          captions.push('');
        }
        return captions;
      }
    }

    let captionPositions = getCaptionPositions(newCurrentImage);

    this.setState({
      currentImage: newCurrentImage,
      captionPositions_X: captionPositions.map(x => x[0]),
      captionPositions_Y: captionPositions.map(y => y[1]),
      captions: getCaptions(newCurrentImage),
    });
  }

  render () {
    return (
    <div className="App">
      <div className="left">
        <ImageGallery currentImage={this.state.currentImage} images={this.state.images} changeCurrentImage={this.onChangeCurrentImage}/>
      </div>
      <div className="middle">
        <ImageCarousel
            image={this.state.currentImage}
            captions={this.state.captions}
            captionPositions_X={this.state.captionPositions_X}
            captionPositions_Y={this.state.captionPositions_Y}
        />
      </div>
      <div className="control right">
        <h3 style={{fontWeight: 'bold'}}>Add Captions To Your Meme</h3>
        <EditorControl
            captions={this.state.captions}
            captionPositions_X={this.state.captionPositions_X}
            captionPositions_Y={this.state.captionPositions_Y}
            changeListener={this.handleChange}
        />
        <button name="saveButton" onClick={this.handleSaveAsTemplate.bind(this)}>Save as template</button>
      </div>
      
      </div>)
  }
}

export default App;
