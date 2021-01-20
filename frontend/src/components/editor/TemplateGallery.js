import React from 'react';
import PropTypes from 'prop-types';

import './TemplateGallery.css'

export default class TemplateGallery extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            imageKeyMouseHovering: undefined // id of image the mouse is hovering over
        }
    }

    setIsHovering = (e) => {
        if (e.type === "mouseenter") {
            this.setState({imageKeyMouseHovering: e._targetInst.key})
        } else if (e.type === "mouseleave") {
            if (this.state.imageKeyMouseHovering === e._targetInst.key) {
                this.setState({imageKeyMouseHovering: null})
            }
        }
    }

    getTitle(image) {
        if (image.id !== this.state.imageKeyMouseHovering) {
            return ""
        } else {
            return this.props.isInAddImageMode ? `Add ${image.name} to your meme` : `Use ${image.name} as template`
        }
    }

    renderImage(image) {
        return <img 
                src={image.url}
                onMouseEnter={this.setIsHovering}
                onMouseLeave={this.setIsHovering}
                onClick={this.props.changeCurrentImage.bind(this,image)}
                key={image.id}
                title={this.getTitle(image)}
                />
    }

    render(){
        const images = this.props.images.map((image) => this.renderImage(image))
        return (
            <div className="template-gallery">
                {this.props.isInAddImageMode && (
                    <h4>Select the image you want to add:</h4>
                )}
                {images}
            </div>
        )
    }
}

TemplateGallery.propTypes = {
    currentImage: PropTypes.object.isRequired,
    images: PropTypes.array.isRequired,
    changeCurrentImage: PropTypes.func.isRequired,
    isInAddImageMode: PropTypes.bool.isRequired
}