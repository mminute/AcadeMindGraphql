import React from 'react';
import './BookingsViewControl.css';

function ViewButton({ active, children, onClick }) {
  return <button className={active ? 'active' : ''} onClick={onClick}>{children}</button>;
}

export default function BookingsViewControl({ clickHandler, currentView }) {
  return (
    <div className="bookings-view-control">
      <ViewButton active={currentView === 'list'} onClick={() => clickHandler('list')}>List</ViewButton>
      <ViewButton active={currentView === 'chart'} onClick={() => clickHandler('chart')}>Chart</ViewButton>
    </div>
  );
}
