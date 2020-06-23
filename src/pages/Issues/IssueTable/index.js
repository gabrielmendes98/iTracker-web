import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';

import {
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';

import { green, red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';

import { CheckCircle, Delete, Edit } from '@material-ui/icons';

import UserContext from '../../../UserContext';
import IssueStatus from './IssueStatus';

const StyledTableCell = withStyles(() => ({
  head: {
    fontWeight: 'bold',
  },
}))(TableCell);

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

function IssueRowPlain({ issue, location: { search }, closeIssue, deleteIssue, index, history }) {
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
}

IssueRowPlain.contextType = UserContext;
const IssueRow = withRouter(IssueRowPlain);
delete IssueRow.contextType;

const IssueTable = ({ issues, closeIssue, deleteIssue, style }) => {
  const issueRows = issues.map((issue, index) => (
    <IssueRow key={issue.id} issue={issue} closeIssue={closeIssue} deleteIssue={deleteIssue} index={index} />
  ));
  return (
    <TableContainer component={Paper} style={style}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell>Owner</StyledTableCell>
            <StyledTableCell>Effort</StyledTableCell>
            <StyledTableCell>Created</StyledTableCell>
            <StyledTableCell>Due</StyledTableCell>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>{issueRows}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default IssueTable;
