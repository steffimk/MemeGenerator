import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Avatar, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputBase, Paper, Typography } from '@material-ui/core'

const colors = ['orange', '#00a170', '#0072b5', '#d2386c']
const randomColor = (ascii) => colors[ascii%colors.length]

export default class Likes extends Component {

  renderLike = (username) => {
    return (<Card variant="outlined" style={{ marginBottom: '10px' }}>
        <CardHeader
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
    const renderedLikes = this.props.likes.map(this.renderLike)
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

const dialogStyle =  {
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  marginLeft: window.innerWidth * 0.5
}

Likes.propTypes = {
  likes: PropTypes.arrayOf(PropTypes.string).isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
} 