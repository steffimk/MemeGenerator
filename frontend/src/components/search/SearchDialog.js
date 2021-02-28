import React from 'react';
import memoize from "memoize-one";
import Fuse from 'fuse.js'

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Select,
    Slider, Switch, TextField,
} from "@material-ui/core";

// Search Dialog that allows to filter a list of Memes (prop all_images)
// The filtered images are given to a callback prop 'on_change(filtered_images)'
export default class SearchDialog extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            // sort ascending or descending
            "order": false,
            // default meme attribute used for sorting
            "orderKey": "creation_time",
            // filter range for creation_time
            "timeRange": [0, 1],
            // filter range for number of likes
            "likesRange": [0, 1],
            // filter range for number of views
            "viewsRange": [0, 1],
            // search terms
            "search": "",
        };
    }

    // Filters the images from 'this.props.all_images' and passes the result
    // to 'this.props.onChange(filtered_images)
    filterImages() {

        // filter for ranges
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
                        value.views.length <= Math.max(...this.state.viewsRange) &&
                        value.views.length >= Math.min(...this.state.viewsRange))
                    || (!value.hasOwnProperty("views") && Math.min(...this.state.viewsRange) === 0)
                )
        })

        const options = {
            includeScore: true,
            keys: ['name', 'captions', 'imageDescription', 'comments.comment'],
            shouldSort: false,
        }

        if (this.state.search.length > 0) {
            // fuzzy search by search terms
            const fuse = new Fuse(filteredImages, options)

            filteredImages = fuse.search(this.state.search).map((result) => result.item)
        }

        // sort by orderKey
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
                    cnt_a = a.views.length
                }
                if(b.hasOwnProperty("views")){
                    cnt_b = b.views.length
                }
                order = cnt_a - cnt_b;
            }else{
                if (a._id < b._id) {
                    order = -1;
                } else {
                    order = 1;
                }
            }
            // change sort order asc or descending
            return order * (this.state.order ? 1 : -1);
        });
        this.props.onChange(filteredImages)
    }

    handleRangeChange(key, value) {
        this.setState({[key]: value});
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


    handleSearchChange(e) {
        this.setState({"search": e.target.value});
        this.filterImages();
    }

    valueLabelFormat(value) {
        let date = new Date(value);
        return date.toLocaleDateString();
    }

    // get the limits for the filter ranges.
    // memoize calls the function only if the parameter 'all_images' was change
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

            let max_likes = Math.max(...likes,1);

            let views = all_images
                .map((meme) => meme.views)
                .filter(Boolean)
                .map((views) => views.length)

            let max_views = Math.max(...views,1)

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
                    <TextField
                        value={this.state.search}
                        id="search-box"
                        label="Search"
                        placeholder="titles, captions, comments, template id, ..."
                        fullWidth
                        onChange={(e) => this.handleSearchChange(e)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {this.filterImages(); this.props.onClose()}} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

        )
    }
}
