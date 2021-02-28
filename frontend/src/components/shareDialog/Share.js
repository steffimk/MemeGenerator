import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { dialogStyle, MEME_URL } from '../../constants'
import {
  EmailShareButton,
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon
} from "react-share";

/**
 * This component is a dialog that, once it is open, gives the user the option to share a meme with others through an Email,
 * over Facebook, Reddit, Telegram, Twitter or Whatsapp.
 */
export default class ShareDialog extends Component {

  render() {
    var shareUrl = MEME_URL
    var isDisabled = true
    var message = "To share your meme, upload it marked as \'public\' or \'unlisted\' and open it in your meme history."
    const title = "MemeGenerator - Check out this meme!"
    const hashtag = "MemeGenerator"
    if(this.props.imageId) {
      shareUrl += '/' + this.props.imageId
      isDisabled = false
      message = "Make sure the meme you share is not marked as \'private\'."
    }
    if(this.props.isGallery === true) message = '' 

    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose} scroll="paper" style={{...dialogStyle, width:'520px'}}>
        <DialogTitle>Share this Meme</DialogTitle>
        <DialogContent dividers={true}>
        <EmailShareButton url={shareUrl} disabled={isDisabled} subject={title}>
            <EmailIcon round={true} />
          </EmailShareButton>
          <FacebookShareButton url={shareUrl} disabled={isDisabled} hashtag={hashtag} quote={title}>
            <FacebookIcon round={true} />
          </FacebookShareButton>
          <RedditShareButton url={shareUrl} disabled={isDisabled} title={title}>
            <RedditIcon round={true} />
          </RedditShareButton>
          <TelegramShareButton url={shareUrl} disabled={isDisabled} title={title}>
            <TelegramIcon round={true} />
          </TelegramShareButton>
          <TwitterShareButton url={shareUrl} disabled={isDisabled} title={title} hashtags={[hashtag]}>
            <TwitterIcon round={true} />
          </TwitterShareButton>
          <WhatsappShareButton url={shareUrl} disabled={isDisabled} title={title}>
            <WhatsappIcon round={true} />
          </WhatsappShareButton>
        </DialogContent>
        <DialogActions>
          <p>{message}</p>
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
  imageId: PropTypes.string,
  isGallery: PropTypes.bool.isRequired
}