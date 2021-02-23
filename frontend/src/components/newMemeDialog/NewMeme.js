import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

export default class NewMeme extends Component {

  constructor(props) {
    super(props);
    this.state = {
      privacyLabel: 'private'
    }
  }

  uploadMeme = () => {
    this.props.uploadMeme(this.state.privacyLabel)
    this.props.handleClose()
  }

  downloadMeme = () => {
    var downloadLink = document.createElement("a")
    downloadLink.href = this.props.canvasImage
    downloadLink.download = "MyMeme.jpg"
    downloadLink.click()
  }

  /**
   * Handle change in selected privacy label
   * @param {React.ChangeEvent} event 
   */
  handleChange = (event) => {
    this.setState({ privacyLabel: event.target.value, selectColor: 'primary' })
  }

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose} scroll="paper" style={dialogStyle}>
        <DialogTitle>Generated Meme</DialogTitle>
        <DialogContent dividers={true}>
          <img src={this.props.canvasImage} alt="canvasImage" style={{ width: '100%' }} />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={this.downloadMeme}
            style={{ marginRight: '70px' }}>
            Download
          </Button>
          <FormControl color="primary" style={{ width: '150px' }}>
            <Select native value={this.state.privacyLabel} onChange={this.handleChange}>
              <option value={'private'}>Private</option>
              <option value={'unlisted'}>Unlisted</option>
              <option value={'public'}>Public</option>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            size="small"
            onClick={this.uploadMeme}
            color="secondary"
            style={{ marginRight: '70px' }}>
            Upload
          </Button>
          <Button variant="contained" size="small" onClick={this.props.handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

// TODO: get this from constants once branch 36 is in master
const dialogStyle =  {
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center'
}

NewMeme.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  canvasImage: PropTypes.object.isRequired,
  uploadMeme: PropTypes.func.isRequired
}