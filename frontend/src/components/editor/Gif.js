import React from 'react';
import PropTypes from 'prop-types';

export default class Gif extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <h1>{this.props.title}</h1>
                <img src={this.props.src} style={{width: this.props.width, height: this.props.height}} ></img>
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
    text: PropTypes.string,
    fontWeight: PropTypes.string, 
    fontSize: PropTypes.string,
    fontFamily: PropTypes.string,
    fontColor: PropTypes.string, 
    posX: PropTypes.number, 
    posY: PropTypes.number,
 };

 Gif.defaultProps = {
    width: '75%', 
    height: '75%',
 };