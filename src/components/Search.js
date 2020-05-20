import React from 'react';
import SelectAsync from 'react-select/async';
import { withRouter } from 'react-router-dom';

import grapQLFetch from '../graphQLFetch';
import withToast from './withToast';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ready: false };
  }

  componentDidMount() {
    this.setState({ ready: true }); // This one.
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
    if (this.state.ready) {
      return (
        <SelectAsync
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            menu: (provided) => ({ ...provided, zIndex: '9999 !important' }),
            container: (provided) => ({
              ...provided,
              width: '100%',
              minWidth: 250,
            }),
          }}
          placeholder="Search..."
          menuPortalTarget={document.querySelector('body')}
          instanceId="search-select"
          value=""
          loadOptions={this.loadOptions}
          filterOption={() => true}
          onChange={this.onChangeSelection}
          components={{ DropdownIndicator: null }}
        />
      );
    }
    return <div></div>;
  }
}

export default withRouter(withToast(Search));
