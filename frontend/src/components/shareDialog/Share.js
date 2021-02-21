import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { dialogStyle } from '../../constants'
import {
  FacebookShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton
} from "react-share";
import {
  FacebookIcon,
  PinterestIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon
} from "react-share";

export default class ShareDialog extends Component {

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose} scroll="paper" style={dialogStyle}>
        <DialogTitle>Share this Meme</DialogTitle>
        <DialogContent dividers={true}>
          <FacebookShareButton url={this.props.shareUrl}>
            <FacebookIcon round={true} />
          </FacebookShareButton>
          <PinterestShareButton url={this.props.shareUrl} media={this.props.shareUrl}>
            <PinterestIcon round={true} />
          </PinterestShareButton>
          <RedditShareButton url={this.props.shareUrl}>
            <RedditIcon round={true} />
          </RedditShareButton>
          <TelegramShareButton url={this.props.shareUrl}>
            <TelegramIcon round={true} />
          </TelegramShareButton>
          <TwitterShareButton url={this.props.shareUrl}>
            <TwitterIcon round={true} />
          </TwitterShareButton>
          <WhatsappShareButton url={this.props.shareUrl}>
            <WhatsappIcon round={true} />
          </WhatsappShareButton>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" size="small" onClick={this.props.handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ShareDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  shareUrl: PropTypes.string.isRequired
}