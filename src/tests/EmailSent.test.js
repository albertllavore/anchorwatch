import React from 'react';
import { render, screen } from '@testing-library/react';
import EmailSent from '../components/EmailSent';

test('renders EmailSent component', () => {
  render(<EmailSent resendEmail={() => {}} />);
  expect(screen.getByText(/LOG IN TO YOUR ACCOUNT/i)).toBeInTheDocument();
  expect(
    screen.getByText(/Check your inbox for a sign-in link/i)
  ).toBeInTheDocument();
});
