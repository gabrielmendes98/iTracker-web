import React from 'react';
import graphQLFetch from '../graphQLFetch';

import { withStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';
import { Card, CardHeader, CardContent, Snackbar } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import Alert from '@material-ui/lab/Alert';

const useStyles = (theme) => ({
  drawerPaper: {
    width: '30%',
    minWidth: 500,
  },
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

class IssueDetail extends React.Component {
  constructor() {
    super();
    this.state = { issue: {}, drawer: true, toastVisible: false, toastMessage: '' };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: { id: prevId },
      },
    } = prevProps;
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if (prevId !== id) this.loadData();
  }

  loadData = async () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const query = `query issue($id: Int!) {
      issue(id: $id) {
        id description title
      }
    }`;
    const data = await graphQLFetch(query, { id }, this.showError);
    if (data) {
      this.setState({ issue: data.issue });
    } else {
      this.setState({ issue: {} });
    }
  };

  toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    const { history } = this.props;
    history.push('/issues');
    this.setState({ drawer: open });
  };

  showError = (message) => {
    this.setState({ toastVisible: true, toastMessage: message });
  };

  render() {
    const { classes } = this.props;
    const {
      issue: { description, title },
    } = this.state;
    const { drawer, toastVisible, toastMessage } = this.state;
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const displayDescription = description !== null ? description : 'This issue does not have a description =(';
    return (
      <Drawer classes={{ paper: classes.drawerPaper }} anchor={'left'} open={drawer} onClose={this.toggleDrawer(false)}>
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
        <Snackbar
          open={toastVisible}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          autoHideDuration={3000}
          onClose={() => {
            this.setState({ toastVisible: false });
          }}
        >
          <Alert variant="filled" severity="error">
            {toastMessage}
          </Alert>
        </Snackbar>
      </Drawer>
    );
  }
}

export default withStyles(useStyles)(IssueDetail);
