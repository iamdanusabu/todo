"use client"

import React, { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreVertical, X, ArrowLeft, Trash, Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sprint, Task, Column, SprintStatus, Priority } from "@/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface KanbanBoardProps {
  sprint: Sprint
  onUpdateSprint: (updatedSprint: Sprint) => void
  onDeleteSprint: (sprintId: string) => void
  onSendTaskToPool: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export default function KanbanBoard({ sprint, onUpdateSprint, onDeleteSprint, onSendTaskToPool, onDeleteTask }: KanbanBoardProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) {
      return
    }

    const sourceColumn = source.droppableId as Column
    const destColumn = destination.droppableId as Column

    const newSprint = { ...sprint }
    const sourceTasks = Array.from(newSprint.tasks[sourceColumn])
    const [movedTask] = sourceTasks.splice(source.index, 1)

    if (sourceColumn === destColumn) {
      // Reordering within the same column
      sourceTasks.splice(destination.index, 0, movedTask)
      newSprint.tasks[sourceColumn] = sourceTasks
    } else {
      // Moving from one column to another
      const destTasks = Array.from(newSprint.tasks[destColumn])
      destTasks.splice(destination.index, 0, movedTask)
      newSprint.tasks[sourceColumn] = sourceTasks
      newSprint.tasks[destColumn] = destTasks
    }

    const updatedSprint = {
      ...newSprint,
      status: calculateSprintStatus(newSprint)
    };
    onUpdateSprint(updatedSprint)
  }

  const calculateSprintStatus = (sprint: Sprint): SprintStatus => {
    const allTasks = Object.values(sprint.tasks).flat();
    const totalTasks = allTasks.length;
    const completedTasks = sprint.tasks.Done.length;
    const currentDate = new Date();
    const endDate = new Date(sprint.endDate);

    if (totalTasks === 0) {
      return 'On Track';
    }

    if (completedTasks === totalTasks) {
      return 'Completed';
    }

    if (currentDate > endDate) {
      return 'On Track';
    }

    const completionRate = completedTasks / totalTasks;
    const timeElapsed = (currentDate.getTime() - new Date(sprint.startDate).getTime()) / (endDate.getTime() - new Date(sprint.startDate).getTime());

    if (completionRate >= timeElapsed) {
      return 'On Track';
    } else {
      return 'On Track';
    }
  };

  const getColumnColor = (column: Column) => {
    switch (column) {
      case "Open":
        return "bg-blue-100"
      case "In Progress":
        return "bg-yellow-100"
      case "Done":
        return "bg-green-100"
      default:
        return "bg-gray-100"
    }
  }

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

  const getStatusColor = (status: SprintStatus) => {
    switch (status) {
      case 'Completed':
        return 'border-green-500 text-green-600'
      case 'On Track':
        return 'border-red-500 text-red-600'
      case 'On Track':
        return 'border-yellow-500 text-yellow-600'
      default:
        return 'border-gray-500 text-gray-600'
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
  }

  const handleUpdateTask = () => {
    if (editingTask) {
      const updatedSprint = {
        ...sprint,
        tasks: {
          ...sprint.tasks,
          [editingTask.completed ? 'Done' : 'Open']: sprint.tasks[editingTask.completed ? 'Done' : 'Open'].map(
            (task) => (task.id === editingTask.id ? editingTask : task)
          ),
        },
      }
      onUpdateSprint(updatedSprint)
      setEditingTask(null)
    }
  }

  useEffect(() => {
    const updatedStatus = calculateSprintStatus(sprint);
    if (updatedStatus !== sprint.status) {
      onUpdateSprint({ ...sprint, status: updatedStatus });
    }
  }, [sprint, onUpdateSprint]);

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Sprint: {sprint.name} ({new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()})
        </CardTitle>
        <div className="flex items-center space-x-2">
          <p className={`text-sm px-2 py-1 rounded-full border ${getStatusColor(sprint.status)}`}>
            {sprint.status}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="w-9 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <X className="h-4 w-4" /> : <MoreVertical className="h-4 w-4" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDeleteSprint(sprint.id)}>Delete Sprint</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.keys(sprint.tasks) as Column[]).map((columnId) => (
                <div key={columnId} className={`p-4 rounded-lg ${getColumnColor(columnId)}`}>
                  <h3 className="font-semibold mb-2">{columnId}</h3>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`space-y-2 min-h-[100px] ${snapshot.isDraggingOver ? 'bg-gray-200' : ''}`}
                      >
                        {sprint.tasks[columnId].map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white p-2 rounded shadow-sm ${snapshot.isDragging ? 'opacity-50' : ''}`}
                              >
                                <div className="flex justify-between items-start">
                                  <p className="text-sm">{task.description}</p>
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
                                      <DropdownMenuItem onClick={() => onSendTaskToPool(task.id)}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        <span>Send to Task Pool</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => onDeleteTask(task.id)}>
                                        <Trash className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </CardContent>
      )}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="task-description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="task-description"
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="task-priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select
                  value={editingTask.priority}
                  onValueChange={(value: Priority) =>
                    setEditingTask({ ...editingTask, priority: value })
                  }
                >
                  <SelectTrigger>
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
    </Card>
  )
}

