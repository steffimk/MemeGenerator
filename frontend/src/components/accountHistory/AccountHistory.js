import { GridList, GridListTile, GridListTileBar, IconButton } from '@material-ui/core'
import React, { Component } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom'
import { authorizedFetch, LIKE_ENDPOINT, MEMES_ENDPOINT, TEMPLATE_ENDPOINT } from '../../communication/requests'
import CustomAppBar from '../CustomAppBar/CustomAppBar'
import SingleImage from '../gallery/SingleImage'
import './AccountHistory.css'
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import EditIcon from '@material-ui/icons/Edit'
import { LS_USERNAME } from '../../constants'

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

  getOwnMemes = () => {
    const username = localStorage.getItem('memeGen_username');
    const endpointWithParam = `${MEMES_ENDPOINT}/${username}`;
    authorizedFetch(endpointWithParam, 'GET', {}, this.isNotAuthenticated)
      .then((json) => this.setState({ ownMemes: json.data.memes }))
      .catch((e) => console.log(e));
  };

  getOwnTemplates = () => {
    const username = localStorage.getItem('memeGen_username');
    const endpointWithParam = `${TEMPLATE_ENDPOINT}/${username}`;
    authorizedFetch(endpointWithParam, 'GET', {}, this.isNotAuthenticated)
      .then((json) => this.setState({ ownTemplates: json.data.templates }))
      .catch((e) => console.log(e));
  };

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
        <img src={imageSrc} alt={image._id} style={{width:'100%', height: 'auto'}}/>
        <Link to={linkRoute} key={image._id}>
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

  likeMeme = (id) => {
    const username = localStorage.getItem(LS_USERNAME)
    authorizedFetch(LIKE_ENDPOINT, 'POST', JSON.stringify({memeId: id, username: username}), this.isNotAuthenticated)
    .catch((error) => { console.error('Error:', error) });
    let newMemes = this.state.ownMemes.map(img => { 
        if(img._id === id) {
            if (img.likes && img.likes.includes(username)) {
                // Do nothing. User alredy likes meme.
            } else if (img.likes) {
                img.likes.push(username)
            } else {
                img.likes = [username]
            }
        }
        return img
    })
    this.setState({ ownMemes: newMemes })
}

  render() {
    // If not logged in: Redirect to login page
    if (!this.state.isAuthenticated) return <Redirect to="/login" />;
    // try to get image id from url
    const { id } = this.props.match.params;
    const isMeme = this.state.ownMemes.filter((meme) => meme._id === id).length > 0 ? true : false
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
        {isMeme && <SingleImage images={this.state.ownMemes} id={id} parentRoute="/history/" likeImage={this.likeMeme}/>}
        {/* {!isMeme && <SingleImage images={this.state.ownTemplates} id={id} parentRoute="/history/"/>} */}
      </div>
    );
  }
}

const gridListStyle = { flexWrap: 'nowrap', transform: 'translateZ(0)' };

export default withRouter(AccountHistory);
