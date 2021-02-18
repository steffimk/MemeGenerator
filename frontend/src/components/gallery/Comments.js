import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputBase, Paper } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import React, { Component } from 'react'

export default class Comments extends Component {
  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose} scroll="papaer" style={dialogStyle}>
        <DialogTitle>Comments</DialogTitle>
        <DialogContent dividers={true}></DialogContent>
        <DialogActions>
          <Paper component="form">
            <IconButton>
              <Avatar>{localStorage.getItem('memeGen_username')[0]}</Avatar>
            </IconButton>
            <InputBase placeholder="My Comment..." />
            <IconButton type="submit">
              <SendIcon />
            </IconButton>
          </Paper>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const dialogStyle =  {
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center'
}
