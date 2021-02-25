import React from 'react';
import PropTypes from 'prop-types';
import {GifUtil } from 'gifwrap';
import { Button } from '@material-ui/core';
import testGif from './gifExample.gif';
var test = require('./gifExample.gif');

export default class GifReader extends React.Component {

    readGif = () => {
        let gif = document.getElementById('gif');
        GifUtil.read(this.props.gif).then(inputGif => {
             inputGif.frames.forEach(frame => {
                 const buf = frame.bitmap.data;
                 console.log("test"+ frame);
             })
           
        })

       
    }



    render(){
        return(
            <div>
            <h1>TEst</h1>
            <img id="gif" src={testGif} alt="gif"></img>
            <Button onClick={this.readGif}>READ</Button>
            </div>
        )
    }
}
GifReader.propTypes = {
    gif: PropTypes.string.isRequired,
   
};