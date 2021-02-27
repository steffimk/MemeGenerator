import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { fabric } from "fabric";
import { fabricGif } from "./fabricGif";

export default class Gif extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            genGif: ''
        };
    }
    
    componentDidMount() {
        this.renderGif();
    }
  
    renderGif = async () => {
        const canvas = new fabric.Canvas("canvas");
             canvas.setDimensions({
             width: 900,
             height: 600,
         });
         const gif = await fabricGif(
             this.props.src,
             500,
             500,
             this.props.caption,
             this.props.posX,
             this.props.posY,
             this.props.isItalic, 
             this.props.isBold, 
             this.props.fontSize, 
             this.props.fontColor,
        );
        gif.set({ top: 50, left: 50 });
        console.log("GIF: " + gif );
        this.setState({genGif: gif});
        canvas.add(gif);
        
        fabric.util.requestAnimFrame(function render() {
            canvas.renderAll();
            fabric.util.requestAnimFrame(render);
        });
  }

    render() {
        return (
            <div>
                <h1>{this.props.title}</h1>
                {/* <img src={this.state.genGif}  crossOrigin={"anonymous"} style={{width: this.props.width, height: this.props.height}} ></img> */}
                <Button onClick={this.renderGif}>TEST</Button>
                <canvas id="canvas" style={{width: this.props.width, height: this.props.height}}></canvas>
            </div>
        );
    }

}

Gif.propTypes = {
    gif: PropTypes.string.isRequired,
    width: PropTypes.number, 
    height: PropTypes.number,
    src: PropTypes.array,
    title: PropTypes.string,
    caption: PropTypes.string,
    isItalic: PropTypes.bool,
    isBold: PropTypes.bool,
    fontSize: PropTypes.string,
    fontFamily: PropTypes.string,
    fontColor: PropTypes.string, 
    posX: PropTypes.number, 
    posY: PropTypes.number,
 };

 Gif.defaultProps = {
    width: '75%', 
    height: '75%',
    caption: "Haaaaallllooooo",
    posX: 50, 
    posY: 50,
 };