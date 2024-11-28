"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Pencil, Trash } from 'lucide-react'
import { Task, Priority } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskPoolProps {
  tasks: Task[]
  onTaskSelect: (taskId: string) => void
  selectedTasks: string[]
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskPool({ tasks, onTaskSelect, selectedTasks, onEditTask, onDeleteTask }: TaskPoolProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const getPriorityColor = (priority: Priority) => {
    const colors = {
      Low: "bg-green-100 text-green-800",
      Medium: "bg-blue-100 text-blue-800",
      High: "bg-yellow-100 text-yellow-800",
      "Very High": "bg-orange-100 text-orange-800",
      Critical: "bg-red-100 text-red-800",
    }
    return colors[priority]
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
  }

  const handleUpdateTask = () => {
    if (editingTask) {
      onEditTask(editingTask.id, {
        description: editingTask.description,
        priority: editingTask.priority
      })
      setEditingTask(null)
    }
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
            <TableHead className="w-12"></TableHead>
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
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditTask(task)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteTask(task.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Input
                  id="task-description"
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={editingTask.priority}
                  onValueChange={(value: Priority) =>
                    setEditingTask({ ...editingTask, priority: value })
                  }
                >
                  <SelectTrigger id="task-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Very High">Very High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateTask}>Update Task</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

