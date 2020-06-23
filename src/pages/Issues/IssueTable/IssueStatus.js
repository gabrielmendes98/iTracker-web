import React from 'react';

export default function StatusBullet({ status }) {
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
    default:
      color = 'gray';
      break;
  }

  return <span style={{ color: 'white', backgroundColor: color, borderRadius: '5px', padding: 5 }}>{status}</span>;
}
