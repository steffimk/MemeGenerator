import { GridList, GridListTile, GridListTileBar } from '@material-ui/core'
import React, { Component } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom'
import { authorizedFetch, MEMES_ENDPOINT, TEMPLATE_ENDPOINT } from '../../communication/requests'
import CustomAppBar from '../CustomAppBar/CustomAppBar'
import SingleImage from '../gallery/SingleImage'
import './AccountHistory.css'
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

  getOwnMemes = () => {
    const username = localStorage.getItem('memeGen_username');
    const endpointWithQuery = `${MEMES_ENDPOINT}?username=${username}`;
    authorizedFetch(endpointWithQuery, 'GET')
      .then((res) => {
        if (res.ok) return res.json();
        else if (res.status === 401) this.setState({ isAuthenticated: false });
        return Promise.reject('API Responded with an error: ' + res.status + ' ' + res.statusText);
      })
      .then((json) => this.setState({ ownMemes: json.data.memes }))
      .catch((e) => console.log(e));
  };

  getOwnTemplates = () => {
    const username = localStorage.getItem('memeGen_username');
    const endpointWithQuery = `${TEMPLATE_ENDPOINT}?username=${username}`;
    authorizedFetch(endpointWithQuery, 'GET')
      .then((res) => {
        if (res.ok) return res.json();
        else if (res.status === 401) this.setState({ isAuthenticated: false });
        return Promise.reject(`API Responded with an error: ${res.status} ${res.statusText}`);
      })
      .then((json) => this.setState({ ownTemplates: json.data.templates }))
      .catch((e) => console.log(e));
  };

  renderImage = (image, imageSrc, currentRoute) => {
    let imageRoute;
    if (currentRoute.slice(-1) === '/') {
      imageRoute = currentRoute + image._id;
    } else {
      imageRoute = currentRoute + '/' + image._id;
    }
    return (
      <GridListTile key={image._id}>
        <img src={imageSrc} alt={image._id} />
        <Link to={imageRoute} key={image._id}>
          <GridListTileBar title={image.name} />
        </Link>
      </GridListTile>
    );
  };

  render() {
    // If not logged in: Redirect to login page
    if (!this.state.isAuthenticated) return <Redirect to="/login" />;
    // try to get image id from url
    const { id } = this.props.match.params;
    const isMeme = this.state.ownMemes.filter((meme) => meme._id === id).length > 0 ? true : false
    const currentRoute = this.props.location.pathname
    const renderedMemes = this.state.ownMemes.map((meme) => this.renderImage(meme, meme.img, currentRoute));
    const renderedTemplates = this.state.ownTemplates.map((template) =>
      this.renderImage(template, template.url, currentRoute)
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
        ({isMeme && <SingleImage images={this.state.ownMemes} id={id} parentRoute="/history/"/>})
        ({!isMeme && <SingleImage images={this.state.ownTemplates} id={id} parentRoute="/history/"/>})
      </div>
    );
  }
}

const gridListStyle = { flexWrap: 'nowrap', transform: 'translateZ(0)' };

export default withRouter(AccountHistory);
