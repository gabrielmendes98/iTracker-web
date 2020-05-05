import React from 'react';
import store from '../store';

export default function About() {
  return (
    <div>
      <h3>Issue Tracker version 0.9</h3>
      <h4>{store.initialData ? store.initialData.about : 'unknown'}</h4>
    </div>
  );
}
