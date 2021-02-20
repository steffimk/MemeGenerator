import React from 'react';
import PropTypes from 'prop-types';
import Dictaphone from '../../Dictaphone'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
export default class EditorControl extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        hideDescription: true
    }
  }

  /**
   * Shows or hides the respective part of the editor
   * @param {object} event 
   */
  clickedOnHideButton = (event) => {
    console.log(event)
    this.setState({ [event.target.parentElement.name]: !this.state[event.target.parentElement.name]})
  }

  /**
   * Renders the form to edit a caption with
   * @param {string} caption 
   * @param {*} captionPosition_X 
   * @param {*} captionPosition_Y 
   * @param {number} count 
   */
  renderCaption(caption, captionPosition_X, captionPosition_Y, count){
    const placeholder = 'Enter Caption ' + (count+1);
    const captionID = 'caption' + (count+1);
    const capName = 'caption' + count;
    captionPosition_X = (captionPosition_X !== undefined ? captionPosition_X : 50);
    captionPosition_Y = (captionPosition_Y !== undefined ? captionPosition_Y : 50);

    return (
      <Accordion style={{ width: '85%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ height: '40px' }}>
          <p>Caption {count + 1}</p>
        </AccordionSummary>
        <AccordionDetails>
          <table style={{ borderSpacing: '10px' }}>
            <tr>
              <TextField
                label={placeholder}
                variant="outlined"
                name="captions"
                value={caption}
                size="small"
                placeholder={placeholder}
                onChange={(e) => this.props.changeListener(e, count)}
              />
            </tr>
            <tr>
              <Dictaphone field={captionID} result={(result) => this.props.newDictatedCaption(result, count)} />
            </tr>
            <tr>
              x:&nbsp;
              <input
                type="range"
                min="1"
                max="100"
                value={captionPosition_X}
                name="captionPositions_X"
                key={'captionPositions_X' + count}
                className="slider"
                id={capName + '_X'}
                onChange={(e) => this.props.changeListener(e, count)}
                style={{ alignmentBaseline: 'central' }}
              />
            </tr>
            <tr>
              y:&nbsp;
              <input
                type="range"
                min="1"
                max="100"
                value={captionPosition_Y}
                name="captionPositions_Y"
                key={'captionPositions_Y' + count}
                className="slider"
                id={capName + '_Y'}
                onChange={(e) => this.props.changeListener(e, count)}
              />
            </tr>
          </table>
        </AccordionDetails>
      </Accordion>
    );
  }

  /**
   * Renders the form to edit the main image or an added image with
   * @param {string} title 
   * @param {number} size 
   * @param {number} imgPosX 
   * @param {number} imgPosY 
   * @param {number} count 
   * @param {bool} isAddedImg - set false if rendering the main image
   */
  renderImage(title, size, imgPosX, imgPosY, count, isAddedImg){
    const sizeName = isAddedImg ? "addedImgSizes" : "imageInfoSize"
    const xPosName = isAddedImg ? "addedImgPositions_X" : "imageInfoX"
    const yPosName = isAddedImg ? "addedImgPositions_Y" : "imageInfoY"
    const imgName = isAddedImg ? ("addedImage" + count) : "mainImage";
    const imgTitle = isAddedImg ? title : "Main Template"
    if (!isAddedImg && size == null) size = 100
    size = (size !== undefined ? size : 50);
    imgPosX = (imgPosX !== undefined ? imgPosX : 0);
    imgPosY = (imgPosY !== undefined ? imgPosY : 0);

    return (
      <Accordion style={{ width: '85%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ height: '40px' }}>
          <p>{imgTitle}:</p>
        </AccordionSummary>
        <AccordionDetails>
          <table style={{ borderSpacing: '10px' }}>
            <tr>
              Size:&nbsp;
              <input
                type="range"
                min="1"
                max="100"
                value={size}
                name={sizeName}
                key={sizeName + count}
                className="slider"
                id={imgName + 'Size'}
                onChange={(e) => this.props.changeListener(e, count)}
                style={{ alignmentBaseline: 'central' }}
              />
            </tr>
            <tr>
              x:&nbsp;
              <input
                type="range"
                min="1"
                max="100"
                value={imgPosX}
                name={xPosName}
                key={xPosName + count}
                className="slider"
                id={imgName + '_X'}
                onChange={(e) => this.props.changeListener(e, count)}
                style={{ alignmentBaseline: 'central' }}
              />
            </tr>
            <tr>
              y:&nbsp;
              <input
                type="range"
                min="1"
                max="100"
                value={imgPosY}
                name={yPosName}
                key={yPosName + count}
                className="slider"
                id={imgName + '_Y'}
                onChange={(e) => this.props.changeListener(e, count)}
              />
            </tr>
          </table>
        </AccordionDetails>
      </Accordion>
    );
  }

  render() {
      const captionPositions_X = this.props.captionPositions_X;
      const captionPositions_Y = this.props.captionPositions_Y;
      var captionInputs = this.props.captions.map(
        (caption, index) => this.renderCaption(
            caption, captionPositions_X[index], captionPositions_Y[index], index
        )
      );
      captionInputs.push(
        <Button
            name="addCaption"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.props.handleAddCaption} 
            style={{ display: 'block', marginTop: '10px', marginBottom: '10px' }}>
            Add an extra caption
        </Button>)

      const addedImageEdits = this.props.addedImages.map(
        (image, i) => this.renderImage(
          image.name, this.props.addedImgSizes[i], this.props.addedImgPositions_X[i], this.props.addedImgPositions_Y[i], i, true
        )
      )
      addedImageEdits.unshift(this.renderImage(this.props.title, this.props.imageInfo.size, this.props.imageInfo.x, this.props.imageInfo.y, -1, false))
      addedImageEdits.push(
        <Button
            name="addImage"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.props.switchToAddImageMode}
            style={{ display: 'block', marginTop: '10px', marginBottom: '10px'}}>
          {(this.props.isInAddImageMode === true) ? "Cancel add image" : "Add Image"}
        </Button>)
      
    return (
      <div>
        <TextField 
          variant="outlined"
          label="Enter title"
          name="title"
          value={this.props.title}
          size="small"
          placeholder="Enter title"
          onChange={this.props.changeListener}
          style={{ marginTop: '5px', display: 'block' }}
        />
        <TextField
          label="Font Size"
          variant="outlined"
          name="fontSize"
          type="number"
          size="small"
          value={this.props.fontSize}
          onChange={this.props.changeListener}
          style={{ marginTop: '10px', display: 'block' }}
        />
        <p>Font Color:&nbsp;
          <input
            label="Font Color"
            variant="outlined"
            type="color"
            name="fontColor"
            value={this.props.fontColor}
            onChange={this.props.changeListener}
            style={{ width: '35%' }}
          />
        </p>
        <FormControlLabel control={
          <Checkbox
            checked={this.props.isItalic}
            onChange={this.props.changeListener}
            name="isItalic"
            id="isItalic"
            color="primary"
          />} label="Italic" style={{ marginRight: '50px' }}
        />
        <FormControlLabel control={
          <Checkbox
            checked={this.props.isBold}
            onChange={this.props.changeListener}
            name="isBold"
            id="isBold"
            color="primary"
          />} label="Bold"
        />
        {captionInputs}
        {addedImageEdits}
        <TextField
          label="Canvas Width"
          variant="outlined"
          name="canvasWidth"
          type="number"
          size="small"
          value={this.props.canvasSize.width}
          onChange={(e) => this.props.setCanvasSize({width: e.target.value, height: this.props.canvasSize.height})}
          style={{ marginTop: '10px', display: 'block' }}
        />
        <TextField
          label="Canvas Height"
          variant="outlined"
          name="canvasHeight"
          type="number"
          size="small"
          value={this.props.canvasSize.height}
          onChange={(e) => this.props.setCanvasSize({height: e.target.value, width: this.props.canvasSize.width})}
          style={{ marginTop: '10px', display: 'block' }}
        />
        <Button
          name="hideDescription"
          variant="contained"
          size="small"
          onClick={this.clickedOnHideButton}
          style={{ marginTop: '10px', display: 'block' }}>
          {(this.state.hideDescription === true) ? "Describe image content" : "Hide description editor"}</Button>
        {!this.state.hideDescription && 
          (<p>
            <small>Describe the image content to make your<br/>meme accessible to the visually impaired:</small>
            <textarea
              name="imageDescription"
              placeholder="Describe the image content"
              value={this.props.imageDescription}
              onChange={this.props.changeListener}
              rows="5"
              style={{ width: '85%' }}
            />
          </p>)}
      </div>
    );
  }
}

EditorControl.propTypes = {
  captions: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeListener: PropTypes.func.isRequired,
  isInAddImageMode: PropTypes.bool.isRequired,
  addedImages: PropTypes.array.isRequired,
  addedImgPositions_X: PropTypes.array.isRequired,
  addedImgPositions_Y: PropTypes.array.isRequired,
  addedImgSizes: PropTypes.array.isRequired,
  switchToAddImageMode: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  captionPositions_X: PropTypes.array.isRequired,
  captionPositions_Y: PropTypes.array.isRequired,
  fontSize: PropTypes.number.isRequired,
  isItalic: PropTypes.bool.isRequired,
  isBold: PropTypes.bool.isRequired,
  fontColor: PropTypes.string.isRequired,
  canvasSize: PropTypes.object.isRequired,
  setCanvasSize: PropTypes.func.isRequired,
  imageInfo: PropTypes.object.isRequired,
  imageDescription: PropTypes.string.isRequired,
  handleAddCaption: PropTypes.func.isRequired,
  newDictatedCaption: PropTypes.func.isRequired
}