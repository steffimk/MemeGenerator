import React from 'react';
import './SingleImage.css'
import {Link} from "react-router-dom";

export default class SingleImage extends React.Component {

    render() {
        if(this.props.id !== undefined && this.props.images !== undefined && this.props.images.length > 0) {
            const image_index = this.props.images.findIndex((image) => image._id === this.props.id);
            const parentRoute = this.props.parentRoute
            if(image_index >= 0) {
                // image to view
                let image = this.props.images[image_index];
                let prev_image = this.props.images[image_index > 1 ? image_index - 1 : this.props.images.length - 1];
                let next_image = this.props.images[image_index < this.props.images.length - 1 ? image_index + 1 : 0];
                const imageSrc = image.img ? image.img : image.url

                console.log("image log", image)
                return (
                    <Link to="."> {/* relative link up one level*/}
                        <div className="modal">
                            <h1 className="modal-title">{image.name}</h1>
                            <Link className="modal-nav modal-left" to={parentRoute + prev_image._id}/>
                            <img src={imageSrc} alt={image.name}/>
                            <Link className="modal-nav modal-right" to={parentRoute + next_image._id}/>
                        </div>
                    </Link>
                )
            }else{
                return (
                    <Link to="."> {/* relative link up one level*/}
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