import React from 'react';
import { Button, IconButton } from '@material-ui/core';
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
 

  //  React.useEffect(() => {
  //    console.log("effect event");
  //    setText(transcript);
  //    props.result(text);

  //  },[text]);

  
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
    console.log( document.getElementById(props.field));
    setVoiceOn(true);
    //setText(transcript);
    console.log(document.getElementById('caption1'))
  }

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setVoiceOn(false);
   // setText(transcript);
    //props.result = text;
   // document.getElementById(props.field).value=transcript;
    
    resetTranscript();
  }

  const changeSpeechToText = (e) => {
    //setText(transcript);
    console.log("ffffiree event");
    props.result(e.target.value);
  }

  return (
  
    <Card>
      <CardContent>
      <div onChange={changeSpeechToText}>{text}</div>
      </CardContent>
      <IconButton onClick={startListening}><PlayArrow/></IconButton>
      <IconButton onClick={stopListening}><Save/></IconButton>
      <IconButton onClick={resetTranscript}><Stop/></IconButton>
      <Button onClick={changeSpeechToText}>text</Button>
    </Card>
  )
}
export default Dictaphone