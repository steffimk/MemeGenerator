import React from 'react';
import './Gallery.css'

export default class Gallery extends React.Component {

    constructor() {
        super();
        this.state = {
            images: [],
        };
    }

    componentDidMount(){
        this.get_memes();
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
        let images = this.state.images.map(this.renderImage)
        let slices = [
            images.slice(0, images.length/4.0),
            images.slice(images.length/4.0, images.length/4.0*2),
            images.slice(images.length/4.0*2, images.length/4.0*3),
            images.slice(images.length/4.0*3, images.length),
        ]

        return (
            <div className="image-gallery">
                <div className="column">
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
        );
    }

    renderImage(image) {
        return (
            <img src={image.url} alt={image.name} />
        )
    }
}