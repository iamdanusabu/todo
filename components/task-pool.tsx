"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Task } from "@/types"
import { formatDistanceToNow } from "date-fns"

interface TaskPoolProps {
  tasks: Task[]
  onTaskSelect: (taskId: string) => void
  selectedTasks: string[]
}

export function TaskPool({ tasks, onTaskSelect, selectedTasks }: TaskPoolProps) {
  const getPriorityColor = (priority: Task["priority"]) => {
    const colors = {
      Low: "bg-green-100 text-green-800",
      Medium: "bg-blue-100 text-blue-800",
      High: "bg-yellow-100 text-yellow-800",
      "Very High": "bg-orange-100 text-orange-800",
      Critical: "bg-red-100 text-red-800",
    }
    return colors[priority]
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Checkbox
                  checked={selectedTasks.includes(task.id)}
                  onCheckedChange={() => onTaskSelect(task.id)}
                />
              </TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </TableCell>
              <TableCell>{formatDistanceToNow(new Date(task.createdAt))} ago</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

