import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../api/api';
import { QuickActions } from './QuickActions';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  const [address, setAddress] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('ALL');
  const [showAddressInput, setShowAddressInput] = useState(false);
  const transactionsPerPage = 25;

  useEffect(() => {
    if (address) {
      fetchTransactionData(address, page);
    }
  }, [address, page]);

  const fetchTransactionData = async (address, page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactions(address, page);
      setTransactions(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = (txid) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(txid)) {
        return prevFavorites.filter((id) => id !== txid);
      } else {
        return [...prevFavorites, txid];
      }
    });
  };

  const toggleAddressInput = () => {
    setShowAddressInput((prevShowAddressInput) => !prevShowAddressInput);
  };

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'ALL') return true;
    return tx.type === filter;
  });

  const currentTransactions = filteredTransactions.slice(
    (page - 1) * transactionsPerPage,
    page * transactionsPerPage
  );

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  return (
    <>
      <div className="input-container">
        {showAddressInput && (
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Bitcoin Address"
          />
        )}
      </div>
      <div className="dashboard">
        <QuickActions toggleAddressInput={toggleAddressInput} />
        <div className="content-section">
          <div className="content">
            <div className="transactions">
              <div className="transactions-header">
                <h2>TRANSACTIONS</h2>
              </div>
              <div className="filter-buttons">
                <button onClick={() => handleFilterChange('ALL')}>ALL</button>
                <button onClick={() => handleFilterChange('Send')}>SENT</button>
                <button onClick={() => handleFilterChange('Receive')}>
                  RECEIVED
                </button>
              </div>
              {loading && <p>Loading...</p>}
              {error && <p>{error}</p>}
              {currentTransactions.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>TYPE</th>
                      <th>DATE</th>
                      <th>TX ID</th>
                      <th>AMOUNT (BTC)</th>
                      <th>BALANCE (BTC)</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTransactions.map((tx) => (
                      <tr key={tx.txid}>
                        <td>{tx.type}</td>
                        <td>
                          {new Date(
                            tx.status.block_time * 1000
                          ).toLocaleString()}
                        </td>
                        <td>{tx.txid}</td>
                        <td>
                          {tx.vout.reduce((sum, vout) => sum + vout.value, 0) /
                            100000000}{' '}
                          BTC
                        </td>
                        <td>-</td>
                        <td>
                          {tx.status.confirmed ? 'Confirmed' : 'Unconfirmed'}
                        </td>
                        <td>
                          <button
                            className="favorite"
                            onClick={() => handleFavorite(tx.txid)}
                          >
                            {favorites.includes(tx.txid)
                              ? 'Unfavorite'
                              : 'Favorite'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No transactions to show</p>
              )}
              <div>
                <button
                  className="page-nav"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <button
                  className="page-nav"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
