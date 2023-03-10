import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import './Editor.css';
import CustomAppBar from "../customAppBar/CustomAppBar";
import ImageCarousel from "./ImageCarousel";
import TemplateGallery from "./TemplateGallery";
import EditorControl from "./EditorControl";
import {
  authorizedFetch,
  API_ENDPOINT,
  TEMPLATE_ENDPOINT,
  MEMES_ENDPOINT,
  CREATE_ENDPOINT,
  MEME_FROM_TEMPLATE_ENDPOINT,
  MEME_FROM_TEMPLATE_ID_ENDPOINT
} from '../../communication/requests';
import AudioDescription from "../textToSpeech/AudioDescription"
import { Button, Paper } from '@material-ui/core';
import NewMeme from '../newMemeDialog/NewMeme';
import Gif from './Gif';
import { LS_USERNAME } from '../../constants';
import StatisticChart from "./StatisticChart";

/**
 * The Editor component contains a gallery containing all templates, the canvas with the template the user is
 * currently editing and an Editor Control with which the meme is created.
 */
class Editor extends React.Component {

  constructor() {
    super();
    this.state = {
      isAuthenticated: true,
      newMemeDialogIsOpen: false,
      canvasImage: undefined,

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
      drawingCoordinates: [],
      imageDescription: "",
      isGif: false,

      //Data to render Charts for template
      generateData: [],
      likeData: [],
      viewData: []
    }
    this.imageCarousel = React.createRef();
  }

  isNotAuthenticated = () => {
    this.setState({ isAuthenticated: false})
  }

  /**
   * Saves a template to the database
   */
  handleSaveAsTemplate = () => {

    const memeTemplateToSave = {
      ...this.state.currentImage,
      username: localStorage.getItem(LS_USERNAME),
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
      drawingCoordinates: this.state.drawingCoordinates,
      imageDescription: this.state.imageDescription
    }
    console.log(memeTemplateToSave)
    authorizedFetch(TEMPLATE_ENDPOINT, 'POST', JSON.stringify(memeTemplateToSave), this.isNotAuthenticated)
      .catch((error) => {
        console.error('Error:', error);
        return false;
      });
  }

  newDictatedCaption = (result, count) => {
     console.log("new dictated caption " + count + ": " + result);
     var newCaptions = this.state.captions;
     newCaptions[count] = result;
     this.setState({ captions: newCaptions });
  }

  generateMeme = () => {
    if(this.state.isGif){
      this.setState({ canvasImage: this.state.currentImage.url, newMemeDialogIsOpen: true })
    }else {
      const carouselCanvas = this.imageCarousel.current.canvasRef.current;
      const dataURL = carouselCanvas.toDataURL()
      this.setState({ canvasImage: dataURL, newMemeDialogIsOpen: true });
    }
  }

  /**
   * Send information for Meme to backend to create it
   * Set result as canvas image (ready to save)
   * @returns {Promise<void>}
   */
  generateMemeBackend = async () => {
    const memeToGenerate = {
      currentImage: this.state.currentImage,
      imageInfo: this.state.imageInfo,
      captions: this.state.captions,
      captionPositions_X: this.state.captionPositions_X,
      captionPositions_Y: this.state.captionPositions_Y,
      fontSize: this.state.fontSize,
      isItalic: this.state.isItalic,
      isBold: this.state.isBold,
      fontColor:  this.state.fontColor,
      addedImages: this.state.addedImages,
      addedImgPositions_X: this.state.addedImgPositions_X,
      addedImgPositions_Y: this.state.addedImgPositions_Y,
      addedImgSizes: this.state.addedImgSizes,
      canvasSize: this.state.canvasSize,
      drawingCoordinates: this.state.drawingCoordinates,
    }

    let promise = authorizedFetch(CREATE_ENDPOINT, 'POST', JSON.stringify(memeToGenerate), this.isNotAuthenticated)
        .catch((error) => {
          console.error('Error:', error);
          return false;
        });

    promise.then((res) => {
      this.setState({ canvasImage: res.dataUrl, newMemeDialogIsOpen: true });
    });
  }

