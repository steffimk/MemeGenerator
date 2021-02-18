import React from 'react';
import './SingleImage.css'
import {Link} from "react-router-dom";
import AudioDescription from '../textToSpeech/AudioDescription';
import {Button} from "@material-ui/core";

export default class SingleImage extends React.Component {

    render() {
        if(this.props.id !== undefined && this.props.images !== undefined && this.props.images.length > 0) {
            const image_index = this.props.images.findIndex((image) => image.id === this.props.id);

            if(image_index >= 0) {
                // image to view
                let image = this.props.images[image_index];
                let prev_image = this.props.images[image_index > 1 ? image_index - 1 : this.props.images.length - 1];
                let next_image = this.props.images[image_index < this.props.images.length - 1 ? image_index + 1 : 0];


                console.log("image log", image)
                return (
                    // <Link to="."> {/* relative link up one level*/}
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
                            <Link className="modal-nav modal-left" to={"/gallery/" + prev_image.id}/>
                            <img src={image.img} alt={image.name}/>
                            <Link className="modal-nav modal-right" to={"/gallery/" + next_image.id}/>
                        </Link>
                        <Link className="modal-control" to={"/gallery/"+
                        this.props.images[Math.floor(Math.random() * this.props.images.length)].id}>
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
                    // </Link>
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