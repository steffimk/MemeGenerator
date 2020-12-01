import React from 'react';
import PropTypes from 'prop-types';

import './ImageCarousel.css'

export default class ImageCarousel extends React.Component {

    render(){
        return (
            <div className="container">
                <img src={this.props.image.url}/>
                <p className="top">{this.props.captions[0]}</p>
                <p className="bottom">{this.props.captions[1]}</p>
            </div>
        )
    }
}

ImageCarousel.propTypes = {

}