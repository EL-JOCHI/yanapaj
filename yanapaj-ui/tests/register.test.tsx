/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import Register from '../src/components/login/register';
import { useAuth } from '../src/context/auth-context';
import { toast } from '../src/hooks/use-toast';
import { AuthenticationControllerService } from "../src/client";
import { useForm } from "react-hook-form";

vi.mock('@/context/auth-context.tsx', () => ({
  useAuth: vi.fn(),
}));

// Mock the AuthenticationControllerService
vi.mock('@/client', () => ({
  AuthenticationControllerService: {
    signup: vi.fn(),
    login: vi.fn(),
  },
  client: {
    getConfig: vi.fn(() => ({
      baseURL: 'http://example.com',
    })),
  },
  getConfig: vi.fn(),
}));

vi.mock('@/hooks/use-toast.ts', () => ({
  toast: vi.fn(),
}));

vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => {
    const errorsRef = { current: {} }; // Use a ref to store errors

    return {
      control: {
        register: vi.fn(),
      },
      handleSubmit: vi.fn((onSubmit) => (event) => {
        event.preventDefault();
        onSubmit({
          email: 'test@example.com',
          password: 'Test@1234',
          confirmPassword: 'Test@1234',
        });
      }),
      formState: {
        errors: errorsRef.current, // Access errors from the ref
      },
      setError: vi.fn((name, error) => {
        errorsRef.current = { ...errorsRef.current, [name]: error }; // Update errors in the ref
      }),
      getFieldState: vi.fn((name) => ({
        invalid: !!errorsRef.current[name], // Check if there's an error for the field
        error: errorsRef.current[name], // Return the error object if it exists
      })),
      trigger: vi.fn().mockResolvedValue(true),
    };
  }),
  FormProvider: ({ children }) => children,
  Controller: ({ render }) => render({ field: { value: '', onChange: vi.fn() } }),
  useFormContext: vi.fn(() => useForm())
}));

async function setUpRegistration() {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  const emailInput = screen.getByLabelText(/📧 Email/i);
  const passwordInput = screen.getByLabelText(/🔐 Password/i);
  const confirmPasswordInput = screen.getByLabelText(/🔐 Confirm Password/i);
  const submitButton = screen.getByRole('button', { name: /register/i });

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'Test@1234' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'Test@1234' } });

  await act(async () => {
    fireEvent.click(submitButton);
  });
}

describe('Register', () => {
  beforeEach(() => {
    (useAuth as any).mockReturnValue({ login: vi.fn() });
    (AuthenticationControllerService.signup as any).mockResolvedValue({
      status: 201,
      data: 'test-token',
    });
  });

  it('renders the registration form', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/📧 Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/🔐 Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/🔐 Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('calls the signup function on submit with valid credentials', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/📧 Email/i);
    const passwordInput = screen.getByLabelText(/🔐 Password/i);
    const confirmPasswordInput = screen.getByLabelText(/🔐 Confirm Password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test@1234' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Test@1234' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await vi.waitFor(() => {
      expect(AuthenticationControllerService.signup).toHaveBeenCalledWith({
        client: expect.anything(),
        body: {
          email: 'test@example.com',
          password: 'Test@1234',
        },
      });
    });
  });

  it('shows an error toast on network error during registration', async () => {
    (AuthenticationControllerService.signup as any).mockRejectedValue(new Error('Network error'));

    await setUpRegistration();

    await vi.waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Registration Failed 😥',
        description: 'An error occurred during registration. Please try again.',
      });
    });
  });
});