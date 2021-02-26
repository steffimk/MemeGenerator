import React from 'react';
import memoize from "memoize-one";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Select,
    Slider, Switch,
} from "@material-ui/core";

export default class SearchDialog extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            "order": false,
            "orderKey": "creation_time",
            "timeRange": [0, 1],
            "likesRange": [0, 1],
            "viewsRange": [0, 1],
        };
    }

    filterImages(){
        let filteredImages = this.props.all_images.filter((value, index, list) => {
            return (
                    !value.hasOwnProperty("creation_time") || (value.hasOwnProperty("creation_time") &&
                        value.creation_time <= Math.max(...this.state.timeRange) &&
                        value.creation_time >= Math.min(...this.state.timeRange))
                ) &&
                (
                    (value.hasOwnProperty("likes") &&
                        value.likes.length <= Math.max(...this.state.likesRange) &&
                        value.likes.length >= Math.min(...this.state.likesRange))
                    || (!value.hasOwnProperty("likes") && Math.min(...this.state.likesRange) === 0)
                ) &&
                (
                    (value.hasOwnProperty("views") &&
                        value.views <= Math.max(...this.state.viewsRange) &&
                        value.views >= Math.min(...this.state.viewsRange))
                    || (!value.hasOwnProperty("views") && Math.min(...this.state.viewsRange) === 0)
                )
        })

        filteredImages.sort((a, b) => {
            let order = 1;
            if(this.state.orderKey === 'likes'){
                let cnt_a = 0;
                let cnt_b = 0

                if(a.hasOwnProperty("likes")){
                    cnt_a = a.likes.length
                }
                if(b.hasOwnProperty("likes")){
                    cnt_b = b.likes.length
                }
                order = cnt_a - cnt_b;
            }else if(this.state.orderKey === 'views'){
                let cnt_a = 0;
                let cnt_b = 0

                if(a.hasOwnProperty("views")){
                    cnt_a = a.views
                }
                if(b.hasOwnProperty("views")){
                    cnt_b = b.views
                }
                order = cnt_a - cnt_b;
            }else{
                if (a._id < b._id) {
                    order = -1;
                } else {
                    order = 1;
                }
            }
            return order * (this.state.order ? 1 : -1);
        });
        this.props.onChange(filteredImages)
    }

    handleRangeChange(key, value) {
        console.log(this.state)
        this.setState({[key]: value});
        console.log(this.state)
        this.filterImages();
    }

    handleOrderChange(e) {
        this.setState({"order": e.target.checked });
        this.filterImages();
    }

    handleOrderKeyChange(e){
        this.setState({"orderKey": e.target.value})
        this.filterImages();
    }

    valueLabelFormat(value) {
        let date = new Date(value);
        return date.toLocaleDateString();
    }

    getLimits = memoize(
        (all_images) => {
            let times = all_images
                .map((meme) => meme.creation_time)
                .filter(Boolean);	// this filters undefined values as undefined is falsy

            let max_times = Math.max(...times);
            let min_times = Math.min(...times);

            let likes = all_images
                .map((meme) => meme.likes)
                .filter(Boolean)	// this filters undefined values as undefined is falsy
                .map((likes) => likes.length);

            let max_likes = Math.max(...likes);

            let views = all_images
                .map((meme) => meme.views)
                .filter(Boolean)

            let max_views = Math.max(...views)

            this.setState({
                "timeRange": [min_times, max_times],
                "likesRange": [0, max_likes],
                "viewsRange": [0, max_views],
            })
            return [max_times, min_times, max_likes, max_views]
        }
    );

    render(){
        let [max_times, min_times, max_likes, max_views] = this.getLimits(this.props.all_images);

        return (
            <Dialog open={this.props.open} onClose={() => (this.props.onClose())} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Search and Filters</DialogTitle>
                <DialogContent>
                    <label>Time range
                        {/*https://github.com/mui-org/material-ui/issues/20896*/}
                        <Slider
                            value={ this.state.timeRange }
                            onChange={
                                (e, value) => this.handleRangeChange('timeRange',value)
                            }
                            valueLabelDisplay="auto"
                            id="time-range-slider"
                            aria-labelledby="time-range-slider"
                            min={Math.max(0,min_times)}
                            max={max_times}
                            //step={1000*60*10}
                            valueLabelFormat={this.valueLabelFormat}
                        />
                    </label>
                    <label>Likes range
                        <Slider
                            value={ this.state.likesRange }
                            onChange={
                                (e, value) => this.handleRangeChange('likesRange',value)
                            }
                            valueLabelDisplay="auto"
                            id="like-range-slider"
                            aria-labelledby="like-range-slider"
                            min={0}
                            max={max_likes}
                        />
                    </label>
                    <label>Views range
                        <Slider
                            value={ this.state.viewsRange }
                            onChange={
                                (e, value) => this.handleRangeChange('viewsRange',value)
                            }
                            valueLabelDisplay="auto"
                            id="view-range-slider"
                            aria-labelledby="view-range-slider"
                            min={0}
                            max={max_views}
                        />
                    </label>
                    <label>
                        Order by
                        <Select
                            native
                            value={this.state.orderKey}
                            onChange={(e) => this.handleOrderKeyChange(e)}
                            inputProps={{
                                name: 'order-key',
                                id: 'order-key',
                            }}
                        >
                            <option value={"creation_time"}>Creation Time</option>
                            <option value={"likes"}>Likes</option>
                            <option value={"views"}>Views</option>
                        </Select>
                    </label>
                    <label>
                        Asc
                        <Switch
                            checked={this.state.order}
                            onChange={(e) => {this.handleOrderChange(e)}}
                            name="orderBy"
                            color="default"
                        />
                        Desc
                    </label>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.props.onClose()} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

        )
    }
}
