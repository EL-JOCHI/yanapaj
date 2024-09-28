import { useCallback, useEffect, useState } from "react";
import TaskGridView from "./task-grid-view";
import TaskListView from "./task-list-view";
import { Task, TaskControllerService } from "@/client";
import { apiClient } from "@/api/api-client.ts";
import TaskToolbar from "@/components/tasks/task-toolbar.tsx";
import TaskModal from "@/components/tasks/task-modal.tsx";
import { toast } from "@/hooks/use-toast.ts";

export default function TaskView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await TaskControllerService.getTasks({
          client: apiClient,

        });
        const content = response.data?.content || [];
        setTasks(content);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks().catch((error) => {
      console.error("Error fetching tasks:", error);
    });
  }, []);

  // Update task status in the backend and then update the UI
  const handleTaskUpdate = useCallback(async (updatedTask: Task) => {
    try {
      const response = await TaskControllerService.updateTask({
        client: apiClient,
        body: updatedTask,
        path: { id: updatedTask.id! },
      });

      const updatedTaskFromBackend: Task = response.data as Task;

      // Update the tasks state with the updated task from the backend
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTaskFromBackend : task,
        ),
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      // Handle error, e.g., revert the drag and drop operation or display an error message
    }
  }, []);

  const handleTaskCreate = useCallback(async (newTask: Task) => {
    try {
      const response = await TaskControllerService.createTask({
        client: apiClient,
        body: newTask,
      });

      if (response.status === 201 && response.data) {
        const taskCreatedFromBackend: Task = response.data;

        // Update the tasks state with the updated task from the backend
        setTasks((prevTasks) => [taskCreatedFromBackend, ...prevTasks]);

        toast({
          title: "Task Added",
          description:
            "Task was added successfully!",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:
            "Failed to create task. Unexpected response from server.",
          variant: "default",
        });
      }
      setIsTaskFormOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }, []);

  // Placeholder handlers for onEdit and onDelete
  const handleEdit = (task: Task) => {
    console.log("Edit task:", task);
    // Implement your edit logic here
  };

  const handleDelete = (task: Task) => {
    console.log("Delete task:", task);
    // Implement your delete logic here
  };

  return (
    <div>
      <TaskToolbar
        viewMode={viewMode}
        onViewChange={setViewMode}
        onAddTask={() => setIsTaskFormOpen(true)}
      />
      {viewMode === "grid" ? (
        <TaskGridView
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdateTask={handleTaskUpdate}
        />
      ) : (
        <TaskListView
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <TaskModal // Pass the necessary props to TaskModal
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskCreate}
      />
    </div>
  );
}
