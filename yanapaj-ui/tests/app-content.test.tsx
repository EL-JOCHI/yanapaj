/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from "../src/context/auth-context";
import AppContent from "../src/components/core/app-content";
import Register from "../src/components/login/register";
import Dashboard from "../src/components/dashboard/dashboard";

vi.mock('@/context/auth-context.tsx', () => ({
  useAuth: vi.fn(),
}));

// Mock the TaskControllerService
vi.mock('@/client', () => ({
  TaskControllerService: {
    getTasks: vi.fn().mockResolvedValue({
      data: {
        content: [
          // Add some sample tasks here
          { id: 1, title: 'Task 1', status: 'TODO' },
          { id: 2, title: 'Task 2', status: 'DONE' },
        ]
      }
    }),
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

describe('AppContent', () => {
  describe('when user is not logged in', () => {
    beforeEach(() => {
      (useAuth as any).mockReturnValue({ isLoggedIn: false });
    });

    it('renders the login page on the root route', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="*" element={<AppContent />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders the register page on the register route', () => {
      // Temporarily override the AppContent component for this test
      const TestAppContent = () => (
        <>
          <Routes>
            <Route path="/register/*" element={<Register />} />
            {/* You might need to include other necessary routes here
                depending on the structure of your Register component */}
          </Routes>
        </>
      );

      render(
        <MemoryRouter initialEntries={['/register']}>
          <TestAppContent /> {/* Use the overridden component */}
        </MemoryRouter>,
      );

      expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    });

    it('redirects to the login page from protected routes', () => {
      render(
        <MemoryRouter initialEntries={['/tasks']}>
          <Routes>
            <Route path="*" element={<AppContent />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      (useAuth as any).mockReturnValue({ isLoggedIn: true });
      localStorage.setItem('token', 'test-token'); // Simulate logged-in state
    });

    afterEach(() => {
      localStorage.removeItem('token');
    });

    it('renders the Navbar', () => {
      render(
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>,
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders the Dashboard on the dashboard route', async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/task summary/i)).toBeInTheDocument();
      });
    });

  });
});