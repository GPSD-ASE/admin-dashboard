import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginForm } from './form';
import { useAuth } from '@/authContext/authContext';
import { useRouter } from 'next/router';

jest.mock('@/authContext/authContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('cookies-next', () => ({
  setCookie: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders the login form with username and password fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('submits the form and navigates to home on successful login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: { username: 'testuser', id: '123' }, token: 'token', message: 'Success' }),
      })
    ) as jest.Mock;

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('testuser'));
    expect(mockPush).toHaveBeenCalledWith('/home');
  });

  it('displays an error message on failed login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      })
    ) as jest.Mock;

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials'));
  });
});