import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, FormControl, Select } from '@material-ui/core';
import { dialogStyle } from '../../constants'
import ShareDialog from '../shareDialog/Share';
import ShareIcon from '@material-ui/icons/Share';
export default class NewMeme extends Component {

  constructor(props) {
    super(props);
    this.state = {
      privacyLabel: 'private',
      openShare: false
    }
  }

  setOpenShare = (isOpen) => this.setState({ openShare: isOpen })

  uploadMeme = () => {
    this.props.uploadMeme(this.state.privacyLabel)
    this.props.handleClose()
  }

  downloadMeme = () => {
    var downloadLink = document.createElement("a")
    downloadLink.href = this.props.dataUrl
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
      <div>
        <Dialog open={this.props.open} onClose={this.props.handleClose} scroll="paper" style={dialogStyle}>
          <DialogTitle>Generated Meme</DialogTitle>
          <DialogContent dividers={true}>
            <img src={this.props.dataUrl} alt="canvasImage" style={{ width: '100%' }} />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.downloadMeme}
              style={{ marginRight: '60px' }}>
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
              style={{ marginRight: '20px' }}>
              Upload
            </Button>
            <Fab size="small" onClick={() => this.setOpenShare(true)} style={{ marginRight: '60px' }}>
              <ShareIcon />
            </Fab>
            <Button variant="contained" size="small" onClick={this.props.handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <ShareDialog
          open={this.state.openShare}
          handleClose={() => this.setOpenShare(false)}
          isGallery={false}
        />
      </div>
    );
  }
}

NewMeme.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  dataUrl: PropTypes.object.isRequired,
  uploadMeme: PropTypes.func.isRequired
}