import React from 'react';
import './Gallery.css';
import { Redirect } from 'react-router-dom'
import CustomAppBar from '../CustomAppBar/CustomAppBar';
import {Link, withRouter} from "react-router-dom";
import SingleImage from "./SingleImage";
import { authorizedFetch } from '../../communication/requests';
import { Fab } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';

const MEMES_ENDPOINT = "http://localhost:3030/memes/memes";

class Gallery extends React.Component {

    constructor() {
        super();
        this.state = {
            isAuthenticated: true,
            images: [],
            likedMemeIds: []
        };
    }

    componentDidMount(){
        this.get_memes();
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
        authorizedFetch(MEMES_ENDPOINT, 'GET')
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) this.setState({ isAuthenticated: false })
                return Promise.reject("Server responded with " + response.status + " " + response.statusText)
            }
            return response.json()
        }).then(json => {
            console.log(json.data);
            this.setState({
                'images': json.data.memes
            })
            this.getLikedMemeIds(json.data.memes, localStorage.getItem('memeGen_username'))
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

        const n_columns = 4.0;
        let images = this.state.images.map(
            (e) => this.renderImage(e, this.props.location.pathname)
        );
        let slices = [
            images.slice(0, images.length/n_columns),
            images.slice(images.length/n_columns, images.length/n_columns*2),
            images.slice(images.length/n_columns*2, images.length/n_columns*3),
            images.slice(images.length/n_columns*3, images.length),
        ];

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
                    <div className="column">
                        {slices[1]}
                    </div>
                    <div className="column">
                        {slices[2]}
                    </div>
                    <div className="column">
                        {slices[3]}
                    </div>
                </div>
                <SingleImage images={this.state.images} id={id} />
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
        if (this.state.likedMemeIds.includes(image._id)) favIconColor = "secondary"
        return (
            <div className="image-container" id={image._id}>
                <Link to={imageRoute} key={image._id}>
                    <img src={image.img} alt={image.name} />
                </Link>
              <div className="image-title">
                &nbsp;&nbsp;{image.name}
                <Fab size="small" color="white" aria-label="like" style={fabStyle} onClick={() => this.likeImage(image._id)}>
                  <FavoriteIcon color={favIconColor}/>
                </Fab>
              </div>
            </div>
        );
    }

    likeImage = (id) => {
        const username = localStorage.getItem('memeGen_username')
        authorizedFetch(MEMES_ENDPOINT+'/like', 'POST', JSON.stringify({memeId: id, username: username}))
        .then((response) => {
            if (response.ok) {
                this.setState({ likedMemeIds: [...this.state.likedMemeIds, id] })
            }
            else {
              if (response.status === 401) this.setState({ isAuthenticated: false });
            }
        })
    }
}

const fabStyle = { position: 'absolute', right: '10px', top: '20%' }

export default withRouter(Gallery);