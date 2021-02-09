import React from 'react';
import './SingleImage.css'
import {Link} from "react-router-dom";
import Speech from 'speak-tts'
export default class SingleImage extends React.Component {

    constructor() {
        super();
        this.speech = new Speech()
        this.speech
          .init({'lang': 'en-GB', 'voice':'Google UK English Male'})
          .then((data) => {
            console.log('Speech is ready, voices are available', data);
          })
          .catch((e) => {
            console.error('An error occured while initializing : ', e);
          });
      }

    startAudioDescription = () => {
        if (!this.props.images) return
        const filteredImages = this.props.images.filter(img => img.id === this.props.id)
        const meme = filteredImages[0]
        console.log(meme)
        var text = `You are currently looking at a meme with the title ${meme.name}. `
        if (meme.imageDescription) {
            text += `The image content can be described as follows. ${meme.imageDescription} `
        } else {
            text += "The creator did not add a description of the image content. "
        }
        if (meme.hasOwnProperty("captions")) {
            meme.captions.forEach((caption,index) => {
                if(caption.length > 0 && caption !== '') text += `Caption ${index+1} says ${caption}. `
              })
        }
        this.speech
          .speak({text: text})
          .then(() => {
            console.log('Speech was successful!');
          })
          .catch((e) => {
            console.error('A speech error occurred: ', e);
          });
    }

    render() {
        if(this.props.id !== undefined && this.props.images !== undefined && this.props.images.length > 0) {
            const image_index = this.props.images.findIndex((image) => image.id === this.props.id);

            if(image_index >= 0) {
                // image to view
                let image = this.props.images[image_index];
                let prev_image = this.props.images[image_index > 1 ? image_index - 1 : this.props.images.length - 1];
                let next_image = this.props.images[image_index < this.props.images.length - 1 ? image_index + 1 : 0];


                return (
                    // <Link to="."> {/* relative link up one level*/}
                    <div className="modal">
                        <h1 className="modal-title">{image.name}&nbsp;<i class="fas fa-audio-description" onClick={this.startAudioDescription}/></h1>
                        <Link to="."> {/* relative link up one level*/}
                            <Link className="modal-nav modal-left" to={"/gallery/" + prev_image.id}/>
                            <img src={image.url} alt={image.name}/>
                            <Link className="modal-nav modal-right" to={"/gallery/" + next_image.id}/>
                        </Link>
                    </div>
                    // </Link>
                )
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