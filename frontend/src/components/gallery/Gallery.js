import React from 'react';
import './Gallery.css';
import CustomAppBar from '../CustomAppBar/CustomAppBar';
import {Link, withRouter} from "react-router-dom";
import SingleImage from "./SingleImage";
import SearchDialog from "../search/SearchDialog";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const MEMES_ENDPOINT = "http://localhost:3030/memes/memes";

class Gallery extends React.Component {

    constructor() {
        super();
        this.state = {

            // contains all images without filters
            all_images: [],
            // contains the creation_time of the most current image
            all_images_max_creation_time: Date.now(),
            // contains the creation_time of the oldest image
            all_images_min_creation_time: 0,
            // contains images filtered/ordered as defined in search
            images: [],
            searchOpen: false,
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

        fetch(MEMES_ENDPOINT)//+'?orderBy={"_id": -1}&timeRange=[1614021522921,1614021525549]')
            .then(response => response.json())
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
            });
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
            <CustomAppBar>
            	<IconButton 
            		color="secondary" 
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

export default withRouter(Gallery);
