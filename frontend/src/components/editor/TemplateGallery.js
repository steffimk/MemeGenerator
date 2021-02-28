import React from 'react';
import PropTypes from 'prop-types';

import './TemplateGallery.css';
import {Button} from "@material-ui/core";
import NewTemplateDialog from "../newTemplateDialog/NewTemplateDialog"
import { authorizedFetch } from '../../communication/requests';

/**
 * A Gallery containing all templates the user can choose from in the Editor.
 */
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

    /**
     * Gets the templates from the backend
     */
    get_memeTemplates() {
        authorizedFetch( this.props.templateEndpoint, 'GET', {}, () => this.props.setIsAuthenticated(false))
        .then(json => {
                console.log(json.data);
                this.setState({
                    'templates': json.data.templates
                });
                let selectedTemplate = json.data.templates[0]
                if(this.props.queryId) {
                    const queryTemplate = json.data.templates.find(template => template._id === this.props.queryId)
                    if(queryTemplate) selectedTemplate = queryTemplate
                }
                this.props.changeCurrentImage(selectedTemplate);

            }).catch(e => console.log(e))
    }

    /**
     * Adds a template locally
     * @param {*} template - the template to be added
     */
    addTemplate(template) {
        console.log(template)
        template.id = "local_" + template.url.substr(0, 10)
        this.setState({"templates": [template, ...this.state.templates], "modalOpen": false})
    }

    /**
     * Checks if the mouse is currenty hovering over an image
     * @param {*} e 
     */
    setIsHovering = (e) => {
        if (e.type === "mouseenter") {
            this.setState({imageKeyMouseHovering: e._targetInst.key})
        } else if (e.type === "mouseleave") {
            if (this.state.imageKeyMouseHovering === e._targetInst.key) {
                this.setState({imageKeyMouseHovering: null})
            }
        }
    }

    /**
     * Renders the message of a tooltip.
     * @param {*} image 
     */
    getTitle(image) {
        if (image.id !== this.state.imageKeyMouseHovering) {
            return ""
        } else {
            return this.props.isInAddImageMode ? `Add ${image.name} to your meme` : `Use ${image.name} as template`
        }
    }

    /**
     * Renders the view of an image
     * @param {*} image 
     */
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
                                   apiEndpoint={this.props.apiEndpoint}
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
    setIsAuthenticated: PropTypes.func.isRequired,
    apiEndpoint: PropTypes.string.isRequired,
    queryId: PropTypes.string.isRequired
}