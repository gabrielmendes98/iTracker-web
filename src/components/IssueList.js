import React from 'react';
import IssueFilter from './IssueFilter';
import IssueTable from './IssueTable';
import graphQLFetch from '../graphQLFetch';
import URLSearchParams from 'url-search-params';
import IssueDetail from './IssueDetail';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import store from '../store.js';

class IssueList extends React.Component {
  constructor() {
    super();
    const issues = store.initialData ? store.initialData.issueList : null;
    const selectedIssue = store.initialData ? store.initialData.issue : null;
    delete store.initialData;
    this.state = { issues, selectedIssue, toastVisible: false, toastMessage: '' };
  }

  componentDidMount() {
    const { issues } = this.state;
    if (issues == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
      match: {
        params: { id: prevId },
      },
    } = prevProps;
    const {
      location: { search },
      match: {
        params: { id },
      },
    } = this.props;
    if (prevSearch !== search || prevId !== id) {
      this.loadData();
    }
  }

  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = { hasSelection: false, selectedId: 0 };
    if (params.get('status')) vars.status = params.get('status');

    const effortMin = parseInt(params.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    const effortMax = parseInt(params.get('effortMax'), 10);
    if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;

    const {
      params: { id },
    } = match;
    const idInt = parseInt(id, 10);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }

    const query = `query issueList(
      $status: StatusType
      $effortMin: Int
      $effortMax: Int
      $hasSelection: Boolean!
      $selectedId: Int!
    ) {
      issueList(
        status: $status
        effortMin: $effortMin
        effortMax: $effortMax
      ) {
        id title status owner
        created effort due
      }
      issue(id: $selectedId) @include (if : $hasSelection) {
        id description title
      }
    }`;

    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  loadData = async () => {
    const {
      location: { search },
      match,
    } = this.props;
    const data = await IssueList.fetchData(match, search, this.showError);
    if (data) {
      this.setState({ issues: data.issueList, selectedIssue: data.issue });
    }
  };

  closeIssue = async (index) => {
    const query = `mutation issueClose($id: Int!) {
      issueUpdate(id: $id, changes: { status: Closed }) {
        id title status owner
        effort created due description
      }
    }`;

    const { issues } = this.state;
    const data = await graphQLFetch(query, { id: issues[index].id }, this.showError);
    if (data) {
      this.setState((prevState) => {
        const newList = [...prevState.issues];
        newList[index] = data.issueUpdate;
        return { issues: newList };
      });
    } else {
      this.loadData();
    }
  };

  deleteIssue = async (index) => {
    const query = `mutation issueDelete($id: Int!) {
      issueDelete(id: $id)
    }`;
    const { issues } = this.state;
    const {
      location: { pathname, search },
      history,
    } = this.props;
    const { id } = issues[index];
    const data = await graphQLFetch(query, { id }, this.showError);
    if (data && data.issueDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.issues];
        if (pathname === `/issues/${id}`) {
          history.push({ pathname: `/issues`, search });
        }
        newList.splice(index, 1);
        return { issues: newList };
      });
    } else {
      this.loadData();
    }
  };

  showError = (message) => {
    this.setState({ toastVisible: true, toastMessage: message });
  };

  toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    const { history } = this.props;
    history.push('/issues');
  };

  render() {
    const { issues } = this.state;
    if (issues === null) return null;
    const { selectedIssue } = this.state;
    const { toastVisible, toastMessage } = this.state;
    return (
      <React.Fragment>
        <IssueFilter />
        <IssueTable
          issues={issues}
          closeIssue={this.closeIssue}
          deleteIssue={this.deleteIssue}
          style={{ marginTop: 20, marginBottom: 20 }}
        />
        <IssueDetail issue={selectedIssue} drawer={true} toggleDrawer={this.toggleDrawer} />
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={toastVisible}
          autoHideDuration={3000}
          onClose={() => {
            this.setState({ toastVisible: false });
          }}
        >
          <Alert variant="filled" severity="error">
            {toastMessage}
          </Alert>
        </Snackbar>
      </React.Fragment>
    );
  }
}

export default IssueList;
