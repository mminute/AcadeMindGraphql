import React from 'react';
import './Backdrop.css';

export default function Backdrop(props) {
  return (
    <div className="backdrop">
      {props.children}
    </div>
  );
}