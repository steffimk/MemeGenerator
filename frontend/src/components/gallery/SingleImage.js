import React from 'react';
import './SingleImage.css'
import {Link} from "react-router-dom";
import AudioDescription from '../textToSpeech/AudioDescription';
import {Button} from "@material-ui/core";

export default class SingleImage extends React.Component {

    getRandomId = () => {
        return this.props.images[Math.floor(Math.random() * this.props.images.length)]._id;
    }

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
                    <div className="modal">
                        <h1 className="modal-title">{image.name}&nbsp;
                            <AudioDescription 
                                isEditor={false} 
                                imageDescription={image.imageDescription}
                                imageName={image.name}
                                captions={image.captions}
                            />
                        </h1>
                        <Link to="."> {/* relative link up one level*/}
                            <Link className="modal-nav modal-left" to={parentRoute + prev_image._id}/>
                            <img src={imageSrc} alt={image.name}/>
                            <Link className="modal-nav modal-right" to={parentRoute + next_image._id}/>
                        </Link>
                        <Link className="modal-control" to={parentRoute + this.getRandomId()}>
                            <Button
                                name="random"
                                variant="contained"
                                size="small"
                                color="primary"
                                style= {{ marginTop: '10px', marginLeft: '10px', display: 'block' }}>
                                Shuffle
                            </Button>
                        </Link>
                    </div>
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