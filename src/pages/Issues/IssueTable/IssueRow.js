import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import { Tooltip, IconButton, TableRow, TableCell } from '@material-ui/core';
import { CheckCircle, Delete, Edit } from '@material-ui/icons';
import { green, red } from '@material-ui/core/colors';

import UserContext from '../../../UserContext';
import IssueStatus from './IssueStatus';

const StyledTableRow = withStyles(() => ({
  root: {
    cursor: 'pointer',
  },
}))(TableRow);

const StyledIconButtonClose = withStyles(() => ({
  root: {
    color: green[500],
  },
}))(IconButton);

const StyledIconButtonDelete = withStyles(() => ({
  root: {
    color: red[500],
  },
}))(IconButton);

const IssueRowPlain = ({ issue, location: { search }, closeIssue, deleteIssue, index, history }) => {
  const { id, status, owner, effort, created, due, title } = issue;
  const selectLocation = { pathname: `/issues/${id}`, search };
  const user = useContext(UserContext);
  const disabled = !user.signedIn;

  const handlePropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <StyledTableRow
      onClick={() => {
        history.push(selectLocation);
      }}
    >
      <TableCell>{id}</TableCell>
      <TableCell>
        <IssueStatus status={status} />
      </TableCell>
      <TableCell>{owner}</TableCell>
      <TableCell>{effort}</TableCell>
      <TableCell>{created.toDateString()}</TableCell>
      <TableCell>{due ? due.toDateString() : ' '}</TableCell>
      <TableCell>{title}</TableCell>
      <TableCell align="right" onClick={handlePropagation}>
        <Tooltip title="Edit issue">
          <IconButton to={`/edit/${id}`} component={Link}>
            <Edit style={{ color: '#000' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Close issue">
          <span>
            <StyledIconButtonClose
              disabled={disabled}
              type="button"
              onClick={() => {
                closeIssue(index);
              }}
            >
              <CheckCircle />
            </StyledIconButtonClose>
          </span>
        </Tooltip>
        <Tooltip title="Delete issue">
          <span>
            <StyledIconButtonDelete
              disabled={disabled}
              type="button"
              onClick={() => {
                deleteIssue(index);
              }}
            >
              <Delete />
            </StyledIconButtonDelete>
          </span>
        </Tooltip>
      </TableCell>
    </StyledTableRow>
  );
};

IssueRowPlain.contextType = UserContext;
const IssueRow = withRouter(IssueRowPlain);
delete IssueRow.contextType;

export default IssueRow;
