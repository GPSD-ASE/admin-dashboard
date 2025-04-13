import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterPage from './page';
import { RegisterForm } from './form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));

jest.mock('./form', () => ({
  RegisterForm: jest.fn(() => <div>Mocked RegisterForm</div>),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('test_user_registration_success', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(<RegisterPage />);
    const registerButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);

    expect(toast.success).toHaveBeenCalledWith('Registration Successful');
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  test('test_navigation_to_login_page', () => {
    render(<RegisterPage />);
    const loginLink = screen.getByRole('link', { name: /sign in/i });
    fireEvent.click(loginLink);

    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('test_registration_form_display', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Create your Account')).toBeInTheDocument();
    expect(screen.getByText('Mocked RegisterForm')).toBeInTheDocument();
  });

  test('test_registration_missing_username', async () => {
    render(<RegisterPage />);
    const registerButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);

    expect(toast.success).toHaveBeenCalledWith('Registration Failed');
  });

  test('test_registration_invalid_email_format', async () => {
    render(<RegisterPage />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    const registerButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);

    expect(toast.success).toHaveBeenCalledWith('Registration Failed');
  });

  test('test_registration_server_error', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Server Error'))
    ) as jest.Mock;

    render(<RegisterPage />);
    const registerButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);

    expect(screen.getByText('Server Error')).toBeInTheDocument();
  });
});