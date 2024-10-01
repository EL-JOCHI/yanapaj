import { useCallback, useContext, useEffect, useState } from "react";
import TaskGridView from "./task-grid-view";
import TaskListView from "./task-list-view";
import { Task, TaskControllerService } from "@/client";
import { apiClient } from "@/api/api-client.ts";
import TaskToolbar from "@/components/tasks/task-toolbar.tsx";
import TaskModal from "@/components/tasks/task-modal.tsx";
import { toast } from "@/hooks/use-toast.ts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { NotificationContext } from "@/context/notification-context.tsx";
import { differenceInDays, differenceInHours } from "date-fns";

export default function TaskView() {

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const { addNotification, isNotificationsEnabled } = useContext(NotificationContext);

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

  // Function to check for due tasks and send notifications
  const checkDueTasks = useCallback(() => {
    tasks.forEach((task) => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const daysUntilDue = differenceInDays(dueDate, new Date());
        const hoursUntilDue = differenceInHours(dueDate, new Date());

        if (isNotificationsEnabled) {
          if (daysUntilDue >= 1) {
            // Due in more than 24 hours (at least 1 day)
            addNotification(
              `🗓️ Task "${task.title}" is due in ${daysUntilDue} days!`,
              task.title,
            );
          } else if (hoursUntilDue <= 24 && hoursUntilDue >= 0) {
            // Due Soon Notification (within 24 hours)
            addNotification(
              `⏰ Task "${task.title}" is due in ${hoursUntilDue} hours!`,
              task.title,
            );
          } else if (hoursUntilDue < 0) {
            // Overdue Notification
            if (daysUntilDue <= -1) {
              // Overdue by at least one day
              const daysOverdue = Math.abs(daysUntilDue);
              addNotification(
                `⚠️ Task "${task.title}" is overdue by ${daysOverdue} days!`,
                task.title,
              );
            } else {
              // Overdue by less than a day (display in hours)
              const hoursOverdue = Math.abs(hoursUntilDue);
              addNotification(
                `⚠️ Task "${task.title}" is overdue by ${hoursOverdue} hours!`,
                task.title,
              );
            }
          }
        }
      }
    });
  }, [tasks, addNotification, isNotificationsEnabled]);

  // Set up interval to check for due tasks every hour
  useEffect(() => {
    const intervalId = setInterval(checkDueTasks, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [checkDueTasks]);


  // Update task status in the backend and then update the UI
  const handleTaskUpdate = useCallback(
    async (updatedTask: Task) => {
      try {
        const response = await TaskControllerService.updateTask({
          client: apiClient,
          body: updatedTask,
          path: { id: updatedTask.id! },
        });

        if (response.status === 200 && response.data) {
          const updatedTaskFromBackend: Task = response.data;

          // Update the tasks state with the updated task from the backend
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id ? updatedTaskFromBackend : task,
            ),
          );
          if (isNotificationsEnabled) {
            addNotification(
              "✅ Task was updated successfully!",
              updatedTask.title,
            );
          }
        } else {
          toast({
            title: "Error",
            description:
              "Failed to update task. Unexpected response from server.",
            variant: "destructive",
          });
        }
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error updating task status:", error);
        // Handle error, e.g., revert the drag and drop operation or display an error message
      }
    },
    [addNotification, isNotificationsEnabled],
  );

  const handleTaskCreate = useCallback(
    async (newTask: Task) => {
      try {
        const response = await TaskControllerService.createTask({
          client: apiClient,
          body: newTask,
        });

        if (response.status === 201 && response.data) {
          const taskCreatedFromBackend: Task = response.data;

          // Update the tasks state with the updated task from the backend
          setTasks((prevTasks) => [taskCreatedFromBackend, ...prevTasks]);
          if (isNotificationsEnabled) {
            addNotification("✅ Task was added successfully!", newTask.title);
          }
        } else {
          toast({
            title: "Error",
            description:
              "Failed to create task. Unexpected response from server.",
            variant: "destructive",
          });
        }
        setIsTaskFormOpen(false);
      } catch (error) {
        console.error("Error creating task:", error);
        toast({
          title: "Error",
          description:
            "Failed to create task. Unexpected response from server.",
          variant: "destructive",
        });
      }
    },
    [addNotification, isNotificationsEnabled],
  );

  const handleConfirmDelete = useCallback(async () => {
    try {
      if (taskToDelete) {
        const response = await TaskControllerService.deleteTask({
          client: apiClient,
          path: { id: taskToDelete.id! },
        });
        if (response.status === 204) {
          setTasks((prevTasks) =>
            prevTasks.filter((t) => t.id !== taskToDelete.id),
          );
          if (isNotificationsEnabled) {
          addNotification(
            "✅ Task was deleted successfully!",
            taskToDelete.title,
          );
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to delete task.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  }, [taskToDelete, addNotification, isNotificationsEnabled]);

  // Placeholder handlers for onEdit and onDelete
  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  // @ts-ignore
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
        isOpen={isTaskFormOpen || isEditModalOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setIsEditModalOpen(false);
        }}
        onSubmit={isTaskFormOpen ? handleTaskCreate : handleTaskUpdate}
        initialTask={taskToEdit}
      />

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the selected task? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
