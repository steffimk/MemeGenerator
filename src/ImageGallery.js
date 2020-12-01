import React from 'react';
import PropTypes from 'prop-types';

import './ImageGallery.css'

export default class ImageGallery extends React.Component {

    render(){
        const images = this.props.images.map((image) => (<img src={image.url}/>))
        return (
            <div className="image-gallery">
                {images}
            </div>
        )
    }
}

ImageGallery.propTypes = {

}