import React from 'react';
import PropTypes from 'prop-types';

import './ImageCarousel.css'

export default class ImageCarousel extends React.Component {

    render(){
        return (
            <div className="container">
                <img src={this.props.image.url}/>
                <p className="top">{this.props.captionTop}</p>
                <p className="bottom">{this.props.captionBottom}</p>
            </div>
        )
    }
}

ImageCarousel.propTypes = {
    image: PropTypes.object.isRequired,
    captionTop: PropTypes.string.isRequired,
    captionBottom: PropTypes.string.isRequired,
}