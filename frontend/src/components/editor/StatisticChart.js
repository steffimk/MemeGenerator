import React, {Component} from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import PropTypes from 'prop-types';
import {Chart} from "react-google-charts";

export default class StatisticChart extends Component {

    constructor(props) {
        super(props);

        this.value = ""

        this.state = {
            data : this.getGeneratedData(this.props.memes)
        }
    }

    getGeneratedData= (memes) => {
        let data_array = [[{type: 'date', label: 'Time'}, {type:'number', label:'Generations'}]];

        if(!memes || memes.length <= 0) {
            data_array.push([new Date(Date.now()), 0]);
            return data_array;
        }

        memes.forEach((meme, index) => {
            data_array.push([new Date(meme.creation_time), index + 1]);
        })

        return data_array;
    }

    getLikeData = (memes) => {
        let data_array = [[{type: 'date', label: 'Time'}, {type:'number', label:'Likes'}]];

        if(!memes || memes.length <= 0) {
            data_array.push([new Date(Date.now()), 0]);
            return data_array;
        }

        data_array.push([new Date(memes[0].creation_time), 0]);

        let like_times = [];

        memes.forEach((meme) => {
            if(meme.likeLogs) {
                meme.likeLogs.forEach(like => {
                    like_times.push({date: like.date, isDislike: like.isDislike})
                })
            }
        })

        like_times.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a.date) - new Date(b.date);
        });

        let likesCount = 0;
        like_times.forEach((like) => {
            likesCount = like.isDislike ? likesCount - 1 : likesCount + 1;
            data_array.push([new Date(like.date), likesCount]);
        })

        return data_array;
    }

    getViewData = (memes) => {
        let data_array = [[{type: 'date', label: 'Time'}, {type:'number', label:'Views'}]];

        if(!memes || memes.length <= 0) {
            data_array.push([new Date(Date.now()), 0]);
            return data_array;
        }
        data_array.push([new Date(memes[0].creation_time), 0]);

        let view_times = [];

        memes.forEach((meme) => {
            if(meme.views && meme.views.length > 0) {
                meme.views.forEach(view => {
                    view_times.push(view)
                })
            }
        })

        view_times.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a) - new Date(b);
        });

        view_times.forEach((view, index) => {
            data_array.push([new Date(view), index + 1]);
        })

        return data_array;
    }

    handleChangeChart = (event) => {
        this.value= event.target.value;
        switch (event.target.value) {
            case('like'):
                this.setState({data: this.getLikeData(this.props.memes)})
                break;
            case('views'):
                this.setState({data: this.getViewData(this.props.memes)})
                break;
            case ('generated'):
            default:
                this.setState({data: this.getGeneratedData(this.props.memes)})
        }
    }

    componentDidUpdate() {

        this.value = '';

        switch (this.value) {
            case('like'):
                this.state.data = this.getLikeData(this.props.memes);
                break;
            case('views'):
                this.state.data = this.getViewData(this.props.memes);
                break;
            case ('generated'):
            default:
                this.state.data = this.getGeneratedData(this.props.memes);
        }
    }

    render() {
        if(this.value === "") {
            return (
                <div className="flex-container" >
                    <h1>Statistics</h1>
                    <FormControl>
                        <InputLabel>Data</InputLabel>
                        <Select
                            labelId="select-label"
                            id="select"
                            value={this.value}
                            onChange={this.handleChangeChart}>
                            <MenuItem value="generated">Generation</MenuItem>
                            <MenuItem value="like">Likes</MenuItem>
                            <MenuItem value="views">Views</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            );
        }
        return (
            <div className="flex-container" >
                <h1>Statistics</h1>
                <FormControl>
                    <InputLabel>Data</InputLabel>
                    <Select
                        labelId="select-label"
                        id="select"
                        value={this.value}
                        onChange={this.handleChangeChart}>
                        <MenuItem value="generated">Generation</MenuItem>
                        <MenuItem value="like">Likes</MenuItem>
                        <MenuItem value="views">Views</MenuItem>
                    </Select>
                </FormControl>
                <Chart
                    width={'100%'}
                    height={'40%'}
                    chartType="Line"
                    loader={<div>Loading Chart</div>}
                    data={this.state.data}
                    rendered={this.value !== ""}
                />
            </div>
        );
    }
}

StatisticChart.propTypes = {
    memes: PropTypes.array.isRequired
}