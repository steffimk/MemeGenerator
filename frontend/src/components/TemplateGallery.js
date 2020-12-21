import React from 'react';
import PropTypes from 'prop-types';

import './TemplateGallery.css'

export default class TemplateGallery extends React.Component {

    renderImage(image) {
        return <img 
                src={image.url}
                onClick={this.props.changeCurrentImage.bind(this,image)}
                key={image.id}
                />
    }

    render(){
        const images = this.props.images.map((image) => this.renderImage(image))
        return (
            <div className="image-gallery">
                {images}
            </div>
        )
    }
}

TemplateGallery.propTypes = {
    currentImage: PropTypes.object.isRequired,
    images: PropTypes.array.isRequired,
    changeCurrentImage: PropTypes.func.isRequired
}