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

    return <span style={{ color: color, fontSize: 20, height: '16px' }}>&#8226;</span>;
  }
}
