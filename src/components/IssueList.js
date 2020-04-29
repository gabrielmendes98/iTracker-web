import React from 'react';
import IssueFilter from './IssueFilter';
import IssueTable from './IssueTable';
import IssueAdd from './IssueAdd';
import graphQLFetch from '../graphQLFetch';
import URLSearchParams from 'url-search-params';
import IssueDetail from './IssueDetail';
import { Route } from 'react-router-dom';

class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
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
    const data = await graphQLFetch(query, vars);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  };

  createIssue = async (issue) => {
    const query = `mutation issueAdd($issue: IssueInputs!) {
      issueAdd(issue: $issue) {
        id
      }
    }`;
    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
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
    const data = await graphQLFetch(query, { id: issues[index].id });
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
    const data = await graphQLFetch(query, { id });
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

  render() {
    const { state, createIssue } = this;
    const { match } = this.props;
    return (
      <React.Fragment>
        <IssueFilter />
        <IssueTable
          issues={state.issues}
          closeIssue={this.closeIssue}
          deleteIssue={this.deleteIssue}
          style={{ marginTop: 20, marginBottom: 20 }}
        />
        <IssueAdd createIssue={createIssue} />
        <Route path={`${match.path}/:id`} component={IssueDetail} />
      </React.Fragment>
    );
  }
}

export default IssueList;
