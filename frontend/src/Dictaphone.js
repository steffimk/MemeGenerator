import React from 'react';
import { IconButton } from '@material-ui/core';
import {PlayArrow, Stop } from '@material-ui/icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const Dictaphone = (props) => {
 
  const { transcript, resetTranscript,finalTranscript, interimTranscript } = useSpeechRecognition();
  const [voiceOn, setVoiceOn] = React.useState();
 
  React.useEffect(() => {
    if(transcript !== '' && voiceOn ) {
      console.log("Dica " + props.field + " Hieeeeeer : " + transcript);
      props.result(transcript);
    }
  },[interimTranscript, finalTranscript]);


  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log("Browser wird nicht unterstützt!")
    return null;
  }

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({continuous: true});
    setVoiceOn(true);
  }

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