import React from 'react';
import PropTypes from 'prop-types';

/**
 * View of the gif template being edited. Part of the editor.
 */
export default class Gif extends React.Component {
    
    render() {
        console.log(this.props.src)
        return (
            <div>
                <h1>{this.props.title}</h1>
                <img src={this.props.src} alt={this.props.title}/>
            </div>
        );
    }

}

Gif.propTypes = {
    src: PropTypes.string,
    title: PropTypes.string,
 };

