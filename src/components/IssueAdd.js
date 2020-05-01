import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

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
      <FormGroup row>
        <form name="issueAdd" onSubmit={this.handleSubmit}>
          <Input style={{ marginRight: 20 }} type="text" name="owner" placeholder="Owner" />
          <Input style={{ marginRight: 20 }} type="text" name="title" placeholder="Title" />
          <Button type="submit" style={{ backgroundColor: '#3f51b5', color: '#fff' }}>
            Add
          </Button>
        </form>
      </FormGroup>
    );
  }
}

export default IssueAdd;
