import React from 'react';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

import './NewTemplateDialog.css';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField} from "@material-ui/core";

export default class NewTemplateDialog extends React.Component{

    constructor(props) {
        super(props);
        // FIXME (also in App.js)
        this.urlTemplates = "http://localhost:3030/memes/templates";
        this.state = {
            "url": "",
            "width": 0,
            "height": 0,
            "videoStream": false,
            "videoRef": React.createRef(),
        };
    }


    onSave(e){
        // TODO verify if some template was added
        let snapshot = this.getSnapshotFromStream();
        this.closeUserMediaStream();

        let url = this.state.url;
        if(snapshot){
            url = snapshot;
        }

        const memeTemplateToSave = {
            url: url,
            //name: document.getElementById("template-name").value,
            width: this.state.width,
            height: this.state.height,
            //box_count: document.getElementById("template-box-count").value,
        }
        this.props.onSave(memeTemplateToSave);
    }

    onClose(){
        this.closeUserMediaStream();
        this.props.onClose();
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

    isMediaDevicesCapable() {
        return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    }

    onOpenCamera() {
        navigator.mediaDevices.getUserMedia({ audio:false, video:true })
            .then((stream) => {
                this.state.videoRef.current.srcObject = stream;
                this.state.videoRef.current.className="";
            });
    }

    closeUserMediaStream(){
        if(this.state.videoRef.current.srcObject) {
            this.state.videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    }

    getSnapshotFromStream(){
        if(this.state.videoRef.current.srcObject) {

            let video = this.state.videoRef.current;

            let width = video.offsetWidth, height = video.offsetHeight;

            let canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            let context = canvas.getContext('2d')
            context.drawImage(video, 0, 0, width, height);

	    let snapshot = canvas.toDataURL('image/png');
            this.setState({"url": snapshot});

	    return snapshot;
        }
    }

    render(){

        let webcamButton;
        let video;
        if(this.isMediaDevicesCapable()){
            webcamButton = (
                <IconButton onClick={() => this.onOpenCamera()}>
                    <PhotoCameraIcon />
                </IconButton>
            );
            video = (<video className="hidden" ref={this.state.videoRef} autoPlay={true} /> );
        }

        return (
            <Dialog open={this.props.open} onClose={() => (this.onClose())} aria-labelledby="form-dialog-title">
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
                        {webcamButton}
                        {/*<TextField id="template-box-count"
                                   label="Box Count" type="number"
                                   required
                                   min={0}
                                   max={10}
                        />*/}
                        <img src={this.state.url}  alt=""/>
                        {video}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => (this.onClose())} color="primary">
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
