import React from 'react';
import PropTypes from 'prop-types';

import './TemplateGallery.css';
import {Button} from "@material-ui/core";
import NewTemplateDialog from "../newTemplateDialog/NewTemplateDialog"
export default class TemplateGallery extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            "templates": [],
            "modalOpen": false,
            imageKeyMouseHovering: undefined // id of image the mouse is hovering over
        }
    }

    componentDidMount() {
        // initial get request
        this.get_memeTemplates();
    }

    get_memeTemplates() {
        const jwt = localStorage.getItem('memeGen_jwt')
        fetch(this.props.templateEndpoint, {
            method: 'GET',
            headers: {"Authorization": jwt }
          }).then(response => {
              if (!response.ok) {
                if(response.status === 401) this.props.setIsAuthenticated(false)
                return Promise.reject("Server responded with " + response.status + " " + response.statusText)
              }
              return response.json()
            }).then(json => {
                console.log(json.data);
                this.setState({
                    'templates': json.data.templates
                });
                this.props.changeCurrentImage(json.data.templates[0]);
            }).catch(e => console.log(e))
    }

    addTemplate(template) {
        console.log(template)
        template.id = "local_" + template.url.substr(0, 10)
        this.setState({"templates": [template, ...this.state.templates], "modalOpen": false})
    }

    setIsHovering = (e) => {
        if (e.type === "mouseenter") {
            this.setState({imageKeyMouseHovering: e._targetInst.key})
        } else if (e.type === "mouseleave") {
            if (this.state.imageKeyMouseHovering === e._targetInst.key) {
                this.setState({imageKeyMouseHovering: null})
            }
        }
    }

    getTitle(image) {
        if (image.id !== this.state.imageKeyMouseHovering) {
            return ""
        } else {
            return this.props.isInAddImageMode ? `Add ${image.name} to your meme` : `Use ${image.name} as template`
        }
    }

    renderImage(image) {
        return <img 
                src={image.url}
                onMouseEnter={this.setIsHovering}
                onMouseLeave={this.setIsHovering}
                onClick={this.props.changeCurrentImage.bind(this,image)}
                key={image.id}
                alt={image.name}
                title={this.getTitle(image)}
                />
    }

    render(){
        const images = this.state.templates.map((image) => this.renderImage(image))
        return (
            <div>
                <Button className="newTemplateButton" variant="contained" onClick={() => this.setState({"modalOpen": true})}>New Template Image</Button>
                <div className="template-gallery">
                    {this.props.isInAddImageMode && (
                        <h4>Select the image you want to add:</h4>
                    )}
                    {images}
                </div>
                <NewTemplateDialog onSave={(e) => this.addTemplate(e)}
                                   open={this.state.modalOpen}
                                   onClose={() => this.setState({"modalOpen": false})}
                />
            </div>
        )
    }
}

TemplateGallery.propTypes = {
    currentImage: PropTypes.object.isRequired,
    images: PropTypes.array.isRequired,
    changeCurrentImage: PropTypes.func.isRequired,
    isInAddImageMode: PropTypes.bool.isRequired,
    setIsAuthenticated: PropTypes.func.isRequired
}