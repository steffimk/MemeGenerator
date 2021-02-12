import React from 'react';
import './CustomAppBar.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from 'prop-types';

export default class CustomAppBar extends React.Component { 

  render () {
    return (
      <div className="CustomAppBar">
        <AppBar position="static">
          <Toolbar>
            {this.props.name}
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
