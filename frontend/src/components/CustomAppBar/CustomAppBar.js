import React from 'react';
import './CustomAppBar.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button'
import { Link } from "react-router-dom";
import { LS_JWT, LS_USERNAME} from '../../constants'

export default class CustomAppBar extends React.Component { 

  logout = () => {
    localStorage.removeItem(LS_JWT)
    localStorage.removeItem(LS_USERNAME)
    window.location.reload() // Reload page to check whether still authenticated to see this page
  }

  render () {
    const screenWidth = window.innerWidth
    return (
      <div className="CustomAppBar">
        <AppBar position="static">
          <Toolbar>
            <Link to='/' style={{ color: 'white', textDecoration: 'none' }}>
              {this.props.name}
            </Link>
            <Button style={{ marginLeft: screenWidth/5 }}>
              <Link to='/editor' style={{ color: 'white', textDecoration: 'none' }}>
                Editor
              </Link>
            </Button>
            <Button style={{ marginLeft: screenWidth/5 }}>
              <Link to='/history' style={{ color: 'white', textDecoration: 'none' }}>
                My Memes
              </Link>
            </Button>
              {this.props.children}
            <Button color='inherit' style={{ marginLeft: screenWidth/5 }} onClick={this.logout}>
              Logout
            </Button>
          </Toolbar>
      </AppBar>
      </div>
    );
  }
}

CustomAppBar.propTypes = {
   name: PropTypes.string,
};

CustomAppBar.defaultProps = {
   name: 'MemeGen',
};
