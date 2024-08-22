
import AxiosMockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// Create a new instance of the mock adapter
const mock = new AxiosMockAdapter(axios);

// Set up global mocks if needed
mock.onGet('/api/items').reply(200, { items: [] });
