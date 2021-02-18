import React from 'react';
import './Gallery.css';
import CustomAppBar from '../CustomAppBar/CustomAppBar';
import {Link, withRouter} from "react-router-dom";
import SingleImage from "./SingleImage";

const MEMES_ENDPOINT = "http://localhost:3030/memes/memes";

class Gallery extends React.Component {

    constructor() {
        super();
        this.state = {
            images: [],
            isPlaying: false,
            playIcon: "fas fa-fw fa-play",
            isRandom: false
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

        fetch(MEMES_ENDPOINT)
            .then(response => response.json())
            .then(json => {
                console.log(json.data);
                this.setState({
                    'images': json.data.memes
                })
            });
    }

    changePlaying = (event) => {
        console.log("in handle change")
        console.log("before state", this.state)
        console.log("Welches" + event);
        let isPlaying = !this.state.isPlaying;


        if(isPlaying) {
            this.setState({playIcon: "fas fa-fw fa-pause"});
        } else {
            this.setState({playIcon: "fas fa-fw fa-play"});
        }
        this.setState({isPlaying : isPlaying})
        console.log("new state ", this.state)
    }

    stopPlaying = () => {
        this.setState({playIcon: "fas fa-fw fa-play"})
        this.setState({isPlaying : false})
    }

    changeRandom = () => {
        this.setState({isRandom : !this.state.isRandom})
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
                <SingleImage images={this.state.images}
                             id={id}
                             isPlaying={this.state.isPlaying}
                             playIcon={this.state.playIcon}
                             isRandom={this.state.isRandom}
                             changePlaying={this.changePlaying}
                             stopPlaying = {this.stopPlaying}
                             changeRandom={this.changeRandom}/>
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