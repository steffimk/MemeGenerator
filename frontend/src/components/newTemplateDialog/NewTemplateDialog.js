import React from 'react';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';

import './NewTemplateDialog.css';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";

export default class NewTemplateDialog extends React.Component{

    constructor(props) {
        super(props);
        // FIXME (also in App.js)
        this.urlTemplates = "http://localhost:3030/memes/templates";
        this.state = {
            "url": "",
            "width": 0,
            "height": 0,
        };
    }


    onSave(e){
        const memeTemplateToSave = {
            url: this.state.url,
            //name: document.getElementById("template-name").value,
            width: this.state.width,
            height: this.state.height,
            //box_count: document.getElementById("template-box-count").value,
        }
        this.props.onSave(memeTemplateToSave);
    }

    onUrlChange(event){
        if(event.target.validity.valid){
            let img = new Image();
            let width;
            let height;
            img.addEventListener("load", function(){
                width = img.naturalWidth
                height = img.naturalHeight;
                this.setState({"url": img.src, "width": width, "height": height})
            }.bind(this));
            img.src = event.target.value;
        }
    }

    onFileChange(event){

        const file = event.target.files[0];

        if(file.type.startsWith('image/')){
            let img = new Image();
            let width;
            let height;
            const reader = new FileReader();
            reader.onload = function(e){
                img.src = e.target.result
                // FIXME getting Height and Width is not working for data url
                width = img.naturalWidth
                height = img.naturalHeight;
                this.setState({"url": img.src, "width": width, "height": height})
            }.bind(this)
            reader.readAsDataURL(file);
        }
    }

    render(){

        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add new Template Background</DialogTitle>
                <DialogContent>
                    <form className="new-template-form" >
                        {/*<TextField id="template-name" label="Template Name" required/>*/}
                        <TextField id="template-url" label="Template URL"
                                   type="url"
                                   pattern="https://.*"
                                   onChange={(e) => this.onUrlChange(e)}
                        />
                        <p> - or -</p>
                        <TextField id="template-file" label="Upload photo"
                                   type="file"
                                   accept="image/*"
                                   onChange={(e) => this.onFileChange(e)}
                        />
                        {/*<TextField id="template-box-count"
                                   label="Box Count" type="number"
                                   required
                                   min={0}
                                   max={10}
                        />*/}
                        <img src={this.state.url}  alt=""/>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={(e) => this.onSave(e)} color="primary">
                        Add template
                    </Button>
                </DialogActions>
            </Dialog>

        )
    }
}