/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { withRouter } from 'react-router-dom';

import URLSearchParams from 'url-search-params';

import {
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  InputLabel,
  FormControl,
  Select,
  TextField,
  Grid,
} from '@material-ui/core';

import { red } from '@material-ui/core/colors';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/styles';

const styles = (theme) => ({
  root: {
    backgroundColor: red[500],
    color: '#fff',
  },
  expandIcon: {
    color: '#fff',
  },
});

class IssueFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    const status = params.get('status') || '';
    const effortMin = params.get('effortMin') || '';
    const effortMax = params.get('effortMax') || '';
    this.state = { status, effortMin, effortMax, changed: false };
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
    } = prevProps;
    const {
      location: { search },
    } = this.props;
    if (prevSearch !== search) this.showOriginalFilter();
  }

  showOriginalFilter = () => {
    const {
      location: { search },
    } = this.props;
    const params = new URLSearchParams(search);
    const status = params.get('status') || '';
    const effortMin = params.get('effortMin') || '';
    const effortMax = params.get('effortMax') || '';
    this.setState({ status, effortMin, effortMax, changed: false });
  };

  onChangeStatus = (e) => {
    this.setState({ status: e.target.value, changed: true });
  };

  applyFilter = () => {
    const { status, effortMin, effortMax } = this.state;
    const { history, urlBase } = this.props;

    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (effortMin) params.set('effortMin', effortMin);
    if (effortMax) params.set('effortMax', effortMax);

    const search = params.toString() ? `?${params.toString()}` : '';

    history.push({ pathname: urlBase, search });
  };

  onChangeEffortMin = (e) => {
    const effortMin = e.target.value;
    if (effortMin.match(/^\d*$/)) this.setState({ effortMin, changed: true });
  };

  onChangeEffortMax = (e) => {
    const effortMax = e.target.value;
    if (effortMax.match(/^\d*$/)) this.setState({ effortMax, changed: true });
  };

  render() {
    const { status, changed, effortMin, effortMax } = this.state;
    const { classes } = this.props;
    let resetButton;
    if (changed)
      resetButton = (
        <Button
          style={{ borderColor: red[500], color: red[500] }}
          variant="outlined"
          type="button"
          onClick={this.showOriginalFilter}
        >
          Reset
        </Button>
      );
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary className={classes.root} expandIcon={<ExpandMoreIcon className={classes.expandIcon} />}>
          <Typography variant="h6">Filter</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3} md={2} lg={1} xl={1}>
              <FormControl style={{ display: 'flex', width: '100%' }}>
                <InputLabel>Status</InputLabel>
                <Select native value={status} onChange={this.onChangeStatus}>
                  <option value="" />
                  <option value="">All</option>
                  <option value="New">New</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Closed">Closed</option>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3} md={2} lg={2} xl={1}>
              <TextField
                label="Effort Min"
                variant="outlined"
                value={effortMin}
                margin="dense"
                onChange={this.onChangeEffortMin}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2} lg={2} xl={1}>
              <TextField
                label="Effort Max"
                variant="outlined"
                value={effortMax}
                margin="dense"
                onChange={this.onChangeEffortMax}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2} lg={1} xl={1}>
              <Button
                style={{ backgroundColor: red[500], color: '#fff', marginTop: 8, marginBottom: 4 }}
                variant="contained"
                type="button"
                onClick={this.applyFilter}
              >
                Apply
              </Button>
              {' '}
              {resetButton}
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withRouter(withStyles(styles)(IssueFilter));
