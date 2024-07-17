import React from 'react';
import '../styles/QuickActions.css';
import btcIcon from '../assets/bitcoin.png'; // Ensure this path is correct or replace with an appropriate icon

export const QuickActions = ({ toggleAddressInput }) => {
  return (
    <div className="quick-actions">
      <button onClick={toggleAddressInput}>
        <img src={btcIcon} alt="BTC Icon" width="20" /> ADD BTC ADDRESS
      </button>
    </div>
  );
};
