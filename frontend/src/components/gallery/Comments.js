import { Avatar, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputBase, Paper, Typography } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { authorizedFetch, COMMENT_ENDPOINT } from '../../communication/requests';

const colors = ['orange', '#00a170', '#0072b5', '#d2386c']
const randomColor = () => colors[Math.floor(Math.random() * colors.length)]
export default class Comments extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newComment: '',
      comments: this.props.meme.comments ? this.props.meme.comments : []
    }
    this.username = localStorage.getItem('memeGen_username')
  }

  changeComment = (e) => this.setState({ newComment: e.target.value })

  submitNewComment = () => {
    const commentSubmit = { username: this.username, comment: this.state.newComment, date: Date() }
    const requestBody = { memeId: this.props.meme._id, comment: commentSubmit }
    console.log(COMMENT_ENDPOINT)
    authorizedFetch(COMMENT_ENDPOINT, 'POST', JSON.stringify(requestBody), this.props.isNotAuthenticated)
    .catch(e => console.error(e))
    this.setState({ comments: [...this.state.comments, commentSubmit], newComment: '' })
  }

  renderComment = (comment) => {
    return (
      <Card variant='outlined' style={{marginBottom: '10px'}}>
        <CardHeader
          title={comment.username}
          subheader={comment.date.slice(0, comment.date.indexOf('GMT'))}
          avatar={<Avatar size='small' style={{ backgroundColor: randomColor() }}>{comment.username[0]}</Avatar>}
        />
        <CardContent>
          <Typography>{comment.comment}</Typography>
        </CardContent>
      </Card>
    );
  };

  render() {
    const renderedComments = this.state.comments.map(this.renderComment);
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose} scroll="paper" style={dialogStyle}>
        <DialogTitle>Comments</DialogTitle>
        <DialogContent dividers={true}>{renderedComments}</DialogContent>
        <DialogActions>
          <Paper component="form">
            <IconButton>
              <Avatar>{this.username[0]}</Avatar>
            </IconButton>
            <InputBase placeholder="My Comment..." onChange={this.changeComment} value={this.state.newComment}/>
            <IconButton onClick={this.submitNewComment} >
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
  meme: PropTypes.object.isRequired,
  isNotAuthenticated: PropTypes.func.isRequired
}

const dialogStyle =  {
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center'
}
