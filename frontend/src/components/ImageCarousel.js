import React from 'react';
import PropTypes from 'prop-types';

import './ImageCarousel.css'

export default class ImageCarousel extends React.Component {

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
                    <img src={this.props.image.url} alt={this.props.image.name}/>
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