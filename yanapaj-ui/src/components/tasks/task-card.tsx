import { Card, CardTitle } from "@/components/ui/card";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash, Edit, CheckCircle2, Calendar } from "lucide-react";
import { Task } from "@/client";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  listView?: boolean;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  listView,
}: TaskCardProps) {
  const dueDate = parseISO(task.dueDate); // Convert string to Date
  const dueDateDistance = formatDistanceToNow(dueDate, { addSuffix: true });
  const formattedDueDate = format(dueDate, "MMM d, yyyy");

  const dueDateColor =
    dueDate < new Date()
      ? "bg-red-500"
      : dueDate < new Date(Date.now() + 24 * 60 * 60 * 1000)
        ? "bg-yellow-500"
        : "bg-green-500";

  const statusColorClass =
    task.status === "TODO"
      ? "bg-blue-100 text-blue-800"
      : task.status === "IN_PROGRESS"
        ? "bg-yellow-100 text-yellow-800"
        : task.status === "BLOCKED"
          ? "bg-red-100 text-red-800"
          : "bg-green-100 text-green-800";

  return (
    <Card className={listView ? "flex items-center p-4 mb-4" : "p-4 "}>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle2 className="mr-2 h-4 w-4 text-gray-500" />
            <CardTitle className="font-medium">{task.title}</CardTitle>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          {" "}
          {/* Align due date and buttons */}
          <div className="flex items-center text-gray-400">
            {" "}
            {/* Due date on the left */}
            <Calendar className="mr-1 h-4 w-4" />
            <span className="text-sm font-insideout">
              {formattedDueDate}
            </span>{" "}
            {/* Removed dueDateColor from here */}
          </div>
          <div className="flex items-center">
            <span
              className={`text-xs font-insideout-regular px-2 py-1 rounded-full ${dueDateColor}`}
            >
              {dueDateDistance}
            </span>
            {listView && (
              <span
                className={`ml-2 text-xs font-insideout px-2 py-1 rounded-full ${statusColorClass}`}
              >
                {task.status?.replace("_", " ")}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <Button variant="ghost" size="icon" onClick={() => onEdit(task)} aria-label="Edit Task">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(task)} aria-label="Delete Task">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
