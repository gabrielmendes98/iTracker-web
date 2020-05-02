import React from 'react';
import IssueFilter from './IssueFilter';
import IssueTable from './IssueTable';
import graphQLFetch from '../graphQLFetch';
import URLSearchParams from 'url-search-params';
import IssueDetail from './IssueDetail';
import { Route } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [], toastVisible: false, toastMessage: '' };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
    } = prevProps;
    const {
      location: { search },
    } = this.props;
    if (prevSearch !== search) this.loadData();
  }

  loadData = async () => {
    const {
      location: { search },
    } = this.props;
    const params = new URLSearchParams(search);
    const vars = {};
    if (params.get('status')) vars.status = params.get('status');
    const effortMin = parseInt(params.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    const effortMax = parseInt(params.get('effortMax'), 10);
    if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;
    const query = `query issueList($status: StatusType, $effortMin: Int, $effortMax: Int) {
      issueList(status: $status, effortMin: $effortMin, effortMax: $effortMax) {
        id title status owner
        created effort due
      }
    }`;
    const data = await graphQLFetch(query, vars, this.showError);
    if (data) {
      this.setState({ issues: data.issueList });
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

  render() {
    const { state, createIssue } = this;
    const { match } = this.props;
    const { toastVisible, toastMessage } = this.state;
    return (
      <React.Fragment>
        <IssueFilter />
        <IssueTable
          issues={state.issues}
          closeIssue={this.closeIssue}
          deleteIssue={this.deleteIssue}
          style={{ marginTop: 20, marginBottom: 20 }}
        />
        <Route path={`${match.path}/:id`} component={IssueDetail} />
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
