import React from 'react';
import './SingleImage.css'
import {Link} from "react-router-dom";
import AudioDescription from '../textToSpeech/AudioDescription';
import CommentIcon from '@material-ui/icons/Comment';
import { Fab } from '@material-ui/core';
import Comments from './Comments';
export default class SingleImage extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            openComments: false,
            comments: [{username: "TestPerson", comment: "Test Nachricht 1", date: Date()},
            {username: "User", comment: "Test Nachricht 2", date: Date()},
            {username: "MaxMuster", comment: "Test Nachricht 3", date: Date()}, 
            {username: "TestPerson", comment: "Test Nachricht 4", date: Date()}, 
            {username: "User", comment: "Test Nachricht 5", date: Date()},  
            {username: "MaxMuster", comment: "Test Nachricht 6", date: Date()}]
        }
    }

    setComments = (areOpen) => this.setState({ openComments: areOpen })

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
                            <Fab size="small" onClick={() => this.setComments(true)}>
                                <CommentIcon/>
                            </Fab>
                        </h1>
                        <Link to="."> {/* relative link up one level*/}
                            <Link className="modal-nav modal-left" to={"/gallery/" + prev_image.id}/>
                            <img src={image.img} alt={image.name}/>
                            <Link className="modal-nav modal-right" to={"/gallery/" + next_image.id}/>
                        </Link>
                        <Comments open={this.state.openComments} comments={this.state.comments} handleClose={() => this.setComments(false)}/>
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