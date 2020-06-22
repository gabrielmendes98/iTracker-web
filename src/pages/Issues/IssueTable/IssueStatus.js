import React, { Component } from 'react';

export default class StatusBullet extends Component {
  render() {
    const { status } = this.props;
    let color;

    switch (status) {
      case 'New':
        color = 'blue';
        break;
      case 'Assigned':
        color = 'orange';
        break;
      case 'Fixed':
        color = 'green';
        break;
      case 'Closed':
        color = 'red';
        break;
    }

    return <span style={{ color: 'white', backgroundColor: color, borderRadius: '5px', padding: 5 }}>{status}</span>;
  }
}
