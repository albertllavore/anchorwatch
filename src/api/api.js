import axios from 'axios';

const API_BASE_URL = 'https://mempool.space/api134';

export const fetchTransactions = async (address, page = 1) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/address/${address}/txs`);
    console.log(response);
    return response.data.map((tx) => {
      const isSend = tx.vin.some(
        (vin) => vin.prevout.scriptpubkey_address === address
      );
      return { ...tx, type: isSend ? 'Send' : 'Receive' };
    });
  } catch (error) {
    throw new Error('Failed to fetch transaction data.');
  }
};

export const fetchAddressSummary = async (address) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/address/${address}`);
    return (
      response.data.chain_stats.funded_txo_sum -
      response.data.chain_stats.spent_txo_sum
    );
  } catch (error) {
    throw new Error('Failed to fetch address summary.');
  }
};
