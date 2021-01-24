import React from 'react';
import PropTypes from 'prop-types';
export default class EditorControl extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        hideCaptions: false,
        hideAddedImages: false
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
    if (!isAddedImg && size == null) size = 100 
    size = (size !== undefined ? size : 50);
    imgPosX = (imgPosX !== undefined ? imgPosX : 0);
    imgPosY = (imgPosY !== undefined ? imgPosY : 0);

    return (
      <form>
        <p>{title}:</p>
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
      const captionInputs = this.props.captions.map(
        (caption, index) => this.renderCaption(
            caption, captionPositions_X[index], captionPositions_Y[index], index
        )
      );
      const addedImageEdits = this.props.addedImages.map(
        (image, i) => this.renderImage(
          image.name, this.props.addedImgSizes[i], this.props.addedImgPositions_X[i], this.props.addedImgPositions_Y[i], i, true
        )
      )
      addedImageEdits.unshift(this.renderImage(this.props.title, this.props.imageInfo.size, this.props.imageInfo.x, this.props.imageInfo.y, -1, false))
      
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
          <select name="fontColor" onChange={this.props.changeListener} value={this.props.fontColor} style={styleFontColor(this.props.fontColor)}>
              <option value="Black" style={{backgroundColor: "Black",color: "#fff"}}>Black</option>
              <option value="DarkGray" style={{backgroundColor: "DarkGray",color: "#fff"}}>DarkGray</option>
              <option value="White" style={{backgroundColor: "White",color: "#000"}}>White</option>
              <option value="IndianRed" style={{backgroundColor: "IndianRed",color: "#fff"}}>IndianRed</option>
              <option value="LightCoral" style={{backgroundColor: "LightCoral",color: "#fff"}}>LightCoral</option>
              <option value="Crimson" style={{backgroundColor: "Crimson",color: "#fff"}}>Crimson</option>
              <option value="Red" style={{backgroundColor: "Red",color: "#fff"}}>Red</option>
              <option value="DarkRed" style={{backgroundColor: "DarkRed",color: "#fff"}}>DarkRed</option>
              <option value="Pink" style={{backgroundColor: "Pink",color: "#000"}}>Pink</option>
              <option value="HotPink" style={{backgroundColor: "HotPink",color: "#fff"}}>HotPink</option>
              <option value="MediumVioletRed" style={{backgroundColor: "MediumVioletRed",color: "#fff"}}>MediumVioletRed</option>
              <option value="Violet" style={{backgroundColor: "Violet",color: "#fff"}}>Violet</option>
              <option value="Fuchsia" style={{backgroundColor: "Fuchsia",color: "#fff"}}>Fuchsia</option>
              <option value="DarkMagenta" style={{backgroundColor: "DarkMagenta",color: "#fff"}}>DarkMagenta</option>
              <option value="Indigo" style={{backgroundColor: "Indigo",color: "#fff"}}>Indigo</option>
              <option value="OrangeRed" style={{backgroundColor: "OrangeRed",color: "#fff"}}>OrangeRed</option>
              <option value="DarkOrange" style={{backgroundColor: "DarkOrange",color: "#fff"}}>DarkOrange</option>
              <option value="Orange" style={{backgroundColor: "Orange",color: "#fff"}}>Orange</option>
              <option value="Gold" style={{backgroundColor: "Gold",color: "#000"}}>Gold</option>
              <option value="Yellow" style={{backgroundColor: "Yellow",color: "#000"}}>Yellow</option>
              <option value="LawnGreen" style={{backgroundColor: "LawnGreen",color: "#000"}}>LawnGreen</option>
              <option value="LimeGreen" style={{backgroundColor: "LimeGreen",color: "#fff"}}>LimeGreen</option>
              <option value="Green" style={{backgroundColor: "Green",color: "#fff"}}>Green</option>
              <option value="Olive" style={{backgroundColor: "Olive",color: "#fff"}}>Olive</option>
              <option value="DarkCyan" style={{backgroundColor: "DarkCyan",color: "#fff"}}>DarkCyan</option>
              <option value="Cyan" style={{backgroundColor: "Cyan",color: "#000"}}>Cyan</option>
              <option value="Aquamarine" style={{backgroundColor: "Aquamarine",color: "#000"}}>Aquamarine</option>
              <option value="DarkTurquoise" style={{backgroundColor: "DarkTurquoise",color: "#fff"}}>DarkTurquoise</option>
              <option value="SteelBlue" style={{backgroundColor: "SteelBlue",color: "#fff"}}>SteelBlue</option>
              <option value="SkyBlue" style={{backgroundColor: "SkyBlue",color: "#fff"}}>SkyBlue</option>
              <option value="DeepSkyBlue" style={{backgroundColor: "DeepSkyBlue",color: "#fff"}}>DeepSkyBlue</option>
              <option value="CornflowerBlue" style={{backgroundColor: "CornflowerBlue",color: "#fff"}}>CornflowerBlue</option>
              <option value="Blue" style={{backgroundColor: "Blue",color: "#fff"}}>Blue</option>
              <option value="DarkBlue" style={{backgroundColor: "DarkBlue",color: "#fff"}}>DarkBlue</option>
              <option value="Peru" style={{backgroundColor: "Peru",color: "#fff"}}>Peru</option>
              <option value="Sienna" style={{backgroundColor: "Sienna",color: "#fff"}}>Sienna</option>
              <option value="Maroon" style={{backgroundColor: "Maroon",color: "#fff"}}>Maroon</option>
          </select>
        </p>
        <input type="checkbox" id="isItalic" name="isItalic" onChange={this.props.changeListener} checked={this.props.isItalic}/>
        <label for="isItalic" style={{fontStyle: 'italic'}}>Italic&nbsp;&nbsp;</label>
        <input type="checkbox" id="isBold" name="isBold" onChange={this.props.changeListener} checked={this.props.isBold}/>
        <label for="isBold"style={{fontWeight: 'bold'}}>Bold</label>
        <p/> {/* For vertical spacing */}
        <button name="hideCaptions" onClick={this.clickedOnHideButton} style={{ display: 'block' }}>
          {(this.state.hideCaptions === true) ? "Show caption editors" : "Hide caption editors"}</button>
        {!this.state.hideCaptions && (captionInputs)}
        <button name="addImage" onClick={this.props.switchToAddImageMode}>
          {(this.props.isInAddImageMode === true) ? "Cancel add image" : "Add Image"}</button>
        {(this.props.addedImages.length > 0) &&
          (<button name="hideAddedImages" onClick={this.clickedOnHideButton} style={{ display: 'block' }}>
            {(this.state.hideAddedImages === true) ? "Show image editors" : "Hide image editors"}</button>)}
        {!this.state.hideAddedImages && (addedImageEdits)}
        <p>
          Canvas Width:&nbsp;
          <input
            name="canvasWidth"
            value={this.props.canvasSize.width}
            onChange={(e) => this.props.setCanvasSize({width: e.target.value, height: this.props.canvasSize.height})}
            style={{ width: '3ch' }}
          />
        </p>
        <p>
          Canvas Height:&nbsp;
          <input
            name="canvasHeight"
            value={this.props.canvasSize.height}
            onChange={(e) => this.props.setCanvasSize({height: e.target.value, width: this.props.canvasSize.width})}
            style={{ width: '3ch' }}
          />
        </p>
      </div>
    );
  }
}

/**
 * Returns the styling of the select-element
 * @param {*} color 
 */
const styleFontColor = (color) => { return { backgroundColor: color, color: "#fff"}}

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
  imageInfo: PropTypes.object.isRequired
}