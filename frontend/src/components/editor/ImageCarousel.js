import React from 'react';
import PropTypes from 'prop-types';

import './ImageCarousel.css'
/**
 * View of the meme template being edited. Part of the editor.
 */
export default class ImageCarousel extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            canvasHeight: "90%",
            canvasWidth: "97%"
        }
        this.canvasRef = React.createRef()
        this.imgRef = React.createRef()
        this.containerRef = React.createRef()
        this.addedImgRefs = []
        props.addedImages.forEach( _ =>
            this.addedImgRefs.push(React.createRef())
        )
    }

    setImage(imgWidth, imgHeight, index = -1){
        // Calculate new width and height to maintain aspect ratio of image but fit on page
        const imgRatio = imgWidth / imgHeight
        if (this.containerRef.current == null){
            console.log("Container not found")
            return
        }
        console.log("Container width: " + this.containerRef.current.offsetWidth + " window height: " + window.innerHeight)
        var width = this.containerRef.current.offsetWidth * 0.97 // Fit to fill 97% of width of container
        var height = width / imgRatio;
        if (height > (window.innerHeight * 0.8)) {    // If too high -> fit to fill 80% of height of window 
            height = window.innerHeight * 0.8
            width = height * imgRatio
        }
        console.log("Canvas width: " + width + " canvas height: " + height)
        try {
            const context = this.canvasRef.getContext("2d")
            context.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight)
        } catch (e) {
            console.log("Problem finding context: " + e)
        }
        this.setState({ canvasWidth: width, canvasHeight: height }); // fresh rendering of component
    }

    componentDidMount(){
        const img = this.imgRef.current
        
        img.onload = () => {
            this.setImage(img.width, img.height)
        }

        this.addedImgRefs.forEach(
            (imgRef, index) =>
                imgRef.current.onload = () => {
                    this.setImage(img.width, img.height, index)
                }
        )
    }

    renderCanvas() {
        const canvas = this.canvasRef.current
        if (!canvas) return // Wenn Canvas noch nicht erstellt ist
        const context = canvas.getContext("2d")

        // Fixing canvas blur
        const dpi = window.devicePixelRatio
        canvas.setAttribute('height', this.state.canvasHeight * dpi);
        canvas.setAttribute('width', this.state.canvasWidth * dpi);

        context.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight)
        context.drawImage(this.imgRef.current, 0, 0, this.state.canvasWidth*dpi, this.state.canvasHeight*dpi)
    }

    renderCaption(captionText, captionPosition_X, captionPosition_Y) {

        const context = this.canvasRef.current.getContext("2d")

        if(captionPosition_X !== undefined && captionPosition_Y !== undefined) {
            const italic = this.props.isItalic === true ? 'italic' : 'normal'
            const bold = this.props.isBold === true ? 'bold' : 'normal'
            context.font = italic + ' ' + bold + ' ' + this.props.fontSize + 'px sans-serif'
            context.fillStyle = this.props.fontColor
            const dpi = window.devicePixelRatio
            context.fillText(captionText, captionPosition_X * (this.state.canvasWidth*dpi/100), 
                                captionPosition_Y * (this.state.canvasHeight*dpi/100))
        }
    }

    render() {
        const captionPositions_X = this.props.captionPositions_X;
        const captionPositions_Y = this.props.captionPositions_Y;
        this.renderCanvas()
        let captions = this.props.captions
            .map((captionText, index) => this.renderCaption(
                captionText,
                captionPositions_X[index],
                captionPositions_Y[index]
            ));
        console.log("Added images: " + this.props.addedImages.length)
        let addedImages = this.props.addedImages
            .map((image,index) => <img ref={this.addedImgRefs[index]} alt="" src={image.url} style={{display: "none"}}/>)

        return (
            <div ref={this.containerRef} className="flex-container">
                <h1>{this.props.title}</h1>
                <div className="container">
                    <canvas ref={this.canvasRef} style={{width:this.state.canvasWidth, height:this.state.canvasHeight}}/>
                    <img ref={this.imgRef} alt="" src={this.props.image.url} style={{display: "none"}}/>
                    {captions}
                    {addedImages}
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
    addedImages: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    isItalic: PropTypes.bool.isRequired,
    isBold: PropTypes.bool.isRequired,
    fontColor: PropTypes.string.isRequired
}