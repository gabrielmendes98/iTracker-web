import React from 'react';
import graphQLFetch from '../graphQLFetch.js';
import { withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

class IssueAddNavItem extends React.Component {
  constructor() {
    super();
    this.state = { open: false, toastVisible: false, toastMessage: '' };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ open: false });
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    const query = `mutation issueAdd($issue: IssueInputs!) {
      issueAdd(issue: $issue) {
        id
      }
    }`;

    const data = await graphQLFetch(query, { issue }, this.showError);
    if (data) {
      const { history } = this.props;
      history.push(`/edit/${data.issueAdd.id}`);
    }
  };

  showError = (message) => {
    this.setState({ toastVisible: true, toastMessage: message });
  };

  render() {
    const { open, toastVisible, toastMessage } = this.state;
    return (
      <div>
        <Tooltip title="Add issue">
          <IconButton color="inherit" onClick={() => this.setState({ open: true })}>
            <AddIcon />
          </IconButton>
        </Tooltip>

        <Dialog open={open} onClose={() => this.setState({ open: false })}>
          <DialogTitle>Add Issue</DialogTitle>
          <DialogContent>
            <DialogContentText>To add an issue, please fill the form.</DialogContentText>
            <form id="issueAdd" name="issueAdd" onSubmit={this.handleSubmit}>
              <TextField autoFocus margin="dense" type="text" name="owner" label="Title" fullWidth />
              <TextField margin="dense" type="text" name="title" label="Owner" fullWidth />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ open: false })} color="primary">
              Cancel
            </Button>
            <Button type="submit" form="issueAdd" color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={toastVisible}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={3000}
          onClose={() => {
            this.setState({ toastVisible: false });
          }}
        >
          <Alert variant="filled" severity="error">
            {toastMessage}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

export default withRouter(IssueAddNavItem);
