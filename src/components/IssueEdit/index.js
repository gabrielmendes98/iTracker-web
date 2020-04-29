import './styles.css';
import React from 'react';
import graphQLFetch from '../../graphQLFetch';
import { Link } from 'react-router-dom';
import NumInput from '../NumInput';
import DateInput from '../DateInput';
import TextInput from '../TextInput';

class IssueEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      issue: {},
      invalidFields: {},
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const prevId = prevProps.match.params.id;
    const { id } = this.props.match.params;
    if (id !== prevId) this.loadData();
  }

  loadData = async () => {
    const query = `query issue($id: Int!) {
      issue(id: $id) {
        id title status owner effort created due description
      }
    }`;

    const {
      match: {
        params: { id },
      },
    } = this.props;
    const data = await graphQLFetch(query, { id });
    const issue = data ? data.issue : {};
    this.setState({ issue, invalidFields: {} });
  };

  onChange = (e, naturalValue) => {
    const { name, value: textValue } = e.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState((prevState) => ({
      issue: { ...prevState.issue, [name]: value },
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { issue, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;
    const query = `mutation issueUpdate(
      $id: Int!
      $changes: IssueUpdateInputs!
    ) {
      issueUpdate(
        id: $id
        changes: $changes
      ) {
        id title status owner
        effort created due description
      }
    }`;

    const { id, created, ...changes } = issue;
    const data = await graphQLFetch(query, { id, changes });
    if (data) {
      this.setState({ issue: data.issueUpdate });
      alert('Updated issue successfully');
    }
  };

  onValidityChange = (event, valid) => {
    const { name } = event.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) {
        delete invalidFields[name];
      }
      return { invalidFields };
    });
  };

  render() {
    const { id, title, status, owner, effort, description, created, due } = this.state.issue;

    const propsId = this.props.match.params.id;
    if (id === undefined) {
      if (propsId !== null) {
        return <h3>{`Issue with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }

    const { invalidFields } = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0) {
      validationMessage = <div className="error">Please correct the invalid fields before submitting.</div>;
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <h3>{`Editing issue: ${id}`}</h3>
        <table>
          <tbody>
            <tr>
              <td>Created:</td>
              <td>{created.toDateString()}</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td>
                <select name="status" value={status} onChange={this.onChange}>
                  <option value="New">New</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Closed">Closed</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Owner:</td>
              <td>
                <TextInput name="owner" value={owner} onChange={this.onChange} key={id} />
              </td>
            </tr>
            <tr>
              <td>Effort:</td>
              <td>
                <NumInput name="effort" value={effort} onChange={this.onChange} key={id} />
              </td>
            </tr>
            <tr>
              <td>Due:</td>
              <td>
                <DateInput
                  name="due"
                  value={due}
                  onChange={this.onChange}
                  onValidityChange={this.onValidityChange}
                  key={id}
                />
              </td>
            </tr>
            <tr>
              <td>Title:</td>
              <td>
                <TextInput size={50} name="title" value={title} onChange={this.onChange} key={id} />
              </td>
            </tr>
            <tr>
              <td>Description:</td>
              <td>
                <TextInput
                  rows={8}
                  cols={50}
                  name="description"
                  value={description}
                  onChange={this.onChange}
                  key={id}
                />
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <button type="submit">Submit</button>
              </td>
            </tr>
          </tbody>
        </table>
        {validationMessage}
        <Link to={`/edit/${id - 1}`}>Prev</Link>
        {' | '}
        <Link to={`/edit/${id + 1}`}>Next</Link>
      </form>
    );
  }
}

export default IssueEdit;
