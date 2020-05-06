import React from 'react';
import IssueFilter from './IssueFilter';
import withToast from './withToast';
import graphQLFetch from '../graphQLFetch';
import store from '../store';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const statuses = ['New', 'Assigned', 'Fixed', 'Closed'];

class IssueReport extends React.Component {
  constructor(props) {
    super(props);
    const stats = store.initialData ? store.initialData.issueCounts : null;
    delete store.initialData;
    this.state = { stats };
  }

  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = {};
    if (params.get('status')) vars.status = params.get('status');

    const effortMin = parseInt(params.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    const effortMax = parseInt(params.get('effortMax'), 10);
    if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;

    const query = `query issueList(
      $status: StatusType
      $effortMin: Int
      $effortMax: Int
    ) {
      issueCounts(
        status: $status
        effortMin: $effortMin
        effortMax: $effortMax
      ) {
        owner New Assigned Fixed Closed
      }
    }`;
    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  componentDidMount() {
    const { stats } = this.state;
    if (stats == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
    } = prevProps;
    const {
      location: { search },
    } = this.props;
    if (prevSearch !== search) {
      this.loadData();
    }
  }

  loadData = async () => {
    const {
      location: { search },
      match,
      showError,
    } = this.props;
    const data = await IssueReport.fetchData(match, search, showError);
    if (data) {
      this.setState({ stats: data.issueCounts });
    }
  };

  render() {
    const { stats } = this.state;
    if (stats == null) return null;

    const headerColumns = statuses.map((status) => (
      <TableCell style={{ fontWeight: 'bold' }} key={status}>
        {status}
      </TableCell>
    ));

    const statRows = stats.map((counts) => (
      <TableRow key={counts.owner}>
        <TableCell style={{ fontWeight: 'bold' }}>{counts.owner}</TableCell>
        {statuses.map((status) => (
          <TableCell key={status}>{counts[status]}</TableCell>
        ))}
        <TableCell>{statuses.reduce((total, status) => total + counts[status], 0)}</TableCell>
      </TableRow>
    ));

    return (
      <>
        <IssueFilter urlBase="/report" />
        <TableContainer component={Paper} style={{ marginTop: 20, marginBottom: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {headerColumns}
                <TableCell style={{ fontWeight: 'bold' }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{statRows}</TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
}
const IssueReportWithToast = withToast(IssueReport);
IssueReportWithToast.fetchData = IssueReport.fetchData;
export default IssueReportWithToast;
