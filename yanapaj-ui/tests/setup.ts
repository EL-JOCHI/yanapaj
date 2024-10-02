// tests/setup.ts
import { afterEach, beforeEach, vi } from 'vitest'; // Import beforeEach and vi
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import 'resize-observer-polyfill/dist/ResizeObserver.global';

// Mock Notification API before each test
beforeEach(() => {
  // Other setup...

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false, // Set the default match value as needed
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock Notification API 
  global.Notification = {
    permission: 'granted', // Set default permission
    requestPermission: vi.fn(() => Promise.resolve('granted')),
  } as any;
});

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});