/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TaskForm from "../src/components/tasks/task-form";
import { Task } from "../src/client";

const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  dueDate: new Date().toISOString(),
  status: "TODO",
};

describe("TaskForm", () => {
  it("renders the form with initial values", () => {
    render(<TaskForm initialTask={mockTask} onSubmit={() => {}} />);

    expect(screen.getByLabelText("📧 Task Title")).toHaveValue(mockTask.title);
    expect(screen.getByLabelText("📝 Description")).toHaveValue(
      mockTask.description
    );
  });

});