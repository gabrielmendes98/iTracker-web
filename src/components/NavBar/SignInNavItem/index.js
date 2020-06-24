/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Avatar,
  MenuItem,
  ClickAwayListener,
  Grow,
  Popper,
  MenuList,
} from '@material-ui/core';

import btnGoogle from '../../../assets/btnGoogle.png';
import withToast from '../../withToast';

import './styles.css';

class SignInNavItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      anchorEl: null,
    };
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

  signIn = async () => {
    this.hideModal();
    const { showError } = this.props;
    let googleToken;
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      googleToken = googleUser.getAuthResponse().id_token;
    } catch (error) {
      showError(`Error authenticating with Google: ${error.error}`);
    }

    try {
      const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
      const response = await fetch(`${apiEndpoint}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ google_token: googleToken }),
      });
      const body = await response.text();
      const result = JSON.parse(body);
      const { signedIn, givenName, picture } = result;

      const { onUserChange } = this.props;
      onUserChange({ signedIn, givenName, picture });
    } catch (error) {
      showError(`Error signing into the app: ${error}`);
    }
  };

  signOut = async () => {
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const { showError } = this.props;
    try {
      await fetch(`${apiEndpoint}/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      const auth2 = window.gapi.auth2.getAuthInstance();
      await auth2.signOut();
      const { onUserChange } = this.props;
      onUserChange({ signedIn: false, givenName: '', picture: '' });
      this.setState({ anchorEl: null });
    } catch (error) {
      showError(`Error signing out: ${error}`);
    }
  };

  render() {
    const { anchorEl } = this.state;
    const { user } = this.props;
    if (user.signedIn) {
      return (
        <>
          <div className="user-control" onClick={this.showPopover}>
            <Avatar alt={user.givenName} src={user.picture} style={{ cursor: 'pointer' }} />
            <Button className="username-button" variant="outlined" type="button">
              {user.givenName}
            </Button>
          </div>
          <Popper className="popper" open={Boolean(anchorEl)} anchorEl={anchorEl} role={undefined} transition>
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
        <Dialog onClose={this.hideModal} open={modalOpen}>
          <DialogTitle onClose={this.hideModal}>Sign in</DialogTitle>
          <DialogContent dividers>
            <img
              id="sign-in-button"
              src={btnGoogle}
              style={{ width: 'auto', height: 60 }}
              onClick={this.signIn}
              alt="Login with Google"
            />
          </DialogContent>
          <DialogActions>
            <p style={{ color: 'blue', cursor: 'pointer' }} onClick={this.hideModal}>
              Cancel
            </p>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default withToast(SignInNavItem);
