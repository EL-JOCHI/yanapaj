import { useEffect, useState } from "react";
import { Task, TaskControllerService } from "@/client";
import { apiClient } from "@/api/api-client.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { differenceInDays } from "date-fns";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, YAxis } from "recharts";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);

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

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "DONE")
    .length;
  const dueSoonTasks = tasks.filter((task) => {
    if (task.dueDate) {
      const daysUntilDue = differenceInDays(new Date(task.dueDate), new Date());
      return daysUntilDue >= 0 && daysUntilDue <= 1; // Due within 1 day
    }
    return false;
  }).length;

  const chartData = [
    { name: "Tasks", totalTasks: totalTasks,  completedTasks: completedTasks, dueSoonTasks: dueSoonTasks}
  ];

  const chartConfig = {
    totalTasks: {
      label: "📝 Tasks",
      color: "#F45B69",
    },
    completedTasks: {
      label: "✅ Completed Tasks",
      color: "#89BD9E",
    },
    dueSoonTasks: {
      label: "⏳ Due Soon",
      color: "#FFBE0B",
    }
  } satisfies ChartConfig;

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Tasks Card */}
        <Card>
          <CardHeader className="font-insideout">
            <CardTitle>📝 Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalTasks}</p>
          </CardContent>
        </Card>

        {/* Completed Tasks Card */}
        <Card>
          <CardHeader className="font-insideout">
            <CardTitle>✅ Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completedTasks}</p>
          </CardContent>
        </Card>

        {/* Due Soon Tasks Card */}
        <Card>
          <CardHeader className="font-insideout">
            <CardTitle>⏳ Due Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{dueSoonTasks}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="font-insideout">Task Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="totalTasks" fill="var(--color-totalTasks)" radius={4} />
              <Bar dataKey="completedTasks" fill="var(--color-completedTasks)" radius={4} />
              <Bar dataKey="dueSoonTasks" fill="var(--color-dueSoonTasks)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}