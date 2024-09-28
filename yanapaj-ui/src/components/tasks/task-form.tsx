import { cn } from "@/lib/utils.ts";
import { format } from "date-fns";
import { Task } from "@/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const TaskSchema = z
  .object({
    title: z.string().min(4, { message: "The Task title should be at least 4 characters."})
      .max(50, { message: "The Task title should not be longer than 50 characters."}),
    description: z
      .string(),
    dueDate: z.date({
      required_error: "Due date is required",
    }),
    status: z.enum(["TODO", "IN_PROGRESS", "BLOCKED", "DONE"]),
  });

interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (task: Task) => void;
}

const TaskForm = ({ initialTask, onSubmit }: TaskFormProps) => {
  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: initialTask?.title ?? "",
      description: initialTask?.description ?? "",
      dueDate: initialTask?.dueDate
        ? new Date(initialTask.dueDate)
        : new Date(),
      status: initialTask?.status ?? "TODO",
    },
  });

  const handleSubmit = (data: z.infer<typeof TaskSchema>) => {
    onSubmit({
      id: initialTask?.id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate.toISOString(),
      status: data.status,
    });
  };

  return (
    <Form {...form} >
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-sky-50">📧 Task Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter task title"
                  {...field}
                  className="w-full dark:bg-white dark:text-gray-900"
                />
              </FormControl>
              <FormMessage className="dark:text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-sky-50">
                📝 Description
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter task description"
                  {...field}
                  className="w-full dark:bg-white dark:text-gray-900"
                />
              </FormControl>
              <FormMessage className="dark:text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-sky-50">📅 Due Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage className="dark:text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-sky-50">🚥 Status</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}
                        value={field.value} >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="dark:text-red-400" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full dark:bg-indigo-500 dark:text-white"
        >
          ➡️ Save
        </Button>
      </form>
    </Form>
  );
};

export default TaskForm;
