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
import withToast from './withToast';

class IssueAddNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
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

    const { showError } = this.props;
    const data = await graphQLFetch(query, { issue }, showError);
    if (data) {
      const { history } = this.props;
      history.push(`/edit/${data.issueAdd.id}`);
    }
  };

  render() {
    const { open } = this.state;
    const {
      user: { signedIn },
    } = this.props;
    return (
      <div>
        <Tooltip title="Add issue">
          <span className="issue-add-navitem">
            <IconButton color="inherit" onClick={() => this.setState({ open: true })} disabled={!signedIn}>
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Dialog open={open} onClose={() => this.setState({ open: false })}>
          <DialogTitle>Add Issue</DialogTitle>
          <DialogContent>
            <DialogContentText>To add an issue, please fill the form.</DialogContentText>
            <form id="issueAdd" name="issueAdd" onSubmit={this.handleSubmit}>
              <TextField autoFocus margin="dense" type="text" name="title" label="Title" fullWidth />
              <TextField margin="dense" type="text" name="owner" label="Owner" fullWidth />
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
      </div>
    );
  }
}

export default withToast(withRouter(IssueAddNavItem));
