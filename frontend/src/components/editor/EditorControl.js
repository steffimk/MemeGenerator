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

  clickedOnHideButton = (event) => this.setState({ [event.target.name]: !this.state[event.target.name]})

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

  renderAddedImage(title, size, addedImgPosition_X, addedImgPosition_Y, count){
    const imgName = 'addedImage' + count;
    size = (size !== undefined ? size : 50);
    addedImgPosition_X = (addedImgPosition_X !== undefined ? addedImgPosition_X : 0);
    addedImgPosition_Y = (addedImgPosition_Y !== undefined ? addedImgPosition_Y : 0);

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
            name="addedImgSizes"
            key={'addedImgSizes' + count}
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
            value={addedImgPosition_X}
            name="addedImgPositions_X"
            key={'addedImgPositions_X' + count}
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
            value={addedImgPosition_Y}
            name="addedImgPositions_Y"
            key={'addedImgPositions_Y' + count}
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
        (image, i) => this.renderAddedImage(
          image.name, this.props.addedImgSizes[i], this.props.addedImgPositions_X[i], this.props.addedImgPositions_Y[i], i
        )
      )
      
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
            name="fontColor"
            value={this.props.fontColor}
            onChange={this.props.changeListener}
            style={{ width: '10ch' }}
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
        <button name="addImage" onClick={this.props.switchToAddImageMode}>
          {(this.props.isInAddImageMode === true) ? "Cancel add image" : "Add Image"}</button>
        <button name="hideAddedImages" onClick={this.clickedOnHideButton} style={{ display: 'block' }}>
          {(this.state.hideAddedImages === true) ? "Show image editors" : "Hide image editors"}</button>
        {!this.state.hideAddedImages && (addedImageEdits)}
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
  fontColor: PropTypes.string.isRequired
}