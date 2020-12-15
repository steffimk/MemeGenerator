import React from 'react';
import PropTypes from 'prop-types';

export default class EditorControl extends React.Component {

  renderCaption(caption, count){
    const placeholder = 'Enter Caption ' + count
    const capName = 'caption' + count 
    return <input name={capName} value={caption} placeholder={placeholder}
    onChange={(e) => this.props.changeListener(e, count)}/>
  }

  render() {
    let captionInputs = this.props.captions.map((caption, index) => this.renderCaption(caption, index))
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