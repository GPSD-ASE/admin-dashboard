import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './header';
import { useAuth } from '@/authContext/authContext';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';

jest.mock('@/authContext/authContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('cookies-next', () => ({
  deleteCookie: jest.fn(),
}));


jest.mock('@/config', () => ({
  NavItems: jest.fn(() => [
    { name: 'Home', href: '/home', icon: <div>HomeIcon</div>, active: true },
    { name: 'Incidents', href: '/incidents', icon: <div>IncidentIcon</div>, active: false },
  ]),
}));

describe('Header Component', () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: 'TestUser',
      login: mockLogin,
      logout: mockLogout,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    jest.clearAllMocks();
  });

  test('test_user_login_display', async () => {
    render(<Header />);
    expect(screen.getByText('Hi! 👋 TestUser')).toBeInTheDocument();
  });

  test('test_navigation_menu_display', async () => {
    render(<Header />);
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Incidents')).toBeInTheDocument();
  });

  test('test_user_logout_redirect', async () => {
    render(<Header />);
    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
    expect(deleteCookie).toHaveBeenCalledWith('Token');
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  test('test_invalid_token_fetch_failure', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ id: 'wrongId' }),
      })
    ) as jest.Mock;

    render(<Header />);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  test('test_navigation_menu_responsiveness', async () => {
    render(<Header />);
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.queryByText('Home')).not.toBeVisible();
  });

  test('test_network_error_handling', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network Error'))) as jest.Mock;

    render(<Header />);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});