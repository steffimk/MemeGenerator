import React from 'react';
import './SingleImage.css'
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import AudioDescription from '../textToSpeech/AudioDescription';
import CommentIcon from '@material-ui/icons/Comment';
import { AppBar, Badge, Chip, Fab, Toolbar, Button } from '@material-ui/core';
import { LS_USERNAME } from '../../constants'
import FavoriteIcon from '@material-ui/icons/Favorite';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import RandomIcon from '@material-ui/icons/Shuffle';
import ClearIcon from '@material-ui/icons/Clear';
import FaceIcon from '@material-ui/icons/Face';
import Comments from './Comments';
import Likes from './Likes';
export default class SingleImage extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            openComments: false,
            openLikes: false
        }
    }

    setOpenComments = (areOpen) => this.setState({ openComments: areOpen })

    setOpenLikes = (areOpen) => this.setState({ openLikes: areOpen })

    getRandomId = () => {
        return this.props.images[Math.floor(Math.random() * this.props.images.length)].id;
    }

    timer = null;

    componentDidUpdate() {

        clearTimeout(this.timer);
        if(this.props.isPlaying) {
            this.timer = setTimeout(function () {
                if(this.props.isRandom) {
                    document.getElementById("randomButton").click();
                } else {
                    document.getElementById("nextLink").click();
                }
            }.bind(this), 4000);
        }

    }

    render() {
        if(this.props.id !== undefined && this.props.images !== undefined && this.props.images.length > 0) {
            const image_index = this.props.images.findIndex((image) => image.id === this.props.id);

            if(image_index >= 0) {
                // image to view
                let image = this.props.images[image_index];
                let prev_image = this.props.images[image_index > 1 ? image_index - 1 : this.props.images.length - 1];
                let next_image = this.props.images[image_index < this.props.images.length - 1 ? image_index + 1 : 0];
                // Likes of image
                let favIconColor = "primary"
                let likeCount = 0
                let likes = []
                if(image.likes) {
                    likes = image.likes
                    likeCount = image.likes.length
                    if (image.likes.includes(localStorage.getItem(LS_USERNAME))) favIconColor = "secondary"
                }

                return (
                    // <Link to="."> {/* relative link up one level*/}
                    <div className="modal">
                        <AppBar position="fixed" style={{ top: '0', bottom: 'auto', backgroundColor: 'rgba(0,0,0,0.9)' }}>
                            <Toolbar>
                                <h1 className="modal-title">{image.name}&nbsp;</h1>
                                <Link to=".">
                                    <Fab size = "small"
                                         color="white"
                                         style={{marginRight: '30px'}}
                                         onClick={this.props.stopPlaying}>
                                        <ClearIcon/>
                                    </Fab>
                                </Link>
                            </Toolbar>
                        </AppBar>

                        <Link className="modal-nav modal-left" to={"/gallery/" + prev_image.id}/>
                        <img
                            src={image.img}
                            alt={image.name}
                            style={{ height: window.innerHeight * 0.8, width: 'auto', marginTop: '100px', marginBottom: '100px'}}
                        />
                        <Link id="nextLink" className="modal-nav modal-right" to={"/gallery/" + next_image.id}/>

                        <AppBar position="fixed" style={{ top: 'auto', bottom: '0', backgroundColor: 'rgba(0,0,0,0.9)' }}>
                            <Toolbar>
                                <Fab size = "small"
                                     color="white"
                                     style={{ marginLeft: window.innerWidth * 0.3, marginRight: "20px" }}
                                     onClick={this.props.changePlaying}>
                                    {this.props.isPlaying? <PauseIcon/> : <PlayIcon/>}
                                </Fab>
                                <Fab size = "small"
                                     color="white"
                                     style={{marginRight: "20px" }}
                                     onClick={this.props.changeRandom}>
                                    <RandomIcon color={this.props.isRandom? "primary" : "black"}/>
                                </Fab>
                                <Link id="randomButton"
                                      className="modal-shuffle"
                                      style={{marginRight: "211px" }}
                                      to={"/gallery/"+ this.getRandomId()}>
                                    <Button
                                        name="random"
                                        variant="contained"
                                        size="small"
                                        color="primary">
                                        Shuffle
                                    </Button>
                                </Link>
                                <Chip
                                    icon={<FaceIcon style={{color: 'white'}}/>}
                                    label="Liked by..."
                                    onClick={() => this.setOpenLikes(true)}
                                    style={{marginRight: '10px', color: 'white', backgroundColor: 'dimgray' }}
                                />
                                <Badge badgeContent={likeCount} max={999} color={favIconColor} style={{ marginRight: '20px' }}>
                                    <Fab size="small" color="white" onClick={() => this.props.likeImage(image._id)}>
                                        <FavoriteIcon color={favIconColor} />
                                    </Fab>
                                </Badge>
                                <Fab size="small" onClick={() => this.setOpenComments(true)} style={{ marginRight: '20px' }}>
                                    <CommentIcon />
                                </Fab>
                                <Fab size="small">
                                    <AudioDescription
                                        isEditor={false}
                                        imageDescription={image.imageDescription}
                                        imageName={image.name}
                                        captions={image.captions}
                                    />
                                </Fab>
                            </Toolbar>
                        </AppBar>
                    <Comments
                      open={this.state.openComments}
                      meme={image}
                      handleClose={() => this.setOpenComments(false)}
                      isNotAuthenticated={this.props.isNotAuthenticated}
                    />
                    <Likes open={this.state.openLikes} likes={likes} handleClose={() => this.setOpenLikes(false)}/>
                  </div>
                );
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

SingleImage.propTypes = {
    images: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    isNotAuthenticated: PropTypes.func.isRequired,
    likeImage: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    playIcon: PropTypes.string.isRequired,
    isRandom: PropTypes.bool.isRequired,
    changePlaying: PropTypes.func.isRequired,
    stopPlaying: PropTypes.func.isRequired,
    changeRandom: PropTypes.func.isRequired
}