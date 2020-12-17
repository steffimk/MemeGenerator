import React from 'react';
import PropTypes from 'prop-types';

export default class EditorControl extends React.Component {

  renderCaption(caption, captionPosition_X, captionPosition_Y, count){
    const placeholder = 'Enter Caption ' + count;
    const capName = 'caption' + count;
    captionPosition_X = (captionPosition_X !== undefined ? captionPosition_X : 50);
    captionPosition_Y = (captionPosition_Y !== undefined ? captionPosition_Y : 50);

    return (
        <div>
          <input
              name="captions"
              value={caption}
              placeholder={placeholder}
              onChange={(e) => this.props.changeListener(e, count)}
          />
            <input type="range" min="1" max="100"
                   value={captionPosition_X}
                   name="captionPositions_X"
                   key={"captionPositions_X" + count}
                   className="slider"
                   id={capName + "_X"}
                   onChange={(e) => this.props.changeListener(e, count)}
            />
            <input type="range" min="1" max="100"
                   value={captionPosition_Y}
                   name="captionPositions_Y"
                   key={"captionPositions_Y" + count}
                   className="slider"
                   id={capName + "_Y"}
                   onChange={(e) => this.props.changeListener(e, count)}
            />
        </div>
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
          {captionInputs}
      </div>
    )
  }
}

EditorControl.propTypes = {
  captions: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeListener: PropTypes.func.isRequired
}