import React from 'react';
import PropTypes from 'prop-types';

import './ImageCarousel.css'

export default class ImageCarousel extends React.Component {

    constructor(){
        super();
        this.canvasRef = React.createRef()
        this.imgRef = React.createRef()
    }

    componentDidMount(){
        const canvas = this.canvasRef.current
        const context = canvas.getContext("2d")
        const img = this.imgRef.current

        //Fixing canvas blur --> source: https://medium.com/wdstack/fixing-html5-2d-canvas-blur-8ebe27db07da
        const dpi = window.devicePixelRatio
        let style_height = +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
        let style_width = +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
        canvas.setAttribute('height', style_height * dpi);
        canvas.setAttribute('width', style_width * dpi);
        //end of source

        img.onload = () => {
            context.drawImage(img, 0,0, canvas.width, canvas.height);
          }
    }

    renderCaption(captionText, captionPosition_X, captionPosition_Y) {

        let style = {};
        if(captionPosition_X !== undefined && captionPosition_Y !== undefined) {
            style = {
                left: captionPosition_X+"%",
                top: captionPosition_Y+"%",
            };
        }

        return (
            <p className="top" style={style}>{captionText}</p>
        );
    }

    render() {

        const captionPositions_X = this.props.captionPositions_X;
        const captionPositions_Y = this.props.captionPositions_Y;

        let captions = this.props.captions
            .map((captionText, index) => this.renderCaption(
                captionText,
                captionPositions_X[index],
                captionPositions_Y[index]
            ));

        return (
            <div className="flex-container">
                <h1>{this.props.title}</h1>
                <div className="container">
                    <canvas ref={this.canvasRef} />
                    <img ref={this.imgRef} src={this.props.image.url} style={{display: "none"}}/>
                    {captions}
                </div>
            </div>
        )
    }
}

ImageCarousel.propTypes = {
    image: PropTypes.object.isRequired,
    captions: PropTypes.array.isRequired,
    captionPositions_X: PropTypes.array.isRequired,
    captionPositions_Y: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
}