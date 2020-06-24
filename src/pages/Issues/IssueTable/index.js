import React from 'react';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import IssueRow from './IssueRow';

const StyledTableCell = withStyles(() => ({
  head: {
    fontWeight: 'bold',
  },
}))(TableCell);

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
