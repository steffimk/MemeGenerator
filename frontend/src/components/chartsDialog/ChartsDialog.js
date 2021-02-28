import {Component} from "react";
import PropTypes from 'prop-types';
import {Dialog, DialogContent, DialogTitle, MenuItem, Select} from "@material-ui/core";
import {Chart} from "react-google-charts";
import "react-google-charts";

/**
 * Dialog for Charts opened from Single View of Memes
 * Shows Likes and Views of the meme of time
 */
export default class ChartsDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showLikes: true
        }
    }

    /**
     * Create data array for likes to visualize in chart
     * @returns {[[{label: string, type: string}, {label: string, type: string}], [date, number], [date, number], ...]}
     */
    getDataArray = () => {

        //first row to fix data types and labels
        let data_array = [[{type: 'date', label: 'Time'}, {type: 'number', label:'Likes'}]];

        let likesCount = 0;

        data_array.push([new Date(this.props.creation_time), likesCount]);

        this.props.likes.forEach(like => {
            // count up or down if liked or disliked
            likesCount = like.isDislike ? likesCount - 1 : likesCount + 1;
            data_array.push([new Date(like.date), likesCount]);
        });

        return  data_array;
    }

    /**
     *
     * @returns {[[{label: string, type: string}, {label: string, type: string}], [date, number], [date, number], ...]}
     */
    getDataArrayView = () => {

        //first row to fix data types and labels
        let data_array = [[{type: 'date', label: 'Time'}, {type:'number', label:'Views'}]];

        data_array.push([new Date(this.props.creation_time), 0]);

        this.props.views.forEach((view, index) => {
            data_array.push([new Date(view), index + 1]);
        });

        return data_array;
    }

    /**
     * Change value from Selected
     * @param event value of selected changed
     */
    handleChange = (event) => {
        if(event.target.value === 'like') {
            this.setState({showLikes: true})
        } else if(event.target.value === 'views') {
            this.setState({showLikes: false})
        }
    }

    renderChart = (data) => {
        console.log("render chart data ", data)
        return(
            <div>
            <Select
            labelId="select-label"
            id="select"
            value={this.state.showLikes ? "like" : "views"}
            onChange={this.handleChange}>
                <MenuItem value="like">Likes</MenuItem>
                <MenuItem value="views">Views</MenuItem>
            </Select>
            <Chart
                width={'900px'}
                height={'500px'}
                chartType="Line"
                loader={<div>Loading Chart</div>}
                data={data}
                /* Wanted to work with options for better UI, but did not work*/
                /*
                options={{
                    width: '900',
                    height: '500',
                    hAxis: {
                        viewWindow: {
                            min: this.props.creation_time,
                            max: Date.now()
                        },
                        gridlines: {
                            units: {
                                days: {format: 'MMM dd'},
                                hours: {format: 'HH:mm'}
                            }
                        }
                    }
                }}*/
            />
            </div>
        )
    }

    render() {
        //Load data for chart and render it
        const data = this.state.showLikes ? this.getDataArray() : this.getDataArrayView()
        const renderedCharts = this.renderChart(data);

        return(
            <Dialog fullwidth={'xl'} maxWidth={'xl'} open={this.props.open} onClose={this.props.handleClose}>
                <DialogTitle>Statistic of this Meme</DialogTitle>
                <DialogContent dividers={true}>{renderedCharts}</DialogContent>
            </Dialog>

        )
    }
}

ChartsDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    likes: PropTypes.array.isRequired,
    creation_time: PropTypes.number.isRequired,
    views: PropTypes.array.isRequired
}