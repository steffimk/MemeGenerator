import React from 'react';
import './Gallery.css';
import { Redirect } from 'react-router-dom'
import CustomAppBar from '../CustomAppBar/CustomAppBar';
import {Link, withRouter} from "react-router-dom";
import SingleImage, { downloadImage } from "./SingleImage";
import { authorizedFetch, viewMeme, LIKE_ENDPOINT, MEMES_ENDPOINT } from '../../communication/requests';
import { LS_USERNAME } from '../../constants'
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Badge, ButtonGroup, Fab, Tooltip } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CommentIcon from '@material-ui/icons/Comment';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ShareIcon from '@material-ui/icons/Share';
import ShareDialog from '../shareDialog/Share';
import SearchDialog from "../search/SearchDialog";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';


class Gallery extends React.Component {

  constructor() {
    super();
    this.state = {
      isAuthenticated: true,
      // contains all images without filters
      all_images: [],
      // contains the creation_time of the most current image
      all_images_max_creation_time: Date.now(),
      // contains the creation_time of the oldest image
      all_images_min_creation_time: 0,
      // contains images filtered/ordered as defined in search
      images: [],
      searchOpen: false,
      likedMemeIds: [],
      isPlaying: false,
      playIcon: 'fas fa-fw fa-play',
      isRandom: false,
      openShare: false,
      currentShareId: undefined
    };
  }

  componentDidMount() {
    this.get_memes();
  }

  isNotAuthenticated = () => this.setState({ isAuthenticated: false });

  openShare = (id) => this.setState({ openShare: true, currentShareId: id });

  componentDidUpdate(prevProps, prevState, snapshot) {
    // after leaving single image view, scroll to the position of the last image in the gallery
    const { id } = this.props.match.params;
    const prevId = prevProps.match.params.id;

    if (prevId !== undefined && id === undefined) {
      try {
        document.getElementById(prevId).scrollIntoView();
      } catch (e) {
        // this could happen e.g. if the prevId was invalid or is currently not shown in the gallery
        console.log(e);
      }
    }
  }

    get_memes() {
        authorizedFetch(MEMES_ENDPOINT, 'GET', {}, this.isNotAuthenticated)
        .then(json => {
            let times = json.data.memes
                .map((meme) => meme.creation_time)
                .filter(Boolean);	// this filters undefined values as undefined is falsy

            let max = Math.max(...times);
            let min = Math.min(...times);

            this.setState({
                'all_images_max_creation_time': max,
                'all_images_min_creation_time': min,
                'all_images': json.data.memes,
                'images': json.data.memes,
            })
            this.getLikedMemeIds(json.data.memes, localStorage.getItem(LS_USERNAME))
        });
    }

    getLikedMemeIds(memes, username) {
        if (username && memes.length > 0){
            const likedMemeIds = memes
              .filter((meme) => meme.likes && meme.likes.map((like) => like.username).includes(username)) // meme has likes and they include this user
              .map((meme) => meme._id);
            this.setState({ likedMemeIds: likedMemeIds })
            console.log("likedMemeIds: " + likedMemeIds)
        }
    }

  handleChangePlaying = () => {
    this.setState({ isPlaying: !this.state.isPlaying });
  };

  handleStopPlaying = () => {
    this.setState({ isPlaying: false });
  };

  handleChangeRandom = () => {
    this.setState({ isRandom: !this.state.isRandom });
  };

  render() {
    // If not logged in: Redirect to login page
    if (!this.state.isAuthenticated) return <Redirect to="/login" />;

    // try to get image id from url
    const { id } = this.props.match.params;
    const image_index = this.state.images.findIndex((image) => image.id === id);

    let gallery_style = {};
    if (image_index >= 0) {
      // if an image is selected and exists in images, prevent scrolling of the gallery
      gallery_style = {
        height: '100%',
        overflow: 'hidden',
      };
    }

    let images = this.state.images.map((e) => this.renderImage(e, this.props.location.pathname));
    let slices = distributeImagesToColumns(images);

        return (
          <div>
            <CustomAppBar>
                <IconButton
                    color="inherit"
                    aria-label="Search, sort and Filter"
                    onClick={() => this.setState({'searchOpen': true})}
                >
                    <SearchIcon />
                </IconButton>
            </CustomAppBar>
            <div className="gallery-container">
              <div className="image-gallery" style={gallery_style}>
                <div className="column">
                  <Link to="/editor" className="image-container create-meme">
                    <h1>+</h1>
                    <p>Create new Meme</p>
                  </Link>
                  {slices[0]}
                </div>
                <div>
                  {this.state.images.length < 1 && (
                    <h1>There are no memes created and published until now. Be the first one!</h1>
                  )}
                </div>
                <div className="column">{slices[1]}</div>
                <div className="column">{slices[2]}</div>
                <div className="column">{slices[3]}</div>
              </div>
              <SingleImage
                images={this.state.images}
                id={id}
                isNotAuthenticated={this.isNotAuthenticated}
                likeImage={this.likeImage}
                parentRoute=""
                isPlaying={this.state.isPlaying}
                playIcon={this.state.playIcon}
                isRandom={this.state.isRandom}
                changePlaying={this.handleChangePlaying}
                stopPlaying={this.handleStopPlaying}
                changeRandom={this.handleChangeRandom}
                viewMeme={this.viewMeme}
              />
              <ShareDialog
                open={this.state.openShare}
                handleClose={() => this.setState({ openShare: false })}
                imageId={this.state.currentShareId}
                isGallery={true}
              />
            </div>
            <SearchDialog
                 open={this.state.searchOpen}
                 onClose={() => {this.setState({searchOpen: false})}}
                 onChange={(searchParams) => {this.onSearchChange(searchParams)}}
                 max={this.state.all_images_max_creation_time}
                 min={this.state.all_images_min_creation_time}
            />
          </div>
        );
    }

