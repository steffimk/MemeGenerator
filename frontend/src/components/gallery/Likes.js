import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Avatar, Button, Card, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { randomColor, dialogStyle } from '../../constants'

export default class Likes extends Component {

  renderLike = (username) => {
    return (<Card variant="outlined" style={{ marginBottom: '10px' }}>
        <CardHeader
          style={{ padding: '4px 4px', width: '200px' }}
          title={username}
          avatar={
            <Avatar size="small" style={{ backgroundColor: randomColor(username.charCodeAt(0)) }}>
              {username[0]}
            </Avatar>
          }
        />
      </Card>
    );
  };

  render() {
    const renderedLikes = this.props.likes.map(this.renderLike);
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose} scroll="paper" style={dialogStyle}>
        <DialogTitle>Likes</DialogTitle>
        <DialogContent dividers={true}>{renderedLikes}</DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

Likes.propTypes = {
  likes: PropTypes.arrayOf(PropTypes.object).isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
} 