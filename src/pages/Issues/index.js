import React from 'react';

import Button from '@material-ui/core/Button';

import URLSearchParams from 'url-search-params';

import IssueFilter from './IssueFilter';
import IssueTable from './IssueTable';
import graphQLFetch from '../../services/graphQLFetch';
import IssueDetail from './IssueDetail';
import store from '../../store';
import withToast from '../../components/withToast';
import PaginationLink from './PaginationLink';

class IssueList extends React.Component {
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

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    const query = `query issueList(
      $status: StatusType
      $effortMin: Int
      $effortMax: Int
      $hasSelection: Boolean!
      $selectedId: Int!
      $page: Int
    ) {
      issueList(
        status: $status
        effortMin: $effortMin
        effortMax: $effortMax
        page: $page
      ) {
        issues { 
          id title status owner
          created effort due
        }
        pages
      }
      issue(id: $selectedId) @include (if : $hasSelection) {
        id description title
      }
    }`;

    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor() {
    super();
    const initialData = store.initialData || { issueList: { issues: null, pages: null }, issue: {} };
    const {
      issueList: { issues, pages },
      issue: selectedIssue,
    } = initialData;

    delete store.initialData;
    this.state = { issues, selectedIssue, pages };
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

  loadData = async () => {
    const {
      location: { search },
      match,
      showError,
    } = this.props;
    const data = await IssueList.fetchData(match, search, showError);
    if (data) {
      this.setState({ issues: data.issueList.issues, selectedIssue: data.issue, pages: data.issueList.pages });
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
    const { showError } = this.props;
    const data = await graphQLFetch(query, { id: issues[index].id }, showError);
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

  restoreIssue = async (id) => {
    const query = `mutation issueRestore($id: Int!) {
      issueRestore(id: $id)
    }`;

    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { id }, showError);
    if (data) {
      showSuccess(`Issue ${id} restored successfully.`);
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
    const { showSuccess, showError } = this.props;
    const { id } = issues[index];
    const data = await graphQLFetch(query, { id }, showError);
    if (data && data.issueDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.issues];
        if (pathname === `/issues/${id}`) {
          history.push({ pathname: `/issues`, search });
        }
        newList.splice(index, 1);
        return { issues: newList };
      });
      const undoMessage = (
        <>
          {`Deleted issue ${id} successfully.`}
          <Button
            size="small"
            style={{ marginLeft: 20, color: 'black', fontWeight: 'bold', padding: 0 }}
            onClick={() => this.restoreIssue(id)}
          >
            Undo
          </Button>
        </>
      );
      showSuccess(undoMessage);
    } else {
      this.loadData();
    }
  };

  toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    const {
      location: { search },
    } = this.props;
    const { history } = this.props;
    history.push({ pathname: '/issues', search });
  };

  render() {
    const { issues } = this.state;
    if (issues === null) return null;
    const { selectedIssue, pages } = this.state;
    return (
      <>
        <IssueFilter urlBase="/issues" />
        <IssueTable
          issues={issues}
          closeIssue={this.closeIssue}
          deleteIssue={this.deleteIssue}
          style={{ marginTop: 20, marginBottom: 20 }}
        />
        <PaginationLink pages={pages} />
        <IssueDetail issue={selectedIssue} drawer toggleDrawer={this.toggleDrawer} />
      </>
    );
  }
}

const IssueListWithToast = withToast(IssueList);
IssueListWithToast.fetchData = IssueList.fetchData;

export default IssueListWithToast;
