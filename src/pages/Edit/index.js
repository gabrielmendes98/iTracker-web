/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Link } from 'react-router-dom';

import { FormControl, Card, CardHeader, CardContent, Grid, Select, TextField, Button, Drawer } from '@material-ui/core';
import { ArrowForwardIos, ArrowBackIos } from '@material-ui/icons';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Alert from '@material-ui/lab/Alert';

import DateFnsUtils from '@date-io/date-fns';

import graphQLFetch from '../../services/graphQLFetch';
import UserContext from '../../UserContext';
import withToast from '../../components/withToast';
import store from '../../store';

class IssueEdit extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query issue($id: Int!) {
      issue(id: $id) {
        id title status owner
        effort created due description
      }
    }`;

    const {
      params: { id },
    } = match;
    const intId = parseInt(id, 10);
    const result = await graphQLFetch(query, { id: intId }, showError);
    return result;
  }

  constructor() {
    super();
    const issue = store.initialData ? store.initialData.issue : null;
    delete store.initialData;
    this.state = {
      issue,
      isFieldsValid: true,
      drawer: true,
    };
  }

  componentDidMount() {
    const { issue } = this.state;
    if (issue === null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const prevId = prevProps.match.params.id;
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if (id !== prevId) this.loadData();
  }

  loadData = async () => {
    const { match, showError } = this.props;
    const data = await IssueEdit.fetchData(match, null, showError);
    this.setState({ issue: data ? data.issue : {} });
  };

  onChange = (e, naturalValue) => {
    const { name, value: textValue } = e.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState((prevState) => ({
      issue: { ...prevState.issue, [name]: value },
    }));
  };

  handleDateChange = (date) => {
    const newDate = new Date(date);
    this.setState((prevState) => ({
      issue: { ...prevState.issue, due: newDate },
    }));
  };

  isAllFieldsValid = (e) => {
    e.preventDefault();
    const form = document.forms.issueEdit;
    let isValid = true;
    [...form.elements].forEach((input) => {
      if (input.getAttribute('aria-invalid') === 'true') {
        isValid = false;
      }
    });
    return isValid;
  };

  handleSubmit = async (e) => {
    if (!this.isAllFieldsValid(e)) {
      this.setState({ isFieldsValid: false });
      return;
    }
    e.preventDefault();
    const { issue } = this.state;
    const query = `mutation issueUpdate(
      $id: Int!
      $changes: IssueUpdateInputs!
    ) {
      issueUpdate(
        id: $id
        changes: $changes
      ) {
        id title status owner
        effort created due description
      }
    }`;

    const { id, created, ...changes } = issue;
    const { showSuccess, showError } = this.props;
    changes.effort = parseInt(changes.effort, 10);
    const intId = parseInt(id, 10);
    const data = await graphQLFetch(query, { id: intId, changes }, showError);
    if (data) {
      this.setState({ issue: data.issueUpdate, isFieldsValid: true });
      showSuccess('Updated issue successfully');
    }
  };

  toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    const { history } = this.props;
    history.goBack();
    this.setState({ drawer: open });
  };

  render() {
    const { issue } = this.state;
    if (issue === null) return null;

    const {
      issue: { id, title, status, owner, effort, description, created, due },
    } = this.state;
    const { isFieldsValid, drawer } = this.state;
    const {
      match: {
        params: { id: propsId },
      },
    } = this.props;

    if (id === undefined) {
      if (propsId !== null) {
        return (
          <Drawer anchor="right" open={drawer} onClose={this.toggleDrawer(false)}>
            <h3>{`Issue with ID ${propsId} not found. If you just created it, wait while we redirect you to the edit page`}</h3>
          </Drawer>
        );
      }
      return null;
    }

    let validationMessage;
    if (!isFieldsValid) {
      validationMessage = (
        <Alert variant="filled" severity="error">
          Please correct the fields in red
        </Alert>
      );
    }

    const user = this.context;

    return (
      <Drawer classes={{ paper: 'drawer-paper' }} anchor="right" open={drawer} onClose={this.toggleDrawer(false)}>
        <Card style={{ margin: '20px', width: '90%', height: 'auto', minHeight: '720px' }}>
          <CardHeader
            title={`Editing issue ${id}`}
            style={{ backgroundColor: 'orangered', color: 'white', textAlign: 'center' }}
          />
          <CardContent>
            <FormControl style={{ display: 'block', marginBottom: 15 }}>
              <form name="issueEdit" onSubmit={this.handleSubmit}>
                <Grid container alignItems="flex-start" spacing={2}>
                  <Grid item xs={3}>
                    <span>Created</span>
                  </Grid>
                  <Grid item xs={9}>
                    {created.toDateString()}
                  </Grid>
                  <Grid item xs={3}>
                    <span>Status</span>
                  </Grid>
                  <Grid item xs={9}>
                    <Select style={{ width: '100%' }} native name="status" value={status} onChange={this.onChange}>
                      <option value="" />
                      <option value="New">New</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Fixed">Fixed</option>
                      <option value="Closed">Closed</option>
                    </Select>
                  </Grid>
                  <Grid item xs={3}>
                    <span>Owner</span>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      style={{ width: '100%' }}
                      name="owner"
                      value={owner}
                      onChange={this.onChange}
                      key={id}
                      variant="outlined"
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <span>Effort</span>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      style={{ width: '100%' }}
                      name="effort"
                      value={effort}
                      onChange={this.onChange}
                      key={id}
                      variant="outlined"
                      type="number"
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <span>Due</span>
                  </Grid>
                  <Grid item xs={9}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        style={{ width: '100%' }}
                        value={due}
                        onChange={this.handleDateChange}
                        key={id}
                        name="due"
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="dense"
                        minDate={Date.now()}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={3}>
                    <span>Title</span>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      style={{ width: '100%' }}
                      name="title"
                      value={title}
                      onChange={this.onChange}
                      key={id}
                      variant="outlined"
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <span>Description</span>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      style={{ width: '100%' }}
                      name="description"
                      value={description || ''}
                      onChange={this.onChange}
                      key={id}
                      rows={8}
                      multiline
                      variant="outlined"
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={3} />
                  <Grid item xs={9} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button disabled={!user.signedIn} variant="contained" type="submit" color="primary">
                      Submit
                    </Button>
                    <Button
                      style={{
                        color: 'white',
                        backgroundColor: '#f44336',
                      }}
                      variant="contained"
                      onClick={this.toggleDrawer(false)}
                    >
                      Close
                    </Button>
                  </Grid>
                  <Grid item xs={7}>
                    {validationMessage}
                  </Grid>
                </Grid>
              </form>
            </FormControl>
          </CardContent>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px', width: '90%' }}>
          <Button
            startIcon={<ArrowBackIos />}
            variant="contained"
            type="submit"
            style={{ backgroundColor: 'orangered', color: '#fff' }}
            to={`/edit/${id - 1}`}
            component={Link}
          >
            Prev
          </Button>
          <Button
            endIcon={<ArrowForwardIos />}
            variant="contained"
            type="submit"
            style={{ backgroundColor: 'orangered', color: '#fff' }}
            to={`/edit/${id + 1}`}
            component={Link}
          >
            Next
          </Button>
        </div>
      </Drawer>
    );
  }
}

IssueEdit.contextType = UserContext;

const IssueEditWithToast = withToast(IssueEdit);
IssueEditWithToast.fetchData = IssueEdit.fetchData;

export default IssueEditWithToast;
