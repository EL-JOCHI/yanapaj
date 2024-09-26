import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Task } from "@/client";
import TaskCard from "./task-card";
import { format } from "date-fns";

const columnOrder = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"];

const columnHeaders: { [key: string]: { emoji: string; name: string } } = {
  TODO: { emoji: "📝", name: "To Do" },
  IN_PROGRESS: { emoji: "🚧", name: "In Progress" },
  BLOCKED: { emoji: "🛑", name: "Blocked" },
  DONE: { emoji: "✅", name: "Done" },
};

interface TaskGridViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onUpdateTask: (updatedTask: Task) => void;
}

export default function TaskGridView({
  tasks,
  onEdit,
  onDelete,
  onUpdateTask,
}: TaskGridViewProps) {
  const columns = columnOrder.reduce(
    (acc, columnId) => {
      acc[columnId] = tasks.filter((task) => task.status === columnId);
      return acc;
    },
    {} as { [key: string]: Task[] },
  );

  // Delayed Droppable Rendering (for React.StrictMode)

  const [droppableEnabled, setDroppableEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setDroppableEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setDroppableEnabled(false);
    };
  }, []);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const updatedTasks = [...columns[source.droppableId]];
      const [removed] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, removed);
    } else {
      // Moving to a different column
      const [removed] = columns[source.droppableId].splice(source.index, 1);

      // Update task status in the backend
      const updatedTask = {
        ...removed,
        status: destination.droppableId as Task["status"],
        dueDate: format(
          new Date(removed.dueDate),
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
        ),
      };
      onUpdateTask(updatedTask);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-4 gap-4 p-4">
        {columnOrder.map(
          (columnId) =>
            droppableEnabled && (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-indigo-100 dark:bg-indigo-950 rounded-md text-center p-2"
                  >
                    <div className="flex items-center justify-center dark:bg-gray-800 bg-indigo-500 rounded-md py-2 px-4 mb-2">
                      <span className="mr-2 text-2xl">
                        {columnHeaders[columnId].emoji}
                      </span>
                      <span className="text-lg font-semibold text-sky-50 dark:text-gray-200 font-insideout">
                        {columnHeaders[columnId].name}
                      </span>
                    </div>
                    {/* Task Cards */}
                    {columns[columnId].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id!}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                          >
                            <TaskCard
                              task={task}
                              onEdit={onEdit}
                              onDelete={onDelete}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ),
        )}
      </div>
    </DragDropContext>
  );
}
