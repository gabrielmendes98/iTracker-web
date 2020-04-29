import React from 'react';
import './styles.css';
import { NavLink } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';

const MenuGrow = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button color="inherit" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <MoreVertIcon />
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>About</MenuItem>
      </Menu>
    </div>
  );
};

class NavBar extends React.Component {
  state = {
    value: 0,
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    return (
      <AppBar id="app-bar" position="static">
        <Toolbar>
          <div style={{ display: 'flex', flex: 1 }}>
            <Box mr={5}>
              <Typography variant="h6">Issue Tracker</Typography>
            </Box>
            <Button color="inherit" exact to="/" component={NavLink}>
              Home
            </Button>
            <Button color="inherit" to="/issues" component={NavLink}>
              Issue List
            </Button>
            <Button color="inherit" to="/report" component={NavLink}>
              Report
            </Button>
          </div>

          <Tooltip title="Add issue">
            <IconButton color="inherit">
              <AddIcon />
            </IconButton>
          </Tooltip>
          <MenuGrow />
        </Toolbar>
      </AppBar>
    );
  }
}

export default NavBar;
