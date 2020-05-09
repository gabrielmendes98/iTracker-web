import React from 'react';
import SelectAsync from 'react-select/async';
import { withRouter } from 'react-router-dom';

import grapQLFetch from '../graphQLFetch';
import withToast from './withToast';

class Search extends React.Component {
  constructor(props) {
    super(props);
  }

  onChangeSelection = ({ value }) => {
    const { history } = this.props;
    history.push(`/edit/${value}`);
  };

  loadOptions = async (term) => {
    if (term.length < 3) return [];
    const query = `query issueList($search: String) {
      issueList(search: $search) {
        issues {id title}
      }
    }`;

    const { showError } = this.props;
    const data = await grapQLFetch(query, { search: term }, showError);
    return data.issueList.issues.map((issue) => ({
      label: `#${issue.id}: ${issue.title}`,
      value: issue.id,
    }));
  };

  render() {
    return (
      <SelectAsync
        instanceId="search-select"
        value=""
        loadOptions={this.loadOptions}
        filterOption={() => true}
        onChange={this.onChangeSelection}
        components={{ DropdownIndicator: null }}
      />
    );
  }
}

export default withRouter(withToast(Search));
