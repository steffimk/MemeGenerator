import React from 'react';
import { IconButton } from '@material-ui/core';
import {PlayArrow, Save, Stop } from '@material-ui/icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';



const Dictaphone = (props) => {
  // const commands = [
  //   {
  //     command: 'edit caption :number',
  //     callback: (number) =>  document.getElementById('caption'+ number).value=finalTranscript
  //   },

  //   {
  //     command: 'reset',
  //     callback: () => resetTranscript()
  //   },
  // ]

 
  const { transcript, resetTranscript,finalTranscript, interimTranscript, listening } = useSpeechRecognition();
  const [voiceOn, setVoiceOn] = React.useState();
  const [text, setText] = React.useState();
 
  React.useEffect(() => {
    if(transcript !== '' ) {
      console.log("Dica Hieeeeeer", transcript);
      props.result(transcript);
      
    }
  },[interimTranscript, finalTranscript]);


  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({continuous: true});
    setVoiceOn(true);
  }

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setVoiceOn(false);
    resetTranscript();
  }

  return (
  
    <Card>
      <CardContent>
      </CardContent>
      <IconButton onClick={startListening}><PlayArrow/></IconButton>
      <IconButton onClick={stopListening}><Save/></IconButton>
      <IconButton onClick={resetTranscript}><Stop/></IconButton>
    </Card>
  )
}
export default Dictaphone