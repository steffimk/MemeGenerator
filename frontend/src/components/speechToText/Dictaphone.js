import React from 'react';
import { IconButton } from '@material-ui/core';
import {PlayArrow, Stop } from '@material-ui/icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

/**
 * This component contains the needed functions to listen speech and convert it into text.
 * The Play-Button is for speech recording and Stopp-Button stops current speech recording.
 */
const Dictaphone = (props) => {
 
  const { transcript, resetTranscript,finalTranscript, interimTranscript, listening } = useSpeechRecognition();
  const [voiceOn, setVoiceOn] = React.useState();
 
  React.useEffect(() => {
    if(transcript !== '' && voiceOn ) {
      console.log("Dictaphone " + props.field + " with text: " + transcript);
      props.result(transcript);
    }
  },[interimTranscript, finalTranscript]);


  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log("Browser wird nicht unterstützt!")
    return null;
  }

  /**
   * Start listening and reset old transcript.
   */
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({continuous: true});
    setVoiceOn(true);
  }

  /**
   * Stop listening.
   */
  const stopListening = () => {
    SpeechRecognition.stopListening();
    setVoiceOn(false);
  }

  return (
  <div>
    <IconButton  onClick={startListening}><PlayArrow/></IconButton>
    <IconButton onClick={stopListening}><Stop/></IconButton>
  </div>
  )
}
export default Dictaphone