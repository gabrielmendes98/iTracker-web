import React from 'react';

class IssueAdd extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    if (issue.owner === '' || issue.title === '') return;

    const { props } = this;
    props.createIssue(issue);
    form.owner.value = '';
    form.title.value = '';
  };

  render() {
    return (
      <form name="issueAdd" onSubmit={this.handleSubmit}>
        <input type="text" name="owner" placeholder="Owner" />
        <input type="text" name="title" placeholder="Title" />
        <button type="submit">Add</button>
      </form>
    );
  }
}

export default IssueAdd;
