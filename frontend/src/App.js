import React from 'react';
import './App.css';
import ImageCarousel from "./components/ImageCarousel";
import TemplateGallery from "./components/TemplateGallery";
import EditorControl from "./components/EditorControl";

const TEMPLATE_ENDPOINT = "http://localhost:3030/memes/templates";
const MEMES_ENDPOINT = "http://localhost:3030/memes/memes";

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      currentImage: {},
      // Following properties belong to current image
      captions: [],
      title: '',
      captionPositions_X: [],
      captionPositions_Y: [],
      fontSize: 45,
      isItalic: false,
      isBold: false,
      fontColor: 'black'
    };
    this.handleChange = this.handleChange.bind(this);
    this.imageCarousel = React.createRef();
  }

  handleSaveAsTemplate = () => {

    const memeTemplateToSave = {
      ...this.state.currentImage,
      name: this.state.title,
      box_count: this.state.captions.length,
      captions: this.state.captions,
      captionPositions: this.state.captionPositions_X
          .map((x, i) => [x, this.state.captionPositions_Y[i]]),
      fontSize: this.state.fontSize,
      isItalic: this.state.isItalic,
      isBold: this.state.isBold,
      fontColor: this.state.fontColor
    }
    console.log(memeTemplateToSave)
    fetch(TEMPLATE_ENDPOINT, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(memeTemplateToSave),
    }).then(response => {
            if(response.ok) {
                return true;
            }else{
                return Promise.reject(
                    "API Responded with an error: "+response.status+" "+response.statusText
                )
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            return false;
        })
  }

  handleSaveAsMeme = async () => {
    const carouselCanvas = this.imageCarousel.current.canvasRef.current;
    const dataURL =carouselCanvas.toDataURL();

    const memeToSave = {
      template_id : this.state.currentImage._id,
      img: dataURL,
      template_url: this.state.currentImage.url,
      name: this.state.title,
      box_count: this.state.captions.length,
      captions: this.state.captions,
      captionPositions: this.state.captionPositions_X
          .map((x, i) => [x, this.state.captionPositions_Y[i]]),
      fontSize: this.state.fontSize,
      isItalic: this.state.isItalic,
      isBold: this.state.isBold,
      fontColor: this.state.fontColor
    }

    console.log("meme to save ", memeToSave)

    fetch(MEMES_ENDPOINT, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(memeToSave),
    }).then(response => {
      if(response.ok) {
        return true;
      }else{
        return Promise.reject(
            "API Responded with an error: "+response.status+" "+response.statusText
        )
      }
    })
        .catch((error) => {
          console.error('Error:', error);
          return false;
        })
  }

  handleChange = (event, index) => {

    if (event.target.type === 'checkbox') {
      this.setState({[event.target.name]: event.target.checked})
    } else if (index !== undefined) {
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
      title: (newCurrentImage.hasOwnProperty("name") ? newCurrentImage.name : ''),
      fontSize: (newCurrentImage.hasOwnProperty("fontSize") ? newCurrentImage.fontSize : 45),
      isItalic: (newCurrentImage.hasOwnProperty("isItalic") ? newCurrentImage.isItalic : false),
      isBold: (newCurrentImage.hasOwnProperty("isBold") ? newCurrentImage.isBold : false),
      fontColor: (newCurrentImage.hasOwnProperty("fontColor") ? newCurrentImage.fontColor : 'black')
    });
  }

  render () {
    return (
    <div className="App">
      <div className="left">
        <TemplateGallery
            currentImage={this.state.currentImage}
            changeCurrentImage={this.onChangeCurrentImage}
            templateEndpoint={TEMPLATE_ENDPOINT}
        />
      </div>
      <div className="middle">
        <ImageCarousel
            id="text"
            ref = {this.imageCarousel}
            image={this.state.currentImage}
            captions={this.state.captions}
            title={this.state.title}
            fontSize={this.state.fontSize}
            isItalic={this.state.isItalic}
            isBold={this.state.isBold}
            fontColor={this.state.fontColor}
            captionPositions_X={this.state.captionPositions_X}
            captionPositions_Y={this.state.captionPositions_Y}
        />
      </div>
      <div className="control right">
        <h3 style={{fontWeight: 'bold'}}>Create Your Meme</h3>
        <EditorControl
            captions={this.state.captions}
            captionPositions_X={this.state.captionPositions_X}
            captionPositions_Y={this.state.captionPositions_Y}
            changeListener={this.handleChange}
            title={this.state.title}
            fontSize={this.state.fontSize}
            isItalic={this.state.isItalic}
            isBold={this.state.isBold}
            fontColor={this.state.fontColor}
        />
        <button name="saveTemplateButton" onClick={this.handleSaveAsTemplate.bind(this)}>Save as template</button>
        <button name="saveButton" onClick={this.handleSaveAsMeme.bind(this)}>Save image</button>
      </div>
      
      </div>)
  }
}

export default App;
