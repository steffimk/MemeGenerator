import React from 'react';
import PropTypes from 'prop-types';

import './ImageCarousel.css'
/**
 * View of the meme template being edited. Part of the editor.
 */
export default class ImageCarousel extends React.Component {

    constructor(props){
        super(props);
        this.canvasRef = React.createRef()
        this.imgRef = React.createRef()
        this.containerRef = React.createRef()
        this.addedImgRefs = []
        props.addedImages.forEach( _ =>
            this.addedImgRefs.push(React.createRef())
        )
    }

    /**
     * Calculates the canvas size to take in as much space as possible and to fit to the image ratio.
     * Only gets called if the image size has not been set yet
     * @param {number} imgWidth 
     * @param {number} imgHeight 
     */
    setCanvasSize(imgWidth, imgHeight){
        // Calculate new width and height to maintain aspect ratio of image but fit on page
        const imgRatio = imgWidth / imgHeight
        if (this.containerRef.current == null) return
        console.log("Container width: " + this.containerRef.current.offsetWidth + " window height: " + window.innerHeight)
        var width = this.containerRef.current.offsetWidth * 0.97 // Fit to fill 97% of width of container
        var height = width / imgRatio;
        if (height > (window.innerHeight * 0.8)) {    // If too high -> fit to fill 80% of height of window 
            height = window.innerHeight * 0.8
            width = height * imgRatio
        }
        try {
            const context = this.canvasRef.getContext("2d")
            context.clearRect(0, 0, this.props.canvasSize.width, this.props.canvasSize.height)
        } catch (e) {
            console.log("Problem finding context: " + e)
        }
        this.props.setCanvasSize({width: width, height: height})
    }

    componentDidMount(){
        const img = this.imgRef.current
        
        img.onload = () => {
            if (this.props.imageInfo.size != null) return
            this.setCanvasSize(img.width, img.height)
        }
    }

    /**
     * If an image loaded: Trigger new rendering of the component
     */
    componentDidUpdate() {
        console.log("Updating ImageCarousel")
        this.addedImgRefs.forEach (imgRef => {
            if (!imgRef.current) return
            imgRef.current.onload = () => this.setState({})
        })
    }

    /**
     * Clears the canvas, renders the images
     */
    renderCanvas() {
        const canvas = this.canvasRef.current
        if (!canvas) return // if canvas is not existing yet
        const context = canvas.getContext("2d")
        const canvasWidth = this.props.canvasSize.width
        const canvasHeight = this.props.canvasSize.height
        // Fixing canvas blur
        const dpi = window.devicePixelRatio
        canvas.setAttribute('height', canvasHeight * dpi);
        canvas.setAttribute('width', canvasWidth * dpi);

        context.clearRect(0, 0, canvasWidth, canvasHeight)
        const mainImg = this.imgRef.current
        // Draw main image
        if(this.props.imageInfo.size != null){
            const imgWidth = mainImg.width*this.props.imageInfo.size/100
            const imgHeight = mainImg.height*this.props.imageInfo.size/100
            context.drawImage(
                this.imgRef.current,
                this.props.imageInfo.x * ((canvasWidth*dpi - imgWidth)/100),
                this.props.imageInfo.y * ((canvasHeight*dpi - imgHeight)/100),
                imgWidth, imgHeight)
        } else {
            const imgRatio = mainImg.width/mainImg.height
            context.drawImage(this.imgRef.current, 0, 0, canvasWidth*dpi, (canvasWidth*dpi)/imgRatio)
        }

        // Draw added images
        this.addedImgRefs.forEach(
            (imgRef, i) => {
                const img = imgRef.current
                if (!img) return
                console.log("drawing added image nr. " + i)
                const imgWidth = img.width*this.props.addedImgSizes[i]/100
                const imgHeight = img.height*this.props.addedImgSizes[i]/100
                context.drawImage(
                    img,
                    this.props.addedImgPositions_X[i] * ((canvasWidth*dpi - imgWidth)/100),
                    this.props.addedImgPositions_Y[i] * ((canvasHeight*dpi - imgHeight)/100),
                    imgWidth, imgHeight)
            })
    }

    /**
     * Draws the captions onto the canvas
     * @param {string} captionText 
     * @param {numbe} captionPosition_X 
     * @param {number} captionPosition_Y 
     */
    renderCaption(captionText, captionPosition_X, captionPosition_Y) {
        if (!this.canvasRef.current) return
        const context = this.canvasRef.current.getContext("2d")

        if(captionPosition_X !== undefined && captionPosition_Y !== undefined) {
            const italic = this.props.isItalic === true ? 'italic' : 'normal'
            const bold = this.props.isBold === true ? 'bold' : 'normal'
            context.font = italic + ' ' + bold + ' ' + this.props.fontSize + 'px sans-serif'
            context.fillStyle = this.props.fontColor
            const dpi = window.devicePixelRatio
            context.fillText(captionText, captionPosition_X * (this.props.canvasSize.width*dpi/100), 
                                captionPosition_Y * (this.props.canvasSize.height*dpi/100))
        }
    }

    render() {
        const captionPositions_X = this.props.captionPositions_X;
        const captionPositions_Y = this.props.captionPositions_Y;
        this.renderCanvas()
        this.props.captions
            .forEach((captionText, index) => this.renderCaption(
                captionText,
                captionPositions_X[index],
                captionPositions_Y[index]
            ));
        let addedImages = this.props.addedImages
            .map((image,index) => {
                const imgRef = this.addedImgRefs[index] ? this.addedImgRefs[index] : React.createRef()
                this.addedImgRefs[index] = imgRef
                return <img ref={imgRef} alt="" src={image.url} style={{display: "none"}}/>
            })

        return (
            <div ref={this.containerRef} className="flex-container">
                <h1>{this.props.title}</h1>
                <div className="container">
                    <canvas ref={this.canvasRef} 
                        style={{width:this.props.canvasSize.width, height:this.props.canvasSize.height, resize:"true"}}/>
                    <img ref={this.imgRef} alt="" src={this.props.image.url} style={{display: "none"}}/>
                    {addedImages}
                </div>
            </div>
        )
    }
}

ImageCarousel.propTypes = {
    image: PropTypes.object.isRequired,
    imageInfo: PropTypes.object.isRequired,
    captions: PropTypes.array.isRequired,
    captionPositions_X: PropTypes.array.isRequired,
    captionPositions_Y: PropTypes.array.isRequired,
    addedImages: PropTypes.array.isRequired,
    addedImgPositions_X: PropTypes.array.isRequired,
    addedImgPositions_Y: PropTypes.array.isRequired,
    addedImgSizes: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    isItalic: PropTypes.bool.isRequired,
    isBold: PropTypes.bool.isRequired,
    fontColor: PropTypes.string.isRequired,
    canvasSize: PropTypes.object.isRequired,
    setCanvasSize: PropTypes.func.isRequired
}