import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from './page';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  it('renders the GPSD logo and title', () => {
    render(<LoginPage />);
    expect(screen.getByAltText('gpsd')).toBeInTheDocument();
    expect(screen.getByText('GPSD')).toBeInTheDocument();
  });

  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByText('Sign in to your Account')).toBeInTheDocument();
  });

  it('renders the sign-up link', () => {
    render(<LoginPage />);
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });
});