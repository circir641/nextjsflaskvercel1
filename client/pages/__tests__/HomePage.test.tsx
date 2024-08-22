import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HomePage from '../index'; // Adjust the import path based on your project structure
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

beforeEach(() => {
  mock.reset();
});

test('renders items list', async () => {
  mock.onGet('http://192.168.42.4:5000/api/items').reply(200, [
    { id: 1, name: 'Item 1', description: 'Description 1', price: 10 },
    { id: 2, name: 'Item 2', description: 'Description 2', price: 20 }
  ]);

  render(<HomePage />);

  expect(screen.getByText('Items List')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});

test('handles logout button click', () => {
  const localStorageMock = (function() {
    let store: { [key: string]: string } = {};
    return {
      getItem(key: string) {
        return store[key] || null;
      },
      setItem(key: string, value: string) {
        store[key] = value.toString();
      },
      removeItem(key: string) {
        delete store[key];
      }
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });

  render(<HomePage />);

  const logoutButton = screen.getByText('Logout');
  fireEvent.click(logoutButton);

  // Mocking window.location.pathname might not work directly, so you may need to adjust this based on your app logic
  expect(window.location.pathname).toBe('/login');
});
