import React from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slider, Switch,
} from "@material-ui/core";

export default class SearchDialog extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            "order": false,
            "timeRange": [this.props.min, this.props.max],
        };
    }

    handleTimeRangeChange(value) {
        this.setState({timeRange: value});
        this.onChange();
    }

    handleOrderChange(e) {
        this.setState({"order": e.target.checked });
        this.onChange();
    }

    onChange() {
        this.props.onChange(this.state);
    }

    valueLabelFormat(value) {
        let date = new Date(value);
        return date.toLocaleDateString();
    }

    render(){

        return (
            <Dialog open={this.props.open} onClose={() => (this.props.onClose())} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Search and Filters</DialogTitle>
                <DialogContent>
                    <label>Time range
                        <Slider
                            value={ this.state.timeRange }
                            onChange={(e, value) => this.handleTimeRangeChange(value)}
                            valueLabelDisplay="auto"
                            id="range-slider"
                            aria-labelledby="range-slider"
                            min={Math.max(0,this.props.min - 1000 * 60 * 60)}
                            max={this.props.max + 1000 * 60 * 60}
                            //step={1000*60*10}
                            valueLabelFormat={this.valueLabelFormat}
                        />
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