  /**
   * Save meme to DB
   * @param privacyLabel privacy label can be public (shown in gallery),
   * unlisted (not shown in gallery but can be searched), private (not shown in gallery, can't be searched)
   * Also get new data for template chart
   * @returns {Promise<void>}
   */
  handleSaveAsMeme = async (privacyLabel) => {
    const memeToSave = {
      username: localStorage.getItem(LS_USERNAME),
      template_id: this.state.currentImage._id,
      img: this.state.canvasImage,
      template_url: this.state.currentImage.url,
      name: this.state.title,
      imageDescription: this.state.imageDescription,
      box_count: this.state.captions.length,
      captions: this.state.captions,
      captionPositions: this.state.captionPositions_X
          .map((x, i) => [x, this.state.captionPositions_Y[i]]),
      fontSize: this.state.fontSize,
      isItalic: this.state.isItalic,
      isBold: this.state.isBold,
      fontColor: this.state.fontColor,
      privacyLabel: privacyLabel
    }

    console.log("meme to save ", memeToSave)

    //Save meme to DB
    authorizedFetch(MEMES_ENDPOINT, 'POST', JSON.stringify(memeToSave), this.isNotAuthenticated)
        .catch((error) => {
          console.error('Error:', error);
          return false;
        });

    //Get new data for template chart
    if (this.state.currentImage._id) {
      const endpointWithParam = `${MEME_FROM_TEMPLATE_ID_ENDPOINT}/${this.state.currentImage._id}`;

      console.log("endpointWithParam ", endpointWithParam)

      authorizedFetch(endpointWithParam, 'GET', {}, this.isNotAuthenticated)
          .then((json) => {
            this.setNewDataOfMemeForTemplate(json.memes)
          })
          .catch((error) => {
            console.error('Error:', error);
            return false;
          });
    } else {

      const endpointWithParam = `${MEME_FROM_TEMPLATE_ENDPOINT}/${encodeURIComponent(this.state.currentImage.url)}`;

      console.log("endpointWithParam ", endpointWithParam)

      authorizedFetch(endpointWithParam, 'GET', {}, this.isNotAuthenticated)
          .then((json) => {
            this.setNewDataOfMemeForTemplate(json.memes)
          })
          .catch((error) => {
            console.error('Error:', error);
            return false;
          });
    }

  }

  /**
   * Adds an empty caption
   */
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
   * @param {React.ChangeEvent} event 
   * @param {number} index 
   */
  handleChange = (event, index) => {
    console.log("event",event);

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


  /*
   * Call when image in template gallery is clicked on
   * Lets the user edit the selected image in the editor
   * OR adds the image to the current template if in "AddImage"-mode
   * @param {object} image clicked on in the gallery on the left
   */
  onClickedOnImageInGallery = (newCurrentImage) => {
      // "data:image/gif"
    let dataType = "gif";
    let checkStr = (newCurrentImage.url).split(",")[0];
    console.log(checkStr)

    if (!this.state.isInAddImageMode){
      this.onChangeCurrentImage(newCurrentImage);
      console.log("isGif" + checkStr.includes(dataType));
      this.setState({isGif: checkStr.includes(dataType) });
    } else {
      this.setState({ 
        addedImages: [...this.state.addedImages, newCurrentImage],
        addedImgSizes: [...this.state.addedImgSizes, 50],
        addedImgPositions_X: [...this.state.addedImgPositions_X, 0],
        addedImgPositions_Y: [...this.state.addedImgPositions_Y, 0],
        isInAddImageMode: false });
    }
  }

  /**
   * Get Data of Generations, Likes and Views (of Generated memes) from memes with this template
   * @param memes memes that are saved in the DB with this template
   */
  setNewDataOfMemeForTemplate = (memes) => {

    //Create data Array for generation
    let generateData = [[{type: 'date', label: 'Time'}, {type:'number', label:'Generations'}]];

    if(!memes || memes.length <= 0) {
      generateData.push([new Date(Date.now()), 0]);
      this.setState({generateData: generateData})

    } else {

      generateData.push([new Date(memes[0].creation_time), 0]);
      memes.forEach((meme, index) => {
        generateData.push([new Date(meme.creation_time), index + 1]);
        this.setState({generateData: generateData})
      })
    }

    //Create data array for likes
    let likeData = [[{type: 'date', label: 'Time'}, {type:'number', label:'Likes'}]];

    if(!memes || memes.length <= 0) {
      likeData.push([new Date(Date.now()), 0]);
      this.setState({likeData: likeData})

    } else {

      likeData.push([new Date(memes[0].creation_time), 0]);

      let likeTimes = [];

      memes.forEach((meme) => {
        if (meme.likeLogs) {
          meme.likeLogs.forEach(like => {
            likeTimes.push({date: like.date, isDislike: like.isDislike})
          })
        }
      })

      likeTimes.sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
      });

      let likesCount = 0;
      likeTimes.forEach((like) => {
        likesCount = like.isDislike ? likesCount - 1 : likesCount + 1;
        likeData.push([new Date(like.date), likesCount]);
      })

      this.setState({likeData: likeData})
    }

    // Create data array for views
    let viewData = [[{type: 'date', label: 'Time'}, {type:'number', label:'Views'}]];

    if(!memes || memes.length <= 0) {
      viewData.push([new Date(Date.now()), 0]);
      this.setState({viewData: viewData});

    } else {
      viewData.push([new Date(memes[0].creation_time), 0]);

      let viewTimes = [];

      memes.forEach((meme) => {
        if (meme.views && meme.views.length > 0) {
          meme.views.forEach(view => {
            viewTimes.push(view)
          })
        }
      })

      viewTimes.sort(function (a, b) {
        return new Date(a) - new Date(b);
      });

      viewTimes.forEach((view, index) => {
        viewData.push([new Date(view), index + 1]);
      })

      this.setState({viewData: viewData})
    }

  }

  /**
   * Call when a new meme template is being edited
   * @param {object} image that is now the main template in the editor
   */
  onChangeCurrentImage = (newCurrentImage) => {
    let getCaptionPositions = (newCurrentImage) => {

      if (newCurrentImage.hasOwnProperty("captionPositions")) {
        return newCurrentImage.captionPositions;
      } else {
        let captionPositions = this.state.captionPositions_X
            .map((val, i) => [val, this.state.captionPositions_Y[i]]);
        for (let i = 0; i < newCurrentImage.box_count; i++) {
          captionPositions.push([50, 10 + (90 * i / newCurrentImage.box_count)]);
        }
        return captionPositions;
      }
    }

    let getCaptions= (newCurrentImage) => {

      if (newCurrentImage.hasOwnProperty("captions")) {
        return newCurrentImage.captions;
      } else {
        let captions = this.state.captions;
        for (let i = captions.length; i < newCurrentImage.box_count; i++) {
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

    // Get new data for template chart
    if (newCurrentImage._id) {
      const endpointWithParam = `${MEME_FROM_TEMPLATE_ID_ENDPOINT}/${newCurrentImage._id}`;

      console.log("endpointWithParam ", endpointWithParam)

      authorizedFetch(endpointWithParam, 'GET', {}, this.isNotAuthenticated)
          .then((json) => {
            this.setNewDataOfMemeForTemplate(json.memes)
          })
          .catch((error) => {
            console.error('Error:', error);
            return false;
          });
    } else {

      const endpointWithParam = `${MEME_FROM_TEMPLATE_ENDPOINT}/${encodeURIComponent(newCurrentImage.url)}`;

      console.log("endpointWithParam ", endpointWithParam)

      authorizedFetch(endpointWithParam, 'GET', {}, this.isNotAuthenticated)
          .then((json) => {
            this.setNewDataOfMemeForTemplate(json.memes)
          })
          .catch((error) => {
            console.error('Error:', error);
            return false;
          });
    }

    const imageInfo =  (newCurrentImage.hasOwnProperty("imageInfo") ? newCurrentImage.imageInfo : {size: null, x:0, y:0});
    const captionPositions = getCaptionPositions(newCurrentImage);
    const addedImgInfo = getAddedImgInfo(newCurrentImage);
    const canvasSize = (newCurrentImage.hasOwnProperty("canvasSize") ? newCurrentImage.canvasSize : {width: "97%", height: "90%"});
    const drawingCoordinates = newCurrentImage.hasOwnProperty("drawingCoordinates") ? newCurrentImage.drawingCoordinates : [];
    const imageDescription = newCurrentImage.hasOwnProperty("imageDescription") ? newCurrentImage.imageDescription : "";

    this.setState({
      canvasImage: undefined,
      currentImage: newCurrentImage,
      imageInfo: imageInfo,
      captionPositions_X: captionPositions.map(x => x[0]),
      captionPositions_Y: captionPositions.map(y => y[1]),
      captions: getCaptions(newCurrentImage),
      title: (newCurrentImage.hasOwnProperty("name") ? newCurrentImage.name : this.state.name),
      fontSize: (newCurrentImage.hasOwnProperty("fontSize") ? newCurrentImage.fontSize : this.state.fontSize),
      isItalic: (newCurrentImage.hasOwnProperty("isItalic") ? newCurrentImage.isItalic : this.state.isItalic),
      isBold: (newCurrentImage.hasOwnProperty("isBold") ? newCurrentImage.isBold : this.state.isBold),
      fontColor: (newCurrentImage.hasOwnProperty("fontColor") ? newCurrentImage.fontColor : this.state.fontColor),
      addedImages: getAddedImages(newCurrentImage),
      addedImgSizes: addedImgInfo.map(size => size[0]),
      addedImgPositions_X: addedImgInfo.map(x => x[1]),
      addedImgPositions_Y: addedImgInfo.map(y => y[2]),
      canvasSize: canvasSize,
      drawingCoordinates: drawingCoordinates,
      imageDescription: imageDescription
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

  setIsAuthenticated = (isAuthenticated) => this.setState({ isAuthenticated: isAuthenticated })

  render () {
    // If not logged in: Redirect to login page
    if (!this.state.isAuthenticated) return <Redirect to='/login'/>
    const { id } = this.props.match.params;
    return (
      <div>
        <CustomAppBar></CustomAppBar>
        <div className="App">
          <Paper className="templates left"
            style={{ marginTop: '5px', height: window.innerHeight * 0.95, overflow: 'scroll' }}
            elevation={2}>
            <TemplateGallery
              currentImage={this.state.currentImage}
              changeCurrentImage={this.onClickedOnImageInGallery}
              templateEndpoint={TEMPLATE_ENDPOINT}
              apiEndpoint={API_ENDPOINT}
              isInAddImageMode={this.state.isInAddImageMode}
              setIsAuthenticated={this.setIsAuthenticated}
              queryId={id}
            />
          </Paper>
          <div className="middle">
              {this.state.isGif
                ?<Gif
                    src={this.state.currentImage.url}
                    title={this.state.title}
                 />

                :<ImageCarousel
                    ref={this.imageCarousel}
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
              }
            <StatisticChart
                generateData={this.state.generateData}
                viewData={this.state.viewData}
                likeData={this.state.likeData}
            />
          </div>
          <Paper
            className="control right"
            style={{ marginTop: '5px', height: window.innerHeight * 0.9, overflow: 'scroll' }}
            elevation={2}>
            <h3 style={{ fontWeight: 'bold' }}>
              Editor&nbsp;
              <AudioDescription
                isEditor={true}
                captions={this.state.captions}
                imageDescription={this.state.imageDescription}
                imageName={this.state.currentImage.name}
              />
            </h3>
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
              newDictatedCaption={this.newDictatedCaption}
              isInAddImageMode={this.state.isInAddImageMode}
              switchToAddImageMode={this.onSwitchToAddImageMode.bind(this)}
              addedImages={this.state.addedImages}
              addedImgSizes={this.state.addedImgSizes}
              addedImgPositions_X={this.state.addedImgPositions_X}
              addedImgPositions_Y={this.state.addedImgPositions_Y}
              canvasSize={this.state.canvasSize}
              setCanvasSize={this.setCanvasSize.bind(this)}
              imageInfo={this.state.imageInfo}
              imageDescription={this.state.imageDescription}
              handleAddCaption={this.handleAddCaption}
              isGif={this.state.isGif}
            />
            <Button
              name="saveTemplateButton"
              variant="contained"
              size="small"
              color="primary"
              onClick={this.handleSaveAsTemplate}
              style={{ marginTop: '10px' }}>
              Save as template
            </Button>
            <Button
              name="saveMemeButton"
              variant="contained"
              size="small"
              color="secondary"
              onClick={this.generateMeme}
              style={{ marginTop: '10px', display: 'block' }}

              >
              Generate meme local
            </Button>
            <Button
              name="generateAPIButton"
              variant="contained"
              size="small"
              color="secondary"
              onClick={this.generateMemeBackend}
              style={{ marginTop: '10px', display: 'block' }}>
              Generate meme in backend
            </Button>
            <NewMeme
              open={this.state.newMemeDialogIsOpen}
              handleClose={() => this.setState({ newMemeDialogIsOpen: false })}
              dataUrl={this.state.canvasImage}
              uploadMeme={this.handleSaveAsMeme}
            />
          </Paper>
        </div>
      </div>
    );
  }
}

export default withRouter(Editor);
