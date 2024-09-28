import { Task } from "@/client";
import { useMediaQuery } from "@/hooks/user-media-query.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer.tsx";
import TaskForm from "@/components/tasks/task-form.tsx";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newTask: Task) => void;
  initialTask?: Task | null;
}

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
}: TaskFormProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialTask ? "Edit Task" : "Add Task"}</DialogTitle>
          <DialogDescription>
            {initialTask
              ? "Update task details"
              : "Add a new task to your list"}
          </DialogDescription>
        </DialogHeader>
        <TaskForm initialTask={initialTask} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{initialTask ? "Edit Task" : "Add Task"}</DrawerTitle>
          <DrawerDescription>
            {initialTask
              ? "Update task details"
              : "Add a new task to your list"}
          </DrawerDescription>
        </DrawerHeader>
        <TaskForm initialTask={initialTask} onSubmit={onSubmit} />
      </DrawerContent>
    </Drawer>
  );
};

export default TaskModal;
