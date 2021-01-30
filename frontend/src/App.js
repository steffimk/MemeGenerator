import React from 'react';
import './App.css';
import ImageCarousel from "./components/ImageCarousel";
import TemplateGallery from "./components/TemplateGallery";
import EditorControl from "./components/EditorControl";
import Speech from 'speak-tts'

const TEMPLATE_ENDPOINT = "http://localhost:3030/memes/templates";

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
    this.speech = new Speech()
    this.speech
      .init({'lang': 'en-GB', 'voice':'Google UK English Male'})
      .then((data) => {
        console.log('Speech is ready, voices are available', data);
      })
      .catch((e) => {
        console.error('An error occured while initializing : ', e);
      });
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

  handleAddCaption = () => {
    const newBoxCount = this.state.currentImage.box_count + 1
    const newCurrentImage = {...this.state.currentImage, box_count: newBoxCount}
    const newCaptions = [...this.state.captions,''] // append captions by empty string
    const newCaptionPositions_X = [...this.state.captionPositions_X,50] // place new caption in center
    const newCaptionPositions_Y = [...this.state.captionPositions_Y, 10 + (90 * (newBoxCount-1) / newBoxCount)] 
    this.setState({
      currentImage: newCurrentImage,
      captions: newCaptions,
      captionPositions_X: newCaptionPositions_X,
      captionPositions_Y: newCaptionPositions_Y
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

  /**
   * Reads the value of the event target
   * @param {React.MouseEvent} event 
   */
  readOut = (event) => {
    console.log(event);
    const text = event.target.innerText; // TODO
    this.speech
      .speak({text: text,})
      .then(() => {
        console.log('Speech was successful!');
      })
      .catch((e) => {
        console.error('A speech error occurred: ', e);
      });
  }

  readScreen = () => {
    var text = `The meme editor is opened. You are currently editing a template with the title ${this.state.currentImage.name}. `
    this.state.captions.forEach((caption,index) => {
        if(caption.length > 0 && caption !== '') text += `Caption ${index+1} says ${caption}. `
      })
    this.speech
      .speak({text: text})
      .then(() => {
        console.log('Speech was successful!');
      })
      .catch((e) => {
        console.error('A speech error occurred: ', e);
      });
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
        <h3 style={{fontWeight: 'bold'}} onClick={this.readOut}>Editor&nbsp;<i class="fas fa-audio-description" onClick={this.readScreen}/></h3>
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
        <button name="addCaption" onClick={this.handleAddCaption} style={{ display: 'block' }}>Add caption</button>
        <button name="saveButton" onClick={this.handleSaveAsTemplate}>Save as template</button>
      </div>
      
      </div>)
  }
}

export default App;
