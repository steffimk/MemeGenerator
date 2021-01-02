import React from 'react';
import './SingleImage.css'
import {Link} from "react-router-dom";

export default class SingleImage extends React.Component {

    render() {
        if(this.props.id !== undefined && this.props.images !== undefined && this.props.images.length > 0) {
            const image_index = this.props.images.findIndex((image) => image.id === this.props.id);

            if(image_index >= 0) {
                // image to view
                let image = this.props.images[image_index];
                let prev_image = this.props.images[image_index > 1 ? image_index - 1 : this.props.images.length - 1];
                let next_image = this.props.images[image_index < this.props.images.length - 1 ? image_index + 1 : 0];


                return (
                    <Link to="/gallery">
                        <div className="modal">
                            <h1 className="modal-title">{image.name}</h1>
                            <Link className="modal-nav modal-left" to={"/gallery/" + prev_image.id}/>
                            <img src={image.url} alt={image.name}/>
                            <Link className="modal-nav modal-right" to={"/gallery/" + next_image.id}/>
                        </div>
                    </Link>
                )
            }else{
                return (
                    <Link to="/gallery">
                        <div className="modal">
                            <h1 className="modal-title">404: This image could not be found :/</h1>
                        </div>
                    </Link>
                )
            }
        }else{
            return null;
        }
    }
}