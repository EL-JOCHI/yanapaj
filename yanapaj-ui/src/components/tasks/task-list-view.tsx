import { Task } from "@/client";
import TaskCard from "./task-card";

interface TaskListViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskListView({
  tasks,
  onEdit,
  onDelete,
}: TaskListViewProps) {
  //TODO: YAN-14: Implement the sorting and filtering logic here.
  // For now, we'll just display the tasks in the order they are received

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          listView={true}
        />
      ))}
    </div>
  );
}
