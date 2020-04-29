import React from 'react';
import './styles.css';

import { Link, NavLink, withRouter } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

import { green, red } from '@material-ui/core/colors';

const IssueRow = withRouter(({ issue, location: { search }, closeIssue, deleteIssue, index }) => {
  const { id, status, owner, effort, created, due, title } = issue;
  const selectLocation = { pathname: `/issues/${id}`, search };
  return (
    <tr>
      <td>{id}</td>
      <td>{status}</td>
      <td>{owner}</td>
      <td>{effort}</td>
      <td>{created.toDateString()}</td>
      <td>{due ? due.toDateString() : ' '}</td>
      <td>{title}</td>
      <td>
        <Link to={`/edit/${id}`}>Edit</Link>
        {' | '}
        <NavLink to={selectLocation}>Select</NavLink>
        {' | '}
        <Tooltip title="Close issue">
          <IconButton
            type="button"
            onClick={() => {
              closeIssue(index);
            }}
          >
            <CheckCircleIcon style={{ color: green[500] }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete issue">
          <IconButton
            type="button"
            onClick={() => {
              deleteIssue(index);
            }}
          >
            <DeleteIcon style={{ color: red[500] }} />
          </IconButton>
        </Tooltip>
      </td>
    </tr>
  );
});

const IssueTable = ({ issues, closeIssue, deleteIssue, style }) => {
  const issueRows = issues.map((issue, index) => (
    <IssueRow key={issue.id} issue={issue} closeIssue={closeIssue} deleteIssue={deleteIssue} index={index} />
  ));
  return (
    <table className="bordered-table" style={style}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Effort</th>
          <th>Created</th>
          <th>Due</th>
          <th>Title</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </table>
  );
};

export default IssueTable;
