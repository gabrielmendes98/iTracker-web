import React, { Component } from 'react';
import googleIcon from '../../assets/search.png';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';

class SignInNavItem extends Component {
  constructor() {
    super();
    this.state = { modalOpen: false, anchorEl: null, user: { signedIn: false, givenName: '' } };
  }

  showModal = () => {
    this.setState({ modalOpen: true });
  };

  hideModal = () => {
    this.setState({ modalOpen: false });
  };

  showPopover = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  hidePopover = () => {
    this.setState({ anchorEl: null });
  };

  signIn = () => {
    this.hideModal();
    this.setState({ user: { signedIn: true, givenName: 'User1' } });
  };

  signOut = () => {
    this.setState({ user: { signedIn: false, givenName: '' } });
    this.setState({ anchorEl: null });
  };

  render() {
    const { user, anchorEl } = this.state;
    if (user.signedIn) {
      return (
        <>
          <Button
            style={{ borderColor: 'white', color: 'white', textTransform: 'none' }}
            variant="outlined"
            type="button"
            onClick={this.showPopover}
          >
            {user.givenName}
          </Button>
          <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} role={undefined} transition>
            {({ TransitionProps, placement }) => (
              <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
                <Paper>
                  <ClickAwayListener onClickAway={this.hidePopover}>
                    <MenuList autoFocusItem={Boolean(anchorEl)}>
                      <MenuItem onClick={this.signOut}>Sign out</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </>
      );
    }

    const { modalOpen } = this.state;
    return (
      <>
        <Button
          style={{ borderColor: 'white', color: 'white', textTransform: 'none' }}
          variant="outlined"
          type="button"
          onClick={this.showModal}
        >
          Sign in
        </Button>
        <Dialog onClose={this.hideModal} open={modalOpen} fullWidth maxWidth="xs">
          <MuiDialogTitle onClose={this.hideModal}>Sign in</MuiDialogTitle>
          <MuiDialogContent dividers>
            <Button
              variant="contained"
              style={{ backgroundColor: 'red', color: 'white', textTransform: 'none', width: '100%' }}
              onClick={this.signIn}
            >
              <div style={{ width: '40%' }}>
                <Paper
                  elevation={0}
                  style={{
                    padding: 0,
                    height: 30,
                    width: 30,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img src={googleIcon} height="24" width="24" />
                </Paper>
              </div>
              <div style={{ width: '60%', textAlign: 'left', fontSize: 18 }}>Google</div>
            </Button>
          </MuiDialogContent>
          <MuiDialogActions>
            <p style={{ color: 'blue', cursor: 'pointer' }} onClick={this.hideModal}>
              Cancel
            </p>
          </MuiDialogActions>
        </Dialog>
      </>
    );
  }
}

export default SignInNavItem;
