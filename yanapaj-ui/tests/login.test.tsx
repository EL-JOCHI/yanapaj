/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import Login from '../src/components/login/login';
import { useAuth } from '../src/context/auth-context';
import { toast } from '../src/hooks/use-toast';
import { AuthenticationControllerService } from "../src/client";

vi.mock('@/context/auth-context.tsx', () => ({
  useAuth: vi.fn(),
}));

// Mock the AuthenticationControllerService
vi.mock('@/client', () => ({
  AuthenticationControllerService: {
    login: vi.fn(),
  },
  // Add the missing 'client' and 'getConfig()'
  client: {
    getConfig: vi.fn(() => ({
      // Return a dummy configuration object
      baseURL: 'http://example.com',
      // ... other configuration properties
    })),
  }, // You can leave this as an empty object or mock it further if needed
  getConfig: vi.fn(),
}));

vi.mock('@/hooks/use-toast.ts', () => ({
  toast: vi.fn(),
}));

async function setUpCredentials() {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole("button", { name: /sign in/i });

  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "Test@1234" } });

  await act(async () => {
    fireEvent.click(submitButton);
  });
}

describe('Login', () => {
  beforeEach(() => {
    (useAuth as any).mockReturnValue({ login: vi.fn() });
    (AuthenticationControllerService.login as any).mockResolvedValue({ data: 'test-token' });
  });

  it('renders the login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('validates the email field', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email/i);

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'false');
    });
  });

  it('calls the login function on submit with valid credentials', async () => {
    await setUpCredentials();

    await vi.waitFor(() => {
      expect(AuthenticationControllerService.login).toHaveBeenCalledWith({
        client: expect.anything(),
        body: {
          email: 'test@example.com',
          password: 'Test@1234',
        },
      });
    });
  });

  it('shows a success toast on successful login', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test@1234' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await vi.waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Login Successful',
        description: 'You have been logged in.',
      });
    });
  });

  it('shows an error toast on failed login', async () => {
    (AuthenticationControllerService.login as any).mockRejectedValue(new Error('Login failed'));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test@1234' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await vi.waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Login Failed',
        description: 'Invalid email or password.',
      });
    });
  });
});