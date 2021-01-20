import React from 'react';
import './App.css';
import ImageCarousel from "./components/editor/ImageCarousel";
import TemplateGallery from "./components/editor/TemplateGallery";
import EditorControl from "./components/editor/EditorControl";

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      templates: [],
      currentImage: {},
      isInAddImageMode: false,
      // Following properties belong to current image
      captions: [],
      addedImages: [],
      title: '',
      captionPositions_X: [],
      captionPositions_Y: [],
      fontSize: 45,
      isItalic: false,
      isBold: false,
      fontColor: 'black'
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    // initial get request
    this.urlTemplates = "http://localhost:3030/memes/templates";
    this.get_memeTemplates(this.urlTemplates);
  }


  get_memeTemplates(url) {
    fetch(url)
        .then(response => response.json())
        .then(json => {
          console.log(json.data);
          this.setState({
            'templates': json.data.templates
          });
          this.onChangeCurrentImage(json.data.templates[0]);
        });
  }

  handleSaveAsTemplate = () => {

    const memeTemplateToSave = {
      ...this.state.currentImage,
      captions: this.state.captions,
      captionPositions: this.state.captionPositions_X
          .map((x, i) => [x, this.state.captionPositions_Y[i]]),
      fontSize: this.state.fontSize,
      isItalic: this.state.isItalic,
      isBold: this.state.isBold,
      fontColor: this.state.fontColor
    }
    console.log(memeTemplateToSave)
    fetch(this.urlTemplates, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(memeTemplateToSave),
      })
    .then(response => response.json())
    .then(json => {
      if (json.success) {
        console.log('Successfully saved template')
      }
    })
    .catch((error) => {console.error('Error:', error);})
  }

  handleChange = (event, index) => {

    if (event.target.type == 'checkbox') {
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

  onClickedOnImageInGallery = (newCurrentImage) => {
    if (!this.state.isInAddImageMode){
      this.onChangeCurrentImage(newCurrentImage)
    } else {
      const appendedImgArray = [...this.state.addedImages, newCurrentImage] 
      this.setState({ addedImages: appendedImgArray, isInAddImageMode: false })
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

  onSwitchToAddImageMode = () => {
    this.setState({ isInAddImageMode: !this.state.isInAddImageMode })
  }

  render () {
    return (
    <div className="App">
      <div className="left">
        <TemplateGallery 
            currentImage={this.state.currentImage}
            images={this.state.templates}
            changeCurrentImage={this.onClickedOnImageInGallery}
            isInAddImageMode={this.state.isInAddImageMode}
        />
      </div>
      <div className="middle">
        <ImageCarousel
            image={this.state.currentImage}
            captions={this.state.captions}
            addedImages={this.state.addedImages}
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
            isInAddImageMode={this.state.isInAddImageMode}
            switchToAddImageMode={this.onSwitchToAddImageMode.bind(this)}
            addedImages={this.state.addedImages}
            title={this.state.title}
            fontSize={this.state.fontSize}
            isItalic={this.state.isItalic}
            isBold={this.state.isBold}
            fontColor={this.state.fontColor}
        />
        <button name="saveButton" onClick={this.handleSaveAsTemplate.bind(this)}>Save as template</button>
      </div>
      
      </div>)
  }
}

export default App;
