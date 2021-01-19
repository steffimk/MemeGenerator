import React from 'react';
import PropTypes from 'prop-types';

import './TemplateGallery.css'
import {Button, Modal} from "@material-ui/core";
import NewTemplateApp from "./newTemplateDialog/NewTemplateApp";

const TEMPLATE_ENDPOINT = "http://localhost:3030/memes/templates";

export default class TemplateGallery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "templates": [],
            "modalOpen": false,
        }
    }

    componentDidMount() {
        // initial get request
        this.get_memeTemplates();
    }

    get_memeTemplates() {
        fetch(TEMPLATE_ENDPOINT)
            .then(response => response.json())
            .then(json => {
                console.log(json.data);
                this.setState({
                    'templates': json.data.templates
                });
                this.props.changeCurrentImage(json.data.templates[0]);
            });
    }

    addTemplate(template) {
        console.log(template)
        template.id = "local_" + template.url.substr(0, 10)
        this.setState({"templates": [template, ...this.state.templates], "modalOpen": false})
    }

    renderImage(image) {
        return <img
            src={image.url}
            onClick={this.props.changeCurrentImage.bind(this, image)}
            key={image.id}
        />
    }

    render() {
        const images = this.state.templates.map((image) => this.renderImage(image))
        return (
            <div>
                <Button className="newTemplateButton" variant="contained" onClick={() => this.setState({"modalOpen": true})}>New Template Image</Button>
                <div className="template-gallery">
                    {images}
                </div>

                {/*<Modal className="newTemplateModal"
                       open={this.state.modalOpen}
                       onClose={() => this.setState({"modalOpen": false})}
                >*/}
                    <NewTemplateApp onSave={(e) => this.addTemplate(e)}
                        open={this.state.modalOpen}
                        onClose={() => this.setState({"modalOpen": false})}
                    />
                {/*</Modal>*/}
            </div>
        )
    }
}

TemplateGallery.propTypes = {
    currentImage: PropTypes.object.isRequired,
    changeCurrentImage: PropTypes.func.isRequired
}