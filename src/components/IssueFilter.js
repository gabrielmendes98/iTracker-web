import React from 'react';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import URLSearchParams from 'url-search-params';

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
    return (
      <div>
        {'Status: '}
        <select value={status} onChange={this.onChangeStatus}>
          <option value="">(All)</option>
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="Fixed">Fixed</option>
          <option value="Closed">Closed</option>
        </select>{' '}
        Effort between: <input size={5} value={effortMin} onChange={this.onChangeEffortMin} />
        {' - '}
        <input size={5} value={effortMax} onChange={this.onChangeEffortMax} />{' '}
        <Button variant="contained" type="button" onClick={this.applyFilter}>
          Apply
        </Button>{' '}
        <Button variant="outlined" type="button" onClick={this.showOriginalFilter} disabled={!changed}>
          Reset
        </Button>
      </div>
    );
  }
}

export default withRouter(IssueFilter);
