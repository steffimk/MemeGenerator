import React from 'react';
import './Gallery.css';
import { Redirect } from 'react-router-dom'
import CustomAppBar from '../CustomAppBar/CustomAppBar';
import {Link, withRouter} from "react-router-dom";
import SingleImage from "./SingleImage";
import { authorizedFetch } from '../../communication/requests';

const MEMES_ENDPOINT = "http://localhost:3030/memes/memes";

class Gallery extends React.Component {

    constructor() {
        super();
        this.state = {
            isAuthenticated: true,
            images: [],
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
        });
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
                    <div>
                        {this.state.images.length < 1 &&
                            <h1>There are no memes created and published until now. Be the first one!</h1>
                        }
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

        return (
            <Link to={imageRoute} key={image.id}>
                <div className="image-container" id={image.id}>
                    <img src={image.img} alt={image.name} />
                    <div className="image-title">{image.name}</div>
                </div>
            </Link>
        )
    }
}

export default withRouter(Gallery);