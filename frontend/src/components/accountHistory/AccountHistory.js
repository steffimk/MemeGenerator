import { Button, GridList, GridListTile, GridListTileBar, IconButton } from '@material-ui/core'
import React, { Component } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom'
import { authorizedFetch, viewMeme, LIKE_ENDPOINT, MEMES_ENDPOINT, TEMPLATE_ENDPOINT } from '../../communication/requests'
import CustomAppBar from '../customAppBar/CustomAppBar'
import SingleImage from '../gallery/SingleImage'
import './AccountHistory.css'
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import EditIcon from '@material-ui/icons/Edit'
import { LS_USERNAME } from '../../constants'

/**
 * This component gives an overview over the own memes and templates.
 */
class AccountHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownMemes: [],
      ownTemplates: [],
      isAuthenticated: true,
    };
  }

  componentDidMount() {
    this.getOwnMemes();
    this.getOwnTemplates();
  }

  isNotAuthenticated = () => {
    this.setState({ isAuthenticated: false})
  }

  /**
   * Gets the own memes from the backend
   */
  getOwnMemes = () => {
    const username = localStorage.getItem(LS_USERNAME);
    const endpointWithParam = `${MEMES_ENDPOINT}${username}`;
    authorizedFetch(endpointWithParam, 'GET', {}, this.isNotAuthenticated)
      .then((json) => this.setState({ ownMemes: json.data.memes }))
      .catch((e) => console.log(e));
  };

  /**
   * Gets the own templates from the backend
   */
  getOwnTemplates = () => {
    const username = localStorage.getItem(LS_USERNAME);
    const endpointWithParam = `${TEMPLATE_ENDPOINT}/${username}`;
    authorizedFetch(endpointWithParam, 'GET', {}, this.isNotAuthenticated)
      .then((json) => this.setState({ ownTemplates: json.data.templates }))
      .catch((e) => console.log(e));
  };

  /**
   * 
   * @param {*} image 
   * @param {*} imageSrc 
   * @param {*} currentRoute 
   * @param {*} isMeme 
   */
  renderImage = (image, imageSrc, currentRoute, isMeme) => {
    let imageRoute;
    if (currentRoute.slice(-1) === '/') {
      imageRoute = currentRoute + image._id;
    } else {
      imageRoute = currentRoute + '/' + image._id;
    }
    const linkRoute = isMeme? imageRoute : `/editor/${image._id}`
    const icon = isMeme ? <FullscreenIcon style={{ color: 'white' }} /> : <EditIcon style={{ color: 'white' }} />;
    return (
      <GridListTile key={image._id} style={{width:'27%'}}>
        <div className="grid-image-container">
          <img src={imageSrc} alt={image._id} style={{width:'100%', height: 'auto'}}/>
          {image.privacyLabel && <div className="privacy-label">
            <Button variant="contained" size="small" disabled style={{backgroundColor:'lightgrey', color:'dimgrey'}}>
              {image.privacyLabel}
            </Button>
          </div>}
        </div>
        <Link to={linkRoute} key={image._id} onClick={() => this.clickOnImageAction(isMeme, image._id)}>
          <GridListTileBar
            title={image.name}
            actionIcon={
              <IconButton>
                {icon}
              </IconButton>
            }
          />
        </Link>
      </GridListTile>
    );
  };

  likeMeme = (id, isDislike) => {
    const username = localStorage.getItem(LS_USERNAME);
    let like= {username: username, date: Date.now(), isDislike: isDislike};
    authorizedFetch(LIKE_ENDPOINT,
        'POST',
        JSON.stringify({memeId: id, username: username, date: Date.now(), isDislike: isDislike}),
        this.isNotAuthenticated)
    .catch((error) => { console.error('Error:', error) });
    let newMemes = this.state.ownMemes.map(img => {
        if(img._id === id) {
            // Like logs for Charts
            if(img.likeLogs) {
                img.likeLogs.push(like);
            } else {
                img.likeLogs = [like];
            }
            if (img.likes && img.likes.includes(username) && isDislike) {
                img.likes.splice(img.likes.indexOf(username),1) // Remove username from likes
                // Do nothing. User alredy likes meme.
            } else if (img.likes && !isDislike) {
                img.likes.push(username)
            } else if (!isDislike) {
                img.likes = [username]
            }
          }
        return img
    })
    this.setState({ ownMemes: newMemes })
  }

  viewMeme = (id, date) => viewMeme(id, date, this.isNotAuthenticated)

  clickOnImageAction = (isMeme, id) => {
      if (!isMeme) return
      else viewMeme(id, Date.now(), this.isNotAuthenticated)
  }

  render() {
    // If not logged in: Redirect to login page
    if (!this.state.isAuthenticated) return <Redirect to="/login" />;
    // try to get image id from url
    const { id } = this.props.match.params;
    const isMeme = this.state.ownMemes.filter((meme) => meme._id === id).length > 0
    const currentRoute = this.props.location.pathname
    const renderedMemes = this.state.ownMemes.map((meme) => this.renderImage(meme, meme.img, currentRoute, true));
    const renderedTemplates = this.state.ownTemplates.map((template) =>
      this.renderImage(template, template.url, currentRoute, false)
    );

    return (
      <div>
        <CustomAppBar />
        <h2 style={{ paddingLeft: '8px' }}>Your memes: </h2>
        <div className="grid-root">
          <GridList style={gridListStyle} cellHeight={window.innerHeight / 2.3} cols={3.5}>
            {renderedMemes}
          </GridList>
        </div>
        <h2 style={{ paddingLeft: '8px' }}>Your drafts: </h2>
        <div className="grid-root">
          <GridList style={gridListStyle} cellHeight={window.innerHeight / 2.3} cols={3.5}>
            {renderedTemplates}
          </GridList>
        </div>
        {isMeme && (
          <SingleImage
            images={this.state.ownMemes}
            id={id}
            parentRoute="/history/"
            likeImage={this.likeMeme}
            viewMeme={this.viewMeme}
          />
        )}
        {/* {!isMeme && <SingleImage images={this.state.ownTemplates} id={id} parentRoute="/history/"/>} */}
      </div>
    );
  }
}

const gridListStyle = { flexWrap: 'nowrap', transform: 'translateZ(0)' };

export default withRouter(AccountHistory);
