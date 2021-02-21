import React from 'react';
import PropTypes from 'prop-types';
import Gifshot from 'gifshot/dist/gifshot';
import { Button } from '@material-ui/core'; 

export default class Gif extends React.Component {
    
    
    createGif = () => {
        Gifshot.createGIF({
            'gifWidth': this.props.width,
            'gifHeight': this.props.height,
            'images': this.props.value,
            'text' : this.props.text,
            'fontWeight': this.props.fontWeight,
            'fontSize': this.props.fontSize,
            'fontFamily': this.props.fontFamily,
            'fontColor': this.props.fontColor,
            // Bei dem Wert 0 zentriert sich der Wert zur aktuellen Breite
            'textXCoordinate': this.props.posX,
            'textYCoordinate': this.props.posY
        },function(obj) {
            if(!obj.error) {
                var image = obj.image,
                animatedImage = document.getElementById('gifImg');
                animatedImage.src = image;
        }
      });
    
    }

    render() {
        return (
            <div>
            <Button onClick={this.createGif.bind(this)} >Generate</Button>
            <img style={{margin: '100px'}} id="gifImg"></img>
            </div>
        );

    }
}

Gif.propTypes = {
    gifId: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired, 
    height: PropTypes.number.isRequired,
    value: PropTypes.array, 
    text: PropTypes.string,
    fontWeight: PropTypes.string, 
    fontSize: PropTypes.string,
    fontFamily: PropTypes.string,
    fontColor: PropTypes.string, 
    posX: PropTypes.number.isRequired, 
    posY: PropTypes.number.isRequired,
 };
 
 Gif.defaultProps = {
    gifId: 'gifImg',
    width: 200, 
    height: 200,
    value: ['http://i.imgur.com/2OO33vX.jpg', 'http://i.imgur.com/qOwVaSN.png', 'http://i.imgur.com/Vo5mFZJ.gif'], 
    text: 'Test Text',
    fontWeight: 'normal', 
    fontSize: '16px',
    fontFamily: 'sans-serif',
    fontColor: '#ffffff', 
    posX: 150, 
    posY: 150,
 };
 