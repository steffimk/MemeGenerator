import React from 'react';
import './CustomAppBar.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button'
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
            {this.props.name}
            <Button color='inherit' style={{ marginLeft: screenWidth-250}} onClick={this.logout}>
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
