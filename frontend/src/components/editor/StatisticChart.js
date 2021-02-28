import React, {Component} from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import PropTypes from 'prop-types';
import {Chart} from "react-google-charts";

export default class StatisticChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value : ""
        }
    }

    handleChangeChart = (event) => {
        this.setState({value : event.target.value})
    }

    render() {
        let data;
        switch (this.state.value) {
            case('like'):
                data = this.props.likeData;
                break;
            case('views'):
                data = this.props.viewData;
                break;
            case('generated'):
            default:
                data = this.props.generateData;
                break;
        }
        return (
            <div className="flex-container" >
                <h1>Statistics</h1>
                <FormControl>
                    <InputLabel>Data</InputLabel>
                    <Select
                        labelId="select-label"
                        id="select"
                        value={this.state.value}
                        onChange={this.handleChangeChart}>
                        <MenuItem value="generated">Generation</MenuItem>
                        <MenuItem value="like">Likes</MenuItem>
                        <MenuItem value="views">Views</MenuItem>
                    </Select>
                </FormControl>
                {this.state.value !== "" ?
                    <Chart
                        width={'100%'}
                        height={'40%'}
                        chartType="Line"
                        loader={<div>Loading Chart</div>}
                        data={data}
                    />
                    : <div/>
                }
            </div>
        );
    }
}

StatisticChart.propTypes = {
    generateData: PropTypes.array.isRequired,
    viewData: PropTypes.array.isRequired,
    likeData: PropTypes.array.isRequired
}