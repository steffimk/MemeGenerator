// here's an example
import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import GifPlayer from 'react-gif-player';
export default class MyGifWrapper extends React.Component {
    // componentDidMount () {
    //   addEventListenerWhenGifFlowsOffscreen(this.pauseGif);
    // }
   
    render () {
      return (
        <GifPlayer
          gif={this.props.src}
          still={this.props.still}
          pauseRef={pause => this.pauseGif = pause}
        />
      );
    }
  }

  MyGifWrapper.propTypes = {
    src: PropTypes.string.isRequired,
    still: PropTypes.string.isRequired,

 };