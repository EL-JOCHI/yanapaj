import { useCallback, useEffect, useState } from "react";
import TaskGridView from "./task-grid-view";
import TaskListView from "./task-list-view";
import { Task, TaskControllerService } from "@/client";
import { apiClient } from "@/api/api-client.ts"; // We'll create this component next
import { Grid2x2, List } from "lucide-react";

export default function TaskView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [tasks, setTasks] = useState<Task[]>([]); // State for tasks

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

  // Placeholder handlers for onEdit and onDelete
  const handleEdit = (task: Task) => {
    console.log("Edit task:", task);
    // Implement your edit logic here
  };

  const handleDelete = (task: Task) => {
    console.log("Delete task:", task);
    // Implement your delete logic here
  };

  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  return (
    <div>
      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={() => handleViewChange("grid")}
          className={`px-2 py-2 rounded-md font-medium transition-colors duration-200 
                     ${
                       viewMode === "grid"
                         ? "bg-indigo-500 text-sky-50 dark:bg-indigo-950"
                         : "bg-gray-200 hover:bg-indigo-300 text-gray-700 dark:text-gray-900"
                     }`}
        >
          <Grid2x2 />
        </button>
        <button
          onClick={() => handleViewChange("list")}
          className={`px-2 py-2 rounded-md font-medium transition-colors duration-200 
                     ${
                       viewMode === "list"
                         ? "bg-indigo-500 text-sky-50 dark:bg-indigo-950"
                         : "bg-gray-200 hover:bg-indigo-300 text-gray-700 dark:text-gray-900"
                     }`}
        >
          <List />
        </button>
      </div>
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
    </div>
  );
}
