import React from 'react';
import './Gallery.css'
import {Link, withRouter} from "react-router-dom";
import SingleImage from "./SingleImage";

class Gallery extends React.Component {

    constructor() {
        super();
        this.state = {
            images: [],
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
        fetch("https://api.imgflip.com/get_memes")
            .then(response => response.json())
            .then(json =>
                this.setState({
                    'images': json.data.memes
                })
            );
    }

    render() {

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

        let images = this.state.images.map(this.renderImage)
        let slices = [
            images.slice(0, images.length/4.0),
            images.slice(images.length/4.0, images.length/4.0*2),
            images.slice(images.length/4.0*2, images.length/4.0*3),
            images.slice(images.length/4.0*3, images.length),
        ]

        return (
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
        );
    }

    renderImage(image) {
        return (
            <Link to={"/gallery/"+image.id}>
                <div className="image-container" id={image.id}>
                    <img src={image.url} alt={image.name} />
                    <div className="image-title">{image.name}</div>
                </div>
            </Link>
        )
    }
}

export default withRouter(Gallery);