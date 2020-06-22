import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

export default function withToast(OriginalComponent) {
  return class ToastWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        toastVisible: false,
        toastMessage: '',
        toastType: 'success',
      };
    }

    showSuccess = (message) => {
      this.setState({ toastVisible: true, toastMessage: message, toastType: 'success' });
    };

    showError = (message) => {
      this.setState({ toastVisible: true, toastMessage: message, toastType: 'error' });
    };

    dismissToast = () => {
      this.setState({ toastVisible: false });
    };

    render() {
      const { toastType, toastVisible, toastMessage } = this.state;
      return (
        <>
          <OriginalComponent
            showError={this.showError}
            showSuccess={this.showSuccess}
            dismissToast={this.dismissToast}
            {...this.props}
          />
          <Snackbar
            open={toastVisible}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={3000}
            onClose={this.dismissToast}
          >
            <Alert variant="filled" severity={toastType}>
              {toastMessage}
            </Alert>
          </Snackbar>
        </>
      );
    }
  };
}
