import React from 'react';
import './SingleImage.css'
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import AudioDescription from '../textToSpeech/AudioDescription';
import CommentIcon from '@material-ui/icons/Comment';
import { AppBar, Badge, Chip, Fab, Toolbar, Button } from '@material-ui/core';
import { LS_USERNAME } from '../../constants'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FaceIcon from '@material-ui/icons/Face'
import ShareIcon from '@material-ui/icons/Share';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import RandomIcon from '@material-ui/icons/Shuffle';
import ClearIcon from '@material-ui/icons/Clear';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import Comments from './Comments';
import Likes from './Likes';
import ShareDialog from '../shareDialog/Share';
import ChartsDialog from "../chartsDialog/ChartsDialog";

/**
 * Single image view in gallery of published memes
 */
export default class SingleImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openComments: false,
      openLikes: false,
      openShare: false,
      openCharts: false
    };
  }

  //Setting open states for Dialogs
  setOpenComments = (areOpen) => this.setState({ openComments: areOpen });
  setOpenLikes = (areOpen) => this.setState({ openLikes: areOpen });
  setOpenShare = (areOpen) => this.setState({ openShare: areOpen });
  setOpenCharts = (areOpen) => this.setState({openCharts: areOpen});

  //Random id to get random next image (Shuffle button or play button with random choosen)
  getRandomId = () => {
    return this.props.images[Math.floor(Math.random() * this.props.images.length)]._id;
  };

  timer = null;

  /**
  * When component did update and in playing mode set new timer to four seconds and get next image after that
  */
  componentDidUpdate() {
    //For playing (play button)
    clearTimeout(this.timer);
    if (this.props.isPlaying) {
      this.timer = setTimeout(
        function () {
          if (this.props.isRandom) {
            document.getElementById('randomButton').click();
          } else {
            document.getElementById('nextLink').click();
          }
        }.bind(this),
        4000
      );
    }
  }

  render() {
    if (this.props.id !== undefined && this.props.images !== undefined && this.props.images.length > 0) {
      const image_index = this.props.images.findIndex((image) => image._id === this.props.id);
      const parentRoute = this.props.parentRoute;
      const isGallery = parentRoute === '';
      if (image_index >= 0) {
        // image to view
        let image = this.props.images[image_index];
        let prev_image = this.props.images[image_index > 1 ? image_index - 1 : this.props.images.length - 1];
        let next_image = this.props.images[image_index < this.props.images.length - 1 ? image_index + 1 : 0];
        const imageSrc = image.img ? image.img : image.url;
        // Likes of image
        let favIconColor = 'primary';
        let likeCount = 0;
        let likes = [];
        if (image.likes) {
          likes = image.likes;
          likeCount = image.likes.length;
          if (image.likes.includes(localStorage.getItem(LS_USERNAME))) favIconColor = 'secondary';
        }
        //like logs, creation time and views for charts
        let likeLogs = image.likeLogs ? image.likeLogs : [];
        let creation_time = image.creation_time;
        let views = image.views;

        let nextRandom = this.getRandomId();
        return (
          <div className="modal">
            {/*Upper toolbar with title and close button*/}
            <AppBar position="fixed" style={{ top: '0', bottom: 'auto', backgroundColor: 'rgba(0,0,0,0.9)' }}>
              <Toolbar>
                <h1 className="modal-title">{image.name}</h1>
                <Link to=".">
                  <Fab size="small" color="white" style={{ marginRight: '30px' }} onClick={() => this.props.stopPlaying}>
                    <ClearIcon />
                  </Fab>
                </Link>
              </Toolbar>
            </AppBar>
            {/*Meme Image and Left and Right Button*/}
            <Link
              className="modal-nav modal-left"
              to={parentRoute + prev_image._id}
              onClick={() => this.props.viewMeme(prev_image._id, Date.now())}
            />
            <img
              src={imageSrc}
              alt={image.name}
              style={{ height: window.innerHeight * 0.8, width: 'auto', marginTop: '100px', marginBottom: '100px' }}
            />
            <Link
              id="nextLink"
              className="modal-nav modal-right"
              to={parentRoute + next_image._id}
              onClick={() => this.props.viewMeme(next_image._id, Date.now())}
            />
            {/*bottom toolbar with buttons for playing, random playing, shuffle, show username of likes, like, comment,
            statistic charts, download, share, audio description*/}
            <AppBar position="fixed" style={{ top: 'auto', bottom: '0', backgroundColor: 'rgba(0,0,0,0.9)' }}>
              <Toolbar>
                {isGallery && (
                  <div>
                    <Fab
                      size="small"
                      color="white"
                      style={{ marginLeft: window.innerWidth * 0.15, marginRight: '20px' }}
                      onClick={this.props.changePlaying}>
                      {this.props.isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </Fab>
                    <Fab size="small" color="white" style={{ marginRight: '20px' }} onClick={this.props.changeRandom}>
                      <RandomIcon color={this.props.isRandom ? 'primary' : 'black'} />
                    </Fab>
                  </div>
                )}
                <Link
                  className="modal-shuffle"
                  style={{ marginRight: '200px', marginLeft: isGallery ? '' : window.innerWidth * 0.2 }}
                  to={parentRoute + nextRandom}>
                  <Button name="random"
                          variant="contained"
                          size="small"
                          color="primary"
                          id="randomButton"
                          onClick={() => {
                              console.log("next random ", nextRandom);
                              this.props.viewMeme(nextRandom, Date.now())
                          }}>
                    Shuffle
                  </Button>
                </Link>
                <Chip
                  icon={<FaceIcon style={{ color: 'white' }} />}
                  label="Liked by..."
                  onClick={() => this.setOpenLikes(true)}
                  style={{
                    marginRight: '10px',
                    color: 'white',
                    backgroundColor: 'dimgray',
                  }}
                />
                <Badge badgeContent={likeCount} max={999} color={favIconColor} style={{ marginRight: '20px' }}>
                  <Fab size="small" color="white" onClick={() => this.props.likeImage(image._id, (favIconColor==="secondary"))}>
                    <FavoriteIcon color={favIconColor} />
                  </Fab>
                </Badge>
                <Fab size="small" onClick={() => this.setOpenComments(true)} style={{ marginRight: '20px' }}>
                  <CommentIcon />
                </Fab>
                <Fab size="small" onClick={() => this.setOpenCharts(true)} style={{marginRight: '20px'}}>
                  <ShowChartIcon />
                </Fab>
                <Fab size="small" onClick={() => downloadImage(imageSrc)} style={{ marginRight: '20px' }}>
                  <CloudDownloadIcon />
                </Fab>
                <Fab size="small" onClick={() => this.setOpenShare(true)} style={{ marginRight: '20px' }}>
                  <ShareIcon />
                </Fab>
                <Fab size="small" style={{ marginRight: '130px' }}>
                  <AudioDescription
                    isEditor={false}
                    imageDescription={image.imageDescription}
                    imageName={image.name}
                    captions={image.captions}
                  />
                </Fab>
              </Toolbar>
            </AppBar>
            {/*Dialogs*/}
            <Comments
              open={this.state.openComments}
              meme={image}
              handleClose={() => this.setOpenComments(false)}
              isNotAuthenticated={this.props.isNotAuthenticated}
            />
            <Likes open={this.state.openLikes} likes={likes} handleClose={() => this.setOpenLikes(false)} />
            <ShareDialog
              open={this.state.openShare}
              handleClose={() => this.setOpenShare(false)}
              imageId={image._id}
              isGallery={isGallery}
            />
            <ChartsDialog
                open={this.state.openCharts}
                handleClose={() => this.setOpenCharts(false)}
                likes={likeLogs}
                creation_time={creation_time}
                views={views}
            />
          </div>
        );
      } else {
        return (
          <Link to=".">
            {' '}
            {/* relative link up one level*/}
            <div className="modal">
              <h1 className="modal-title">404: This image could not be found :/</h1>
            </div>
          </Link>
        );
      }
    } else {
      return null;
    }
  }
}

/**
 * Download shown image
 * @param imageSrc source of image
 */
export const downloadImage = (imageSrc) => {
  var downloadLink = document.createElement('a');
  downloadLink.href = imageSrc;
  downloadLink.download = 'Meme.jpg';
  downloadLink.click();
};

SingleImage.propTypes = {
    images: PropTypes.array.isRequired,
    viewMeme: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    isNotAuthenticated: PropTypes.func.isRequired,
    likeImage: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool,
    playIcon: PropTypes.string,
    isRandom: PropTypes.bool,
    changePlaying: PropTypes.func,
    stopPlaying: PropTypes.func,
    changeRandom: PropTypes.func
}