import React from 'react';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';

import './NewTemplateApp.css';
import {TextField} from "@material-ui/core";

export default class NewTemplateApp extends React.Component{

    constructor(props) {
        super(props);
        // FIXME (also in App.js)
        this.urlTemplates = "http://localhost:3030/memes/templates";
        this.state = {
            "url": {},
            "width": 0,
            "height": 0,
        };
    }


    onSave(e){
        console.log(e)
        e.preventDefault();
        const memeTemplateToSave = {
            url: this.state.url,
            name: document.getElementById("template-name").value,
            width: this.state.width,
            height: this.state.height,
            box_count: document.getElementById("template-box-count").value,

        }
        console.log(memeTemplateToSave)
        fetch(this.urlTemplates, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(memeTemplateToSave),
        })
            .then(response => {
                if(response.ok) {
                    return true;
                }else{
                    return Promise.reject(
                        "API Responded with an error: "+response.status+" "+response.statusText
                    )
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                return false;
            })
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

    render(){
        return (
            <form className="new-template-form" onSubmit={(e) => this.onSave(e)}>
                <TextField id="template-name" label="Template Name" required/>
                <TextField id="template-url" label="Template URL"
                    type="url"
                    pattern="https://.*"
                    onChange={(e) => this.onUrlChange(e)}
                />
                <TextField id="template-box-count"
                   label="Box Count" type="number" value={0}
                   required
                   min={0}
                   max={10}
                />
                <Fab type="submit" color="primary" aria-label="add" className="fab">
                    <SaveIcon />
                </Fab>
                <img src={this.state.url}  alt=""/>
            </form>
        )
    }
}