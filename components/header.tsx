"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Priority, Task } from "@/types"

interface HeaderProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void
}

export function Header({ onAddTask }: HeaderProps) {
  const [task, setTask] = useState("")
  const [priority, setPriority] = useState<Priority>("Medium")

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  const handleAddTask = () => {
    if (task.trim()) {
      onAddTask({
        description: task,
        priority,
        createdAt: new Date().toISOString(),
      })
      setTask("")
      setPriority("Medium")
    }
  }

  return (
    <header className="py-8 px-4 md:px-6">
      <h1 className="text-4xl font-semibold text-gray-800 mb-6">
        {getGreeting()}, User
      </h1>
      <div className="flex gap-4 max-w-2xl">
        <Input
          placeholder="Enter the task to be done"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-1"
        />
        <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Very High">Very High</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleAddTask}>Add</Button>
      </div>
    </header>
  )
}

