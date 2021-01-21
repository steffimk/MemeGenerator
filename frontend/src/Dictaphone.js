import React from 'react';
import { IconButton } from '@material-ui/core';
import {PlayArrow, Save, Stop } from '@material-ui/icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';



const Dictaphone = (props) => {
  const { transcript, resetTranscript,finalTranscript } = useSpeechRecognition();
  const [voiceOn, setVoiceOn] = React.useState();
 
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }

  const startListening = () => {
    SpeechRecognition.startListening({continuous: true});
    console.log( document.querySelector('#'+props.field));
    setVoiceOn(true);
    resetTranscript();
  }

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setVoiceOn(false);
    document.querySelector('#' + props.field).value=finalTranscript;
    resetTranscript();
  }

  return (
    <div>
      <IconButton onClick={startListening}><PlayArrow/></IconButton>
      <IconButton onClick={stopListening}><Save/></IconButton>
      <IconButton onClick={resetTranscript}><Stop/></IconButton>
      <p>{transcript}</p>
    </div>
  )
}
export default Dictaphone