import { Grid2x2, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

interface TaskToolbarProps {
  viewMode: "grid" | "list";
  onViewChange: (mode: "grid" | "list") => void;
  onAddTask: () => void;
}

const TaskToolbar = ({
  viewMode,
  onViewChange,
  onAddTask,
}: TaskToolbarProps) => {
  return (
    <div className="flex justify-between items-center mb-4 pl-4 pr-4">
      <div className="flex space-x-2">
        <button
          onClick={() => onViewChange("grid")}
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
          onClick={() => onViewChange("list")}
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
      <Button
        className="px-2 py-2 rounded-md font-medium transition-colors duration-200 bg-indigo-500 text-sky-50 dark:bg-indigo-950 hover:bg-indigo-300"
        onClick={onAddTask}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default TaskToolbar;
