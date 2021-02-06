import React from 'react';
import './App.css';
import ImageCarousel from "./components/editor/ImageCarousel";
import TemplateGallery from "./components/editor/TemplateGallery";
import EditorControl from "./components/editor/EditorControl";

const TEMPLATE_ENDPOINT = "http://localhost:3030/memes/templates";
const MEMES_ENDPOINT = "http://localhost:3030/memes/memes";

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      currentImage: {},
      isInAddImageMode: false,
      // Following properties belong to current image
      imageInfo: {size: null, x: 0, y: 0},
      captions: [],
      title: '',
      captionPositions_X: [],
      captionPositions_Y: [],
      fontSize: 45,
      isItalic: false,
      isBold: false,
      fontColor: 'black',
      addedImages: [],
      addedImgPositions_X: [],
      addedImgPositions_Y: [],
      addedImgSizes: [],
      canvasSize: {width: "97%", height: "90%"},
      drawingCoordinates: []
    };
    this.imageCarousel = React.createRef();
  }

  /**
   * Saves a template to the database
   */
  handleSaveAsTemplate = () => {

    const memeTemplateToSave = {
      ...this.state.currentImage,
      imageInfo: this.state.imageInfo,
      name: this.state.title,
      box_count: this.state.captions.length,
      captions: this.state.captions,
      captionPositions: this.state.captionPositions_X
          .map((x, i) => [x, this.state.captionPositions_Y[i]]),
      fontSize: this.state.fontSize,
      isItalic: this.state.isItalic,
      isBold: this.state.isBold,
      fontColor: this.state.fontColor,
      addedImages: this.state.addedImages,
      // addedIMGinfo contains an infoArray for each added image [size, posX, posY]
      addedImgInfo: this.state.addedImgSizes
         .map((size, i) => [size, this.state.addedImgPositions_X[i], this.state.addedImgPositions_Y[i]]),
      canvasSize: this.state.canvasSize,
      drawingCoordinates: this.state.drawingCoordinates
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
    const dataURL = carouselCanvas.toDataURL();

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

  /**
   * Handles the most user inputs
   * @param {object} event 
   * @param {number} index 
   */
  handleChange = (event, index) => {

    if(event.target.name.includes("imageInfo")) {
      this.updateImageInfo(event)
    } else if (event.target.type === 'checkbox') {
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
   * Call when image in template gallery is clicked on
   * Lets the user edit the selected image in the editor
   * OR adds the image to the current template if in "AddImage"-mode
   * @param {object} image clicked on in the gallery on the left
   */
  onClickedOnImageInGallery = (newCurrentImage) => {
    if (!this.state.isInAddImageMode){
      this.onChangeCurrentImage(newCurrentImage)
    } else {
      this.setState({ 
        addedImages: [...this.state.addedImages, newCurrentImage],
        addedImgSizes: [...this.state.addedImgSizes, 50],
        addedImgPositions_X: [...this.state.addedImgPositions_X, 0],
        addedImgPositions_Y: [...this.state.addedImgPositions_Y, 0],
        isInAddImageMode: false })
    }
  }

  /**
   * Call when a new meme template is being edited
   * @param {object} image that is now the main template in the editor
   */
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

    function getAddedImages(newCurrentImage) {
      if (newCurrentImage.hasOwnProperty("addedImages")) {
        return newCurrentImage.addedImages;
      } else return [];
    }

    function getAddedImgInfo(newCurrentImage) {
      if (newCurrentImage.hasOwnProperty("addedImgInfo")) {
        return newCurrentImage.addedImgInfo;
      } else return [];
    }

    const imageInfo =  (newCurrentImage.hasOwnProperty("imageInfo") ? newCurrentImage.imageInfo : {size: null, x:0, y:0})
    const captionPositions = getCaptionPositions(newCurrentImage);
    const addedImgInfo = getAddedImgInfo(newCurrentImage)
    const canvasSize = (newCurrentImage.hasOwnProperty("canvasSize") ? newCurrentImage.canvasSize : {width: "97%", height: "90%"})
    const drawingCoordinates = newCurrentImage.hasOwnProperty("drawingCoordinates") ? newCurrentImage.drawingCoordinates : []

    this.setState({
      currentImage: newCurrentImage,
      imageInfo: imageInfo,
      captionPositions_X: captionPositions.map(x => x[0]),
      captionPositions_Y: captionPositions.map(y => y[1]),
      captions: getCaptions(newCurrentImage),
      title: (newCurrentImage.hasOwnProperty("name") ? newCurrentImage.name : ''),
      fontSize: (newCurrentImage.hasOwnProperty("fontSize") ? newCurrentImage.fontSize : 45),
      isItalic: (newCurrentImage.hasOwnProperty("isItalic") ? newCurrentImage.isItalic : false),
      isBold: (newCurrentImage.hasOwnProperty("isBold") ? newCurrentImage.isBold : false),
      fontColor: (newCurrentImage.hasOwnProperty("fontColor") ? newCurrentImage.fontColor : 'black'),
      addedImages: getAddedImages(newCurrentImage),
      addedImgSizes: addedImgInfo.map(size => size[0]),
      addedImgPositions_X: addedImgInfo.map(x => x[1]),
      addedImgPositions_Y: addedImgInfo.map(y => y[2]),
      canvasSize: canvasSize,
      drawingCoordinates: drawingCoordinates
    });
  }

  /**
   * Switched in or out of the "AddImage"-mode
   */
  onSwitchToAddImageMode = () => {
    this.setState({ isInAddImageMode: !this.state.isInAddImageMode })
  }

  /**
   * Resizes the canvas
   * @param {object} Object containing the properties width and height
   */
  setCanvasSize = (newSize) => {
    try {
      this.setState({ canvasSize: {width: parseFloat(newSize.width), height: parseFloat(newSize.height)} })
    } catch(e) {
      console.log("Problem parsing: " + e)
    }
  }

  /**
   * Updates the imageInfo (size, xPos, yPos) of the current image
   * @param {*} The event leading to the change
   */
  updateImageInfo = (event) => {
    let newImageInfo = this.state.imageInfo
    switch(event.target.name) {
      case "imageInfoSize": newImageInfo.size = event.target.value; break;
      case "imageInfoX": newImageInfo.x = event.target.value; break;
      case "imageInfoY": newImageInfo.y = event.target.value; break;
      default: break;
    }
    this.setState({ imageInfo: newImageInfo })
  }

  addDrawingCoordinate = (newCoordinate) => {
    this.setState({ drawingCoordinates: [...this.state.drawingCoordinates, newCoordinate] })
  }

  render () {
    return (
    <div className="App">
      <div className="left">
        <TemplateGallery
            currentImage={this.state.currentImage}
            changeCurrentImage={this.onClickedOnImageInGallery}
            templateEndpoint={TEMPLATE_ENDPOINT}
            isInAddImageMode={this.state.isInAddImageMode}
        />
      </div>
      <div className="middle">
        <ImageCarousel
            ref = {this.imageCarousel}
            image={this.state.currentImage}
            imageInfo={this.state.imageInfo}
            captions={this.state.captions}
            title={this.state.title}
            fontSize={this.state.fontSize}
            isItalic={this.state.isItalic}
            isBold={this.state.isBold}
            fontColor={this.state.fontColor}
            captionPositions_X={this.state.captionPositions_X}
            captionPositions_Y={this.state.captionPositions_Y}
            addedImages={this.state.addedImages}
            addedImgSizes={this.state.addedImgSizes}
            addedImgPositions_X={this.state.addedImgPositions_X}
            addedImgPositions_Y={this.state.addedImgPositions_Y}
            canvasSize={this.state.canvasSize}
            setCanvasSize={this.setCanvasSize.bind(this)}
            coordinates={this.state.drawingCoordinates}
            addCoordinate={this.addDrawingCoordinate}
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
            isInAddImageMode={this.state.isInAddImageMode}
            switchToAddImageMode={this.onSwitchToAddImageMode.bind(this)}
            addedImages={this.state.addedImages}
            addedImgSizes={this.state.addedImgSizes}
            addedImgPositions_X={this.state.addedImgPositions_X}
            addedImgPositions_Y={this.state.addedImgPositions_Y}
            canvasSize={this.state.canvasSize}
            setCanvasSize={this.setCanvasSize.bind(this)}
            imageInfo={this.state.imageInfo}
        />
        <button name="saveTemplateButton" onClick={this.handleSaveAsTemplate}>Save as template</button>
        <button name="saveButton" onClick={this.handleSaveAsMeme}>Save image</button>
        <button name="addCaption" onClick={this.handleAddCaption} style={{ display: 'block' }}>Add caption</button>
      </div>
      
      </div>)
  }
}

export default App;
