import React, { Component } from 'react'
import Speech from 'speak-tts'
import PropTypes from 'prop-types'

export default class AudioDescription extends Component {

  constructor(props) {
    super(props)
    this.speech = new Speech()
    this.speech
      .init({'lang': 'en-GB', 'voice':'Google UK English Male'})
      .then((data) => {
        console.log('Speech is ready, voices are available', data);
      })
      .catch((e) => {
        console.error('An error occured while initializing : ', e);
      });
  }

  /**
   * Audio description of a meme or the editor. Reads out the title and captions of the current meme/template.
   */
  read = () => {
    let text = ''
    if (this.props.isEditor === true) {
      text = `The meme editor is opened. You are currently editing a template with the title ${this.props.imageName}. `
    } else {
      text = `You are currently looking at a meme with the title ${this.props.imageName}. `
    }
    if (this.props.imageDescription) {
      text += `The image content can be described as follows. ${this.props.imageDescription} `
    } else {
      text += "The creator did not add a description of the image content. "
    }
    if (this.props.captions) {
      this.props.captions.forEach((caption,index) => {
          if(caption.length > 0 && caption !== '') text += `Caption ${index+1} says ${caption}. `
        })
    }

    this.speech
    .speak({text: text})
    .then(() => {
      console.log('Speech was successful!');
    })
    .catch((e) => {
      console.error('A speech error occurred: ', e);
    });
  } 

  render() {
    return (
      <i class="fas fa-audio-description" onClick={this.read}/>
    )
  }
}

AudioDescription.propTypes = {
  captions: PropTypes.arrayOf(PropTypes.string).isRequired,
  imageName: PropTypes.string.isRequired,
  imageDescription: PropTypes.string.isRequired,
  isEditor: PropTypes.bool.isRequired
}