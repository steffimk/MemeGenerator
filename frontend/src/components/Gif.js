import React from 'react';
import PropTypes from 'prop-types';


export default class Gif extends React.Component {
    constructor(props){
        super(props);

        console.log("GGG"+ this.props.src);
    }

    render() {
        return (
            <div>
            <img src={this.props.src} style={{width:this.props.width, height:this.props.height}} ></img>
            {this.props.src}
            </div>
        );

    }

}

Gif.propTypes = {
    gif: PropTypes.string.isRequired,
    width: PropTypes.number, 
    height: PropTypes.number,
    src: PropTypes.array, 
    text: PropTypes.string,
    fontWeight: PropTypes.string, 
    fontSize: PropTypes.string,
    fontFamily: PropTypes.string,
    fontColor: PropTypes.string, 
    posX: PropTypes.number, 
    posY: PropTypes.number,
 };