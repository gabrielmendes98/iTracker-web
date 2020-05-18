import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import UserContext from '../UserContext';
import StatusBullet from './StatusBullet';

import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import { green, red } from '@material-ui/core/colors';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';

import { withStyles } from '@material-ui/core/styles';

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

class IssueRowPlain extends React.Component {
  render() {
    const {
      issue,
      location: { search },
      closeIssue,
      deleteIssue,
      index,
      history,
    } = this.props;
    const { id, status, owner, effort, created, due, title } = issue;
    const selectLocation = { pathname: `/issues/${id}`, search };
    const user = this.context;
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
          <StatusBullet status={status} /> {status}
        </TableCell>
        <TableCell>{owner}</TableCell>
        <TableCell>{effort}</TableCell>
        <TableCell>{created.toDateString()}</TableCell>
        <TableCell>{due ? due.toDateString() : ' '}</TableCell>
        <TableCell>{title}</TableCell>
        <TableCell align="right" onClick={handlePropagation}>
          <Tooltip title="Edit issue">
            <IconButton to={`/edit/${id}`} component={Link}>
              <EditIcon style={{ color: '#000' }} />
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
                <CheckCircleIcon />
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
                <DeleteIcon />
              </StyledIconButtonDelete>
            </span>
          </Tooltip>
        </TableCell>
      </StyledTableRow>
    );
  }
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
            <StyledTableCell align="right"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>{issueRows}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default IssueTable;
