import React from 'react';
import PropTypes from 'prop-types';
import Dictaphone from '../../Dictaphone'
export default class EditorControl extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        hideCaptions: false,
        hideAddedImages: false,
        hideDescription: true
    }
  }

  /**
   * Shows or hides the respective part of the editor
   * @param {object} event 
   */
  clickedOnHideButton = (event) => this.setState({ [event.target.name]: !this.state[event.target.name]})

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
      <form>
        <p>Caption {count + 1}:</p>
        <input
          name="captions"
          value={caption}
          placeholder={placeholder}
          onChange={(e) => this.props.changeListener(e, count)}
          style={{ display: 'block' }}
        />
        <Dictaphone field={captionID} result={(result) => this.props.newDictatedCaption(result, count)}/>
        <p>
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
            style={{alignmentBaseline: 'central'}}
          />
        </p>
        <p>
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
        </p>
      </form>
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
      <form>
        <p>{imgTitle}:</p>
        <p>
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
            style={{alignmentBaseline: 'central'}}
          />
        </p>
        <p>
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
            style={{alignmentBaseline: 'central'}}
          />
        </p>
        <p>
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
        </p>
      </form>
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
      captionInputs.push(<button name="addCaption" onClick={this.props.handleAddCaption} 
          style={{ display: 'block' }}>Add an extra caption</button>)

      const addedImageEdits = this.props.addedImages.map(
        (image, i) => this.renderImage(
          image.name, this.props.addedImgSizes[i], this.props.addedImgPositions_X[i], this.props.addedImgPositions_Y[i], i, true
        )
      )
      addedImageEdits.unshift(this.renderImage(this.props.title, this.props.imageInfo.size, this.props.imageInfo.x, this.props.imageInfo.y, -1, false))
      addedImageEdits.push(<button name="addImage" onClick={this.props.switchToAddImageMode}>
          {(this.props.isInAddImageMode === true) ? "Cancel add image" : "Add Image"}</button>)
      
    return (
      <div>
        <p>
          Title:&nbsp;
          <input 
            name="title"
            value={this.props.title}
            placeholder="Enter title"
            onChange={this.props.changeListener}
          />
        </p>
        <p>
          Font Size:&nbsp;
          <input
            name="fontSize"
            value={this.props.fontSize}
            onChange={this.props.changeListener}
            style={{ width: '3ch' }}
          />
        </p>
        <p>
          Font Color:&nbsp;
          <input
            type="color"
            name="fontColor"
            value={this.props.fontColor}
            onChange={this.props.changeListener}
            style={{ width: '35%' }}
          />
        </p>
        <input type="checkbox" id="isItalic" name="isItalic" onChange={this.props.changeListener} checked={this.props.isItalic}/>
        <label for="isItalic" style={{fontStyle: 'italic'}}>Italic&nbsp;&nbsp;</label>
        <input type="checkbox" id="isBold" name="isBold" onChange={this.props.changeListener} checked={this.props.isBold}/>
        <label for="isBold"style={{fontWeight: 'bold'}}>Bold</label>
        <p/> {/* For vertical spacing */}
        <button name="hideCaptions" onClick={this.clickedOnHideButton} style={{ display: 'block' }}>
          {(this.state.hideCaptions === true) ? "Show caption editors" : "Hide caption editors"}</button>
        {!this.state.hideCaptions && (captionInputs)}
        <button name="hideAddedImages" onClick={this.clickedOnHideButton} style={{ display: 'block' }}>
            {(this.state.hideAddedImages === true) ? "Show image editors" : "Hide image editors"}</button>
        {!this.state.hideAddedImages && (addedImageEdits)}
        <p>
          Canvas Width:&nbsp;
          <input
            name="canvasWidth"
            type="number"
            value={this.props.canvasSize.width}
            onChange={(e) => this.props.setCanvasSize({width: e.target.value, height: this.props.canvasSize.height})}
            style={{ width: '5ch' }}
          />
        </p>
        <p>
          Canvas Height:&nbsp;
          <input
            name="canvasHeight"
            type="number"
            value={this.props.canvasSize.height}
            onChange={(e) => this.props.setCanvasSize({height: e.target.value, width: this.props.canvasSize.width})}
            style={{ width: '5ch' }}
          />
        </p>
        <button name="hideDescription" onClick={this.clickedOnHideButton}>
          {(this.state.hideDescription === true) ? "Describe image content" : "Hide description editor"}</button>
        {!this.state.hideDescription && 
          (<p>
            <small>Describe the image content<br/>to make your meme accessible<br/>to the visually impaired:</small>
            <textarea
              name="imageDescription"
              placeholder="Describe the image content"
              value={this.props.imageDescription}
              onChange={this.props.changeListener}
              rows="5"
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