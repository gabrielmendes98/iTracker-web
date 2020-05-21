import React from 'react';
import './styles.css';

import { withStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';
import { Card, CardHeader, CardContent, Button } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

const useStyles = (theme) => ({
  cardRoot: {
    width: '90%',
    margin: '20px auto',
  },
  cardHeader: {
    backgroundColor: red[500],
    color: '#fff',
  },
  cardSubheader: {
    color: '#fff',
  },
});

const IssueDetail = ({ issue, drawer, toggleDrawer, classes }) => {
  if (issue) {
    const { description, title, id } = issue;
    const displayDescription = description !== null ? description : 'This issue does not have a description =(';
    return (
      <Drawer classes={{ paper: 'drawer-paper' }} anchor={'left'} open={drawer} onClose={toggleDrawer(false)}>
        <Card classes={{ root: classes.cardRoot }}>
          <CardHeader
            classes={{ root: classes.cardHeader, subheader: classes.cardSubheader }}
            title={title}
            subheader={`ID: ${id}`}
          />
          <CardContent>
            <pre
              style={{
                fontFamily: 'Arial',
                fontSize: '1em',
                whiteSpace: 'pre-wrap',
              }}
            >
              {displayDescription}
            </pre>
          </CardContent>
        </Card>
        <Button
          style={{ color: 'white', backgroundColor: '#f44336', width: '90%', margin: '20px auto' }}
          variant="contained"
          onClick={toggleDrawer(false)}
        >
          Close
        </Button>
      </Drawer>
    );
  }
  return null;
};

export default withStyles(useStyles)(IssueDetail);
