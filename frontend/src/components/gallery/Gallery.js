import React from 'react';
import './Gallery.css';
import { Redirect } from 'react-router-dom'
import CustomAppBar from '../CustomAppBar/CustomAppBar';
import {Link, withRouter} from "react-router-dom";
import SingleImage from "./SingleImage";
import { authorizedFetch, LIKE_ENDPOINT } from '../../communication/requests';
import { Badge, Fab } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { LS_USERNAME } from '../../constants'

const MEMES_ENDPOINT = "http://localhost:3030/memes/memes";

class Gallery extends React.Component {

    constructor() {
        super();
        this.state = {
            isAuthenticated: true,
            images: [],
            likedMemeIds: [],
            isPlaying: false,
            playIcon: "fas fa-fw fa-play",
            isRandom: false
        };
    }

    componentDidMount(){
        this.get_memes();
    }

    isNotAuthenticated = () => {
        this.setState({ isAuthenticated: false})
      }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // after leaving single image view, scroll to the position of the last image in the gallery
        const { id } = this.props.match.params;
        const prevId = prevProps.match.params.id;

        if(prevId !== undefined && id === undefined){
            try {
                document.getElementById(prevId).scrollIntoView();
            } catch (e){
                // this could happen e.g. if the prevId was invalid or is currently not shown in the gallery
                console.log(e)
            }
        }
    }

    get_memes() {
        authorizedFetch(MEMES_ENDPOINT, 'GET', {}, this.isNotAuthenticated)
        .then(json => {
            console.log(json.data);
            this.setState({
                'images': json.data.memes
            })
            this.getLikedMemeIds(json.data.memes, localStorage.getItem(LS_USERNAME))
        });
    }

    getLikedMemeIds(memes, username) {
        if (username && memes.length > 0){
            const likedMemeIds = memes
              .filter((meme) => meme.likes && meme.likes.includes(username)) // meme has likes and they include this user
              .map((meme) => meme._id);
            this.setState({ likedMemeIds: likedMemeIds })
            console.log("likedMemeIds: " + likedMemeIds)
        }
    }

    handleChange = (event) => {
        const className = event.target.className;
        if(className.includes("play") || className.includes("pause")) {
            this.setState({isPlaying: !this.state.isPlaying,
                                playIcon: !this.state.isPlaying ? "fas fa-fw fa-pause" : "fas fa-fw fa-play"})
        } else if(className.includes("random")) {
            this.setState({isRandom : !this.state.isRandom});
        } else if(className.includes("times")) {
            this.setState({isPlaying : false, playIcon: "fas fa-fw fa-play"})
        }
    }

    render() {
        // If not logged in: Redirect to login page
        if (!this.state.isAuthenticated) return <Redirect to='/login'/>

        // try to get image id from url
        const { id } = this.props.match.params;
        const image_index = this.state.images.findIndex((image) => image.id === id);

        let gallery_style = {};
        if(image_index >= 0){
            // if an image is selected and exists in images, prevent scrolling of the gallery
            gallery_style = {
                height: "100%",
                overflow: "hidden"
            }
        }

        let images = this.state.images.map(
            (e) => this.renderImage(e, this.props.location.pathname)
        );
        let slices = distributeImagesToColumns(images);

        return (
          <div>
            <CustomAppBar></CustomAppBar>
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
                        {this.state.images.length < 1 &&
                            <h1>There are no memes created and published until now. Be the first one!</h1>
                        }
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
                isPlaying={this.state.isPlaying}
                playIcon={this.state.playIcon}
                isRandom={this.state.isRandom}
                changeListener={this.handleChange}
              />
            </div>
          </div>
        );
    }


    renderImage(image, currentRoute) {
        let imageRoute;
        if(currentRoute.slice(-1) === '/'){
            imageRoute = currentRoute+image.id;
        }else{
            imageRoute = currentRoute+"/"+image.id;
        }
        let favIconColor = "primary"
        const likeCount = image.likes ? image.likes.length : 0
        if (this.state.likedMemeIds.includes(image._id)) favIconColor = "secondary"
        return (
          <div className="image-container" id={image._id}>
            <Link to={imageRoute} key={image._id}>
              <img src={image.img} alt={image.name} />
            </Link>
            <div className="image-title">
              &nbsp;&nbsp;{image.name}
              <Badge badgeContent={likeCount} max={999} color={favIconColor} style={fabStyle}>
                <Fab
                  size="small"
                  color="white"
                  aria-label="like"
                  onClick={() => this.likeImage(image._id)}>
                  <FavoriteIcon color={favIconColor} />
                </Fab>
              </Badge>
            </div>
          </div>
        );
    }

    likeImage = (id) => {
        const username = localStorage.getItem(LS_USERNAME)
        authorizedFetch(LIKE_ENDPOINT, 'POST', JSON.stringify({memeId: id, username: username}), this.isNotAuthenticated)
        .catch((error) => { console.error('Error:', error) });
        let newImages = this.state.images.map(img => {
            if(img._id === id) {
                if (img.likes && img.likes.includes(username)) {
                    // Do nothing. User alredy likes meme.
                } else if (img.likes) {
                    img.likes.push(username)
                } else {
                    img.likes = [username]
                }
            }
            return img
        })
        const newLikedMemeIds = this.state.likedMemeIds.includes(id) ? this.state.likedMemeIds : [...this.state.likedMemeIds, id]
        this.setState({ images: newImages, likedMemeIds: newLikedMemeIds })
    }
}

const fabStyle = { position: 'absolute', right: '20px', top: '22%' }

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