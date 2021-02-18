import { Avatar, Button, Card, CardContent, CardHeader, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputBase, Paper, Typography } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import React, { Component } from 'react'
import PropTypes from 'prop-types';

export default class Comments extends Component {

  renderComment = (comment) => {
    return (
      <Card variant='outlined' style={{marginBottom: '10px'}}>
        <CardHeader
          title={comment.username}
          subheader={comment.date.slice(0, comment.date.indexOf('GMT'))}
          avatar={<Avatar size='small' style={{ backgroundColor: 'orange' }}>{comment.username[0]}</Avatar>}
        />
        <CardContent>
          <Typography>{comment.comment}</Typography>
        </CardContent>
      </Card>
    );
  };

  render() {
    const renderedComments = this.props.comments.map(this.renderComment);
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose} scroll="paper" style={dialogStyle}>
        <DialogTitle>Comments</DialogTitle>
        <DialogContent dividers={true}>{renderedComments}</DialogContent>
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

Comments.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  comments: PropTypes.array.isRequired
}

const dialogStyle =  {
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center'
}
