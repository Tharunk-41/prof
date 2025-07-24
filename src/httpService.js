import axios from 'axios';

const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Fetch currencies from currencies.json
export const fetchCurrencies = async () => {
  try {
    const response = await apiClient.get('/currencies.json');
    return response.data.currencies;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw new Error('Failed to fetch currencies');
  }
};

// Fetch financial data (positions) for a given currency (simulated with query param)
export const fetchFinancialData = async (currency) => {
  try {
    const response = await apiClient.get(`/financialData.json?currency=${currency}`);
    return response.data.positions;
  } catch (error) {
    console.error('Error fetching financial data:', error);
    throw new Error('Failed to fetch financial data');
  }
};

// Fetch details for a given key
export const fetchDetails = async (key) => {
  try {
    const response = await apiClient.get('/details.json');
    return response.data[key] || [];
  } catch (error) {
    console.error('Error fetching details:', error);
    return [];
  }
};

// Post ajout correction
export const postAjoutCorrection = async (form) => {
  console.log('postAjoutCorrection', form);
  // const response = await apiClient.post('/api/ajout-correction', form);
  return { success: true };
};

export default apiClient;