import React from 'react';
import graphQLFetch from '../graphQLFetch';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

import { FormControl, Card, CardHeader, CardContent, Grid, Select, TextField, Button, Drawer } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import withToast from './withToast';
import Alert from '@material-ui/lab/Alert';

import store from '../store.js';

class IssueEdit extends React.Component {
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
    const { id } = this.props.match.params;
    if (id !== prevId) this.loadData();
  }

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

    const { id, title, status, owner, effort, description, created, due } = this.state.issue;
    const { isFieldsValid, drawer } = this.state;

    const propsId = this.props.match.params.id;
    if (id === undefined) {
      if (propsId !== null) {
        return (
          <StyledDrawer anchor={'right'} open={drawer} onClose={this.toggleDrawer(false)}>
            <h3>{`Issue with ID ${propsId} not found. If you just created it, wait while we redirect you to the edit page`}</h3>
          </StyledDrawer>
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
      <Drawer classes={{ paper: 'drawer-paper' }} anchor={'right'} open={drawer} onClose={this.toggleDrawer(false)}>
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
                  <Grid item xs={3}></Grid>
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
            startIcon={<ArrowBackIosIcon />}
            variant="contained"
            type="submit"
            style={{ backgroundColor: 'orangered', color: '#fff' }}
            to={`/edit/${id - 1}`}
            component={Link}
          >
            Prev
          </Button>
          <Button
            endIcon={<ArrowForwardIosIcon />}
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
