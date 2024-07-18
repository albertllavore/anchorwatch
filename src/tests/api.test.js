import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchTransactions, fetchAddressSummary } from '../api/api';

const mock = new MockAdapter(axios);
const API_BASE_URL = 'https://mempool.space/api';

describe('API functions', () => {
  afterEach(() => {
    mock.reset();
  });

  test('fetchTransactions fetches and processes transaction data correctly', async () => {
    const address = 'some-bitcoin-address';
    const mockData = [
      {
        txid: 'tx1',
        vin: [{ prevout: { scriptpubkey_address: 'some-bitcoin-address' } }],
        vout: [{ value: 1000 }],
        status: { confirmed: true, block_time: 1234567890 },
      },
      {
        txid: 'tx2',
        vin: [{ prevout: { scriptpubkey_address: 'another-address' } }],
        vout: [{ value: 2000 }],
        status: { confirmed: false, block_time: 1234567891 },
      },
    ];

    mock.onGet(`${API_BASE_URL}/address/${address}/txs`).reply(200, mockData);

    const transactions = await fetchTransactions(address);

    expect(transactions).toEqual([
      { ...mockData[0], type: 'Send' },
      { ...mockData[1], type: 'Receive' },
    ]);
  });

  test('fetchTransactions throws an error when the request fails', async () => {
    const address = 'some-bitcoin-address';

    mock.onGet(`${API_BASE_URL}/address/${address}/txs`).reply(500);

    await expect(fetchTransactions(address)).rejects.toThrow(
      'Failed to fetch transaction data.'
    );
  });

  test('fetchAddressSummary fetches and processes address summary correctly', async () => {
    const address = 'some-bitcoin-address';
    const mockData = {
      chain_stats: {
        funded_txo_sum: 3000,
        spent_txo_sum: 1000,
      },
    };

    mock.onGet(`${API_BASE_URL}/address/${address}`).reply(200, mockData);

    const summary = await fetchAddressSummary(address);

    expect(summary).toEqual(2000);
  });

  test('fetchAddressSummary throws an error when the request fails', async () => {
    const address = 'some-bitcoin-address';

    mock.onGet(`${API_BASE_URL}/address/${address}`).reply(500);

    await expect(fetchAddressSummary(address)).rejects.toThrow(
      'Failed to fetch address summary.'
    );
  });
});
