import {Component} from "react";
import PropTypes from 'prop-types';
import {Dialog, DialogContent, DialogTitle, MenuItem, Select} from "@material-ui/core";
import {Chart} from "react-google-charts";
import "react-google-charts";

export default class ChartsDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showLikes: true
        }
    }

    getDataArray = () => {

        let data_array = [[{type: 'date', label: 'Time'}, {type: 'number', label:'Likes'}]];
        let likesCount = 0;
        data_array.push([new Date(this.props.creation_time), likesCount]);

        this.props.likes.forEach(like => {
            likesCount = like.isDislike ? likesCount - 1 : likesCount + 1;
            data_array.push([new Date(like.date), likesCount]);
        });

        return  data_array;
    }

    getDataArrayView = () => {
        let data_array = [[{type: 'date', label: 'Time'}, {type:'number', label:'Views'}]];
        data_array.push([new Date(this.props.creation_time), 0]);

        this.props.views.forEach((view, index) => {
            data_array.push([new Date(view), index + 1]);
        });
        return data_array;
    }

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