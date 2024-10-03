/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import TaskCard from "../src/components/tasks/task-card";
import { Task } from "../src/client";

const mockTask: Task = {
  id: "",
  title: "Test Task",
  description: "This is a test task",
  dueDate: "2024-03-10T12:00:00.000Z",
  status: "TODO",
};

describe("TaskCard", () => {
  it("renders task information correctly", () => {
    render(
      <TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Mar 10, 2024")).toBeInTheDocument();
  });

  it("applies correct status color in list view", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={() => {}}
        onDelete={() => {}}
        listView
      />
    );

    const statusSpan = screen.getByText("TODO");
    expect(statusSpan).toHaveClass("bg-blue-100", "text-blue-800");
  });

  it("calls onEdit when edit button is clicked", () => {
    const onEditMock = vi.fn();
    render(
      <TaskCard task={mockTask} onEdit={onEditMock} onDelete={() => {}} />
    );

    const editButton = screen.getByRole("button", { name: /Edit Task/i });
    editButton.click();
    expect(onEditMock).toHaveBeenCalledWith(mockTask);
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDeleteMock = vi.fn();
    render(
      <TaskCard task={mockTask} onEdit={() => {}} onDelete={onDeleteMock} />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    deleteButton.click();
    expect(onDeleteMock).toHaveBeenCalledWith(mockTask);
  });
});