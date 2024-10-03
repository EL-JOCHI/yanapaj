import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { PageTask, Task, TaskControllerService } from "../src/client";
import Dashboard from "../src/components/dashboard/dashboard";
import { AxiosResponse } from "axios";

// Mock the API client and TaskControllerService
vi.mock("@/api/api-client.ts", () => ({
  apiClient: {
    get: vi.fn(),
    // ... other methods if needed
  },
}));

vi.mock("../src/client", () => ({
  TaskControllerService: {
    getTasks: vi.fn(),
  },
}));

describe("Dashboard Component", () => {
  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Task 1",
      description: "Description 1",
      status: "DONE",
      dueDate: "2024-03-10T10:00:00.000Z",
    },
    {
      id: "2",
      title: "Task 2",
      description: "Description 2",
      status: "IN_PROGRESS",
      dueDate: "2024-03-15T10:00:00.000Z",
    },
    {
      id: "3",
      title: "Task 3",
      description: "Description 3",
      status: "TODO",
      dueDate: "2024-03-11T10:00:00.000Z",
    },
  ];

  beforeEach(() => {
    // Reset mock implementation before each test
    vi.mocked(TaskControllerService.getTasks).mockClear();
  });

  it("renders dashboard with task data", async () => {
    // Mock the API response
    (TaskControllerService.getTasks as Mock).mockResolvedValue({
      data: {
        content: mockTasks,
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    } as AxiosResponse<PageTask>);

    // Wrap the rendering and state updates in act
    await act(async () => {
      render(<Dashboard />, {
        // Provide a container with dimensions for the chart
        container: document.body.appendChild(document.createElement('div')),
      });
    });

    // Assertions
    screen.getByText("📝 Total Tasks");
    screen.getByText("✅ Completed Tasks");
    screen.getByText("⏳ Due Soon");

    screen.getByText("3"); // Total tasks
    screen.getByText("1"); // Completed tasks
    screen.getByText("1"); // Due soon tasks
  });

  it("handles API errors gracefully", async () => {
    const errorMessage = "API request failed";
    // Mock the API response to throw an error
    (TaskControllerService.getTasks as Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    // Spy on console.error
    const consoleErrorSpy = vi.spyOn(console, "error");

    // Wrap the rendering in act
    await act(async () => {
      render(<Dashboard />, {
        // Provide a container with dimensions for the chart
        container: document.body.appendChild(document.createElement('div')),
      });
    });

    // You might need to wait for the error state to be reflected in the UI
    // For example, you might check for an error message being displayed

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching tasks:",
      new Error(errorMessage)
    );
  });

  // Add more tests to cover other scenarios:
  // - Empty task list
  // - Different task statuses
  // - Interaction with chart components
});