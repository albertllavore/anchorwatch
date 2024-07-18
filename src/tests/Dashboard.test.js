import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Dashboard } from '../components/Dashboard';
import { fetchTransactions, fetchAddressSummary } from '../api/api';

jest.mock('../api/api');
jest.mock('../components/QuickActions', () => ({
  QuickActions: ({ toggleAddressInput }) => (
    <button onClick={toggleAddressInput}>ADD BTC ADDRESS</button>
  ),
}));

const mockUser = { uid: 'user1' };
const mockFavorites = [];

describe('Dashboard Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Dashboard component', () => {
    render(
      <Dashboard
        user={mockUser}
        favorites={mockFavorites}
        setFavorites={jest.fn()}
      />
    );
    expect(screen.getByText(/ADD BTC ADDRESS/i)).toBeInTheDocument();
  });

  test('fetches and displays transactions', async () => {
    const mockTransactions = [
      {
        txid: 'tx1',
        vin: [{ prevout: { scriptpubkey_address: 'some-bitcoin-address' } }],
        vout: [{ value: 1000 }],
        status: { confirmed: true, block_time: 1234567890 },
        type: 'Send',
      },
      {
        txid: 'tx2',
        vin: [{ prevout: { scriptpubkey_address: 'another-address' } }],
        vout: [{ value: 2000 }],
        status: { confirmed: false, block_time: 1234567891 },
        type: 'Receive',
      },
    ];

    fetchTransactions.mockResolvedValue(mockTransactions);
    fetchAddressSummary.mockResolvedValue(200000000);

    render(
      <Dashboard
        user={mockUser}
        favorites={mockFavorites}
        setFavorites={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText(/ADD BTC ADDRESS/i));
    fireEvent.change(screen.getByPlaceholderText(/<BTC ADDRESS HERE>/i), {
      target: { value: 'some-bitcoin-address' },
    });

    await screen.findByText(/tx1/i);
    expect(screen.getByText(/tx2/i)).toBeInTheDocument();
  });

  test('displays loading spinner during data fetch', async () => {
    fetchTransactions.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    ); // Simulate delay
    fetchAddressSummary.mockResolvedValue(0);

    render(
      <Dashboard
        user={mockUser}
        favorites={mockFavorites}
        setFavorites={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText(/ADD BTC ADDRESS/i));
    fireEvent.change(screen.getByPlaceholderText(/<BTC ADDRESS HERE>/i), {
      target: { value: 'some-bitcoin-address' },
    });

    // Ensure loading spinner appears
    expect(screen.getByTestId('clip-loader')).toBeInTheDocument();

    // Wait for the loading to disappear
    await waitFor(() =>
      expect(screen.queryByTestId('clip-loader')).not.toBeInTheDocument()
    );
  });

  test('displays error message when data fetch fails', async () => {
    fetchTransactions.mockRejectedValue(
      new Error('Failed to fetch transaction data.')
    );
    fetchAddressSummary.mockRejectedValue(
      new Error('Failed to fetch transaction data.')
    );

    render(
      <Dashboard
        user={mockUser}
        favorites={mockFavorites}
        setFavorites={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText(/ADD BTC ADDRESS/i));
    fireEvent.change(screen.getByPlaceholderText(/<BTC ADDRESS HERE>/i), {
      target: { value: 'some-bitcoin-address' },
    });

    await screen.findByText(/Failed to fetch transaction data./i);
    expect(
      screen.getByText(/Failed to fetch transaction data./i)
    ).toBeInTheDocument();
  });
});
