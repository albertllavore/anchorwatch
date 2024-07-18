import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../components/Login';

test('renders Login component', () => {
  render(<Login />);
  expect(screen.getByText(/LOG IN TO YOUR ACCOUNT/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
});

test('google login button is present', () => {
  render(<Login />);
  const button = screen.getByAltText('Google Sign-In');
  expect(button).toBeInTheDocument();
});
