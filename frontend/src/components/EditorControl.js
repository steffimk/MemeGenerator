import React from 'react';
import PropTypes from 'prop-types';

export default class EditorControl extends React.Component {

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

  render() {
      let captionPositions_X = this.props.captionPositions_X;
      let captionPositions_Y = this.props.captionPositions_Y;
      let captionInputs = this.props.captions.map(
        (caption, index) => this.renderCaption(
            caption, captionPositions_X[index], captionPositions_Y[index], index
        )
    );
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
        <input type="checkbox" id="isItalic" name="isItalic" onChange={this.props.changeListener}/>
        <label for="isItalic" style={{fontStyle: 'italic'}}>Italic&nbsp;&nbsp;</label>
        <input type="checkbox" id="isBold" name="isBold" onChange={this.props.changeListener}/>
        <label for="isBold"style={{fontWeight: 'bold'}}>Bold</label>
        {captionInputs}
      </div>
    );
  }
}

EditorControl.propTypes = {
  captions: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeListener: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  captionPositions_X: PropTypes.array.isRequired,
  captionPositions_Y: PropTypes.array.isRequired,
  fontSize: PropTypes.number.isRequired,
  isItalic: PropTypes.bool.isRequired,
  isBold: PropTypes.bool.isRequired
}