import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { fetchTransactions, fetchAddressSummary } from '../api/api';
import { QuickActions } from './QuickActions';
import starIcon from '../assets/favorite.svg';
import starIconFilled from '../assets/favorite-filled.svg';
import minusIcon from '../assets/remove.svg';
import ClipLoader from 'react-spinners/ClipLoader';
import '../styles/Dashboard.css';

export const Dashboard = ({ user, favorites, setFavorites }) => {
  const [address, setAddress] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('ALL');
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [hoveredTx, setHoveredTx] = useState(null);
  const transactionsPerPage = 25;

  useEffect(() => {
    if (address) {
      fetchTransactionData(address, page);
      fetchAddressBalance(address);
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

  const fetchAddressBalance = async (address) => {
    try {
      const balance = await fetchAddressSummary(address);
      setBalance(balance / 100000000); // Convert sats to BTC
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFavorite = async (txid) => {
    const userFavoritesRef = collection(
      db,
      'favorites',
      user.uid,
      'transactions'
    );
    if (favorites.includes(txid)) {
      await deleteDoc(doc(userFavoritesRef, txid));
      setFavorites(favorites.filter((fav) => fav !== txid));
    } else {
      await setDoc(doc(userFavoritesRef, txid), { txid });
      setFavorites([...favorites, txid]);
    }
  };

  const toggleAddressInput = () => {
    setShowAddressInput((prevShowAddressInput) => !prevShowAddressInput);
  };

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'ALL') return true;
    if (filter === 'FAVORITES') return favorites.includes(tx.txid);
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US');
  };

  return (
    <>
      <div className="input-container">
        {showAddressInput && (
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="<BTC ADDRESS HERE>"
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
                {balance !== null && <h3>Balance: {balance.toFixed(8)} BTC</h3>}
              </div>
              <div className="filter-buttons">
                <button onClick={() => handleFilterChange('ALL')}>ALL</button>
                <button onClick={() => handleFilterChange('Send')}>SENT</button>
                <button onClick={() => handleFilterChange('Receive')}>
                  RECEIVED
                </button>
                <button onClick={() => handleFilterChange('FAVORITES')}>
                  FAVORITES
                </button>
              </div>
              {loading && (
                <div className="loader-container">
                  <ClipLoader
                    data-testid="clip-loader"
                    color="#333"
                    loading={loading}
                    size={50}
                  />
                </div>
              )}
              {error && <p>{error}</p>}
              {currentTransactions.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>TYPE</th>
                      <th>DATE</th>
                      <th>TX ID</th>
                      <th>AMOUNT (BTC)</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTransactions.map((tx) => (
                      <tr key={tx.txid}>
                        <td>{tx.type}</td>
                        <td>{formatDate(tx.status.block_time)}</td>
                        <td>{tx.txid}</td>
                        <td>
                          {tx.vout.reduce((sum, vout) => sum + vout.value, 0) /
                            100000000}{' '}
                        </td>
                        <td>
                          {tx.status.confirmed ? 'Confirmed' : 'Unconfirmed'}
                        </td>
                        <td>
                          <button
                            className="favorite"
                            onClick={() => handleFavorite(tx.txid)}
                            onMouseEnter={() => setHoveredTx(tx.txid)}
                            onMouseLeave={() => setHoveredTx(null)}
                          >
                            <img
                              src={
                                favorites.includes(tx.txid)
                                  ? minusIcon
                                  : hoveredTx === tx.txid
                                  ? starIconFilled
                                  : starIcon
                              }
                              alt="Favorite icon"
                              className="icon"
                            />
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