  renderImage(image, currentRoute) {
    let imageRoute;
    if (currentRoute.slice(-1) === '/') {
      imageRoute = currentRoute + image._id;
    } else {
      imageRoute = currentRoute + '/' + image._id;
    }
    let favIconColor = 'primary';
    const likeCount = image.likes ? image.likes.length : 0;
    const commentCount = image.comments ? image.comments.length : 0;
    const viewCount = image.views ? image.views : 0;
    if (this.state.likedMemeIds.includes(image._id)) favIconColor = 'secondary';
    return (
      <div className="image-container" id={image._id}>
        <Link to={imageRoute} key={image._id} onClick={() => this.viewMeme(image._id)}>
          <img src={image.img} alt={image.name} />
        </Link>
        <div className="image-title">
          &nbsp;&nbsp;{image.name}
          <ButtonGroup style={{ marginTop: '10px' }}>
            <Tooltip title="Views">
              <Badge badgeContent={viewCount} max={999} color="primary" style={{ marginRight: '20px' }}>
                <Fab size="small">
                  <VisibilityIcon />
                </Fab>
              </Badge>
            </Tooltip>
            <Badge badgeContent={likeCount} max={999} color={favIconColor} style={{ marginRight: '20px' }}>
              <Fab size="small" color="white" aria-label="like" onClick={() => this.likeImage(image._id, (favIconColor === "secondary"))}>
                <FavoriteIcon color={favIconColor} />
              </Fab>
            </Badge>
            <Badge badgeContent={commentCount} max={99} color="primary" style={{ marginRight: '20px' }}>
              <Link to={imageRoute} key={image._id}>
                <Fab size="small">
                  <CommentIcon color="primary" />
                </Fab>
              </Link>
            </Badge>
            <Badge>
              <Fab size="small" onClick={() => downloadImage(image.img)} style={{ marginRight: '20px' }}>
                <CloudDownloadIcon />
              </Fab>
            </Badge>
            <Badge>
              <Fab size="small" onClick={() => this.openShare(image._id)}>
                <ShareIcon />
              </Fab>
            </Badge>
          </ButtonGroup>
        </div>
      </div>
    );
  }

    viewMeme = (id) => {
        viewMeme(id, Date.now(), this.isNotAuthenticated);
        let newImages = this.state.images.map((img) => {
            if (img._id === id) {
                if (img.views) {
                    img.views.push(Date.now());
                } else {
                    img.views = [Date.now()];
                }
            }
            return img;
        });
        this.setState({ images: newImages });
    };

    likeImage = (id, isDislike) => {
        const username = localStorage.getItem(LS_USERNAME)
        const like = {username: username, date: Date.now(), isDislike: isDislike}
        authorizedFetch(LIKE_ENDPOINT, 'POST', JSON.stringify({memeId: id, like: like}), this.isNotAuthenticated)
        .catch((error) => { console.error('Error:', error) });
        let newImages = this.state.images.map(img => {
            if(img._id === id) {
                if (img.likes && img.likes.users && img.likes.users.includes(username) && isDislike) {
                    img.likes.users.splice(img.likes.users.indexOf(username),1) // Remove username from likes
                    // Do nothing. User alredy likes meme.
                } else if (img.likes.users && !isDislike) {
                    img.likes.users.push(username)
                } else if (!isDislike) {
                    img.likes.users = [username]
                }
            }
            return img
        })
        var newLikedMemeIds = this.state.likedMemeIds
        if (isDislike && newLikedMemeIds.includes(id)) {
            newLikedMemeIds.splice(newLikedMemeIds.indexOf(id),1)
        } else if (!isDislike && !newLikedMemeIds.includes(id)) {
            newLikedMemeIds.push(id)
        }
        this.setState({ images: newImages, likedMemeIds: newLikedMemeIds })
    }

    onSearchChange(searchParams) {
        let filteredImages = this.state.all_images.filter((value, index, list) => {
            return !value.hasOwnProperty("creation_time") || (value.hasOwnProperty("creation_time") &&
                value.creation_time < Math.max(...searchParams.timeRange) &&
                value.creation_time > Math.min(...searchParams.timeRange))
        })

        filteredImages.sort((a, b) => {
            let order = 1;
            if(a._id < b._id){
                order = -1;
            }else{
                order = 1;
            }
            return order * (searchParams.order ? 1 : -1);
        });

        this.setState({'images': filteredImages})
    }
}

/*
    This distributes images to 4 equally sized slices
     */
export function distributeImagesToColumns(images) {

    const n_columns = 4.0;
    let slices = [
        images.slice(0, images.length / n_columns),
        images.slice(images.length / n_columns, images.length / n_columns * 2),
        images.slice(images.length / n_columns * 2, images.length / n_columns * 3),
        images.slice(images.length / n_columns * 3, images.length),
    ];
    return slices;
}

export default withRouter(Gallery);
