import React from 'react';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import URLSearchParams from 'url-search-params';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/styles';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const styles = (theme) => ({
  header: {
    backgroundColor: red[500],
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
    const { history } = this.props;

    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (effortMin) params.set('effortMin', effortMin);
    if (effortMax) params.set('effortMax', effortMax);

    const search = params.toString() ? `?${params.toString()}` : '';

    history.push({
      pathname: '/issues',
      search,
    });
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
        <ExpansionPanelSummary className={classes.header} expandIcon={<ExpandMoreIcon style={{ color: '#fff' }} />}>
          <Typography variant="h6">Filter</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={1}>
            <Grid item xs={6} sm={4} md={3} lg={1}>
              <FormControl style={{ marginRight: 20 }}>
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
            <Grid item xs={6} sm={4} md={3} lg={1}>
              <TextField
                style={{ width: 100 }}
                label="Effort Min"
                variant="outlined"
                value={effortMin}
                margin="dense"
                onChange={this.onChangeEffortMin}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={1}>
              <TextField
                style={{ width: 100 }}
                label="Effort Max"
                variant="outlined"
                value={effortMax}
                margin="dense"
                onChange={this.onChangeEffortMax}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={1}>
              <Button
                style={{ backgroundColor: red[500], color: '#fff' }}
                variant="contained"
                type="button"
                onClick={this.applyFilter}
              >
                Apply
              </Button>{' '}
              {resetButton}
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withRouter(withStyles(styles)(IssueFilter));
