"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { TaskPool } from "@/components/task-pool"
import { CreateSprintModal } from "@/components/create-sprint-modal"
import { Task, Sprint } from "@/types"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [sprints, setSprints] = useState<Sprint[]>([])

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    const storedSprints = localStorage.getItem('sprints')
    if (storedTasks) setTasks(JSON.parse(storedTasks))
    if (storedSprints) setSprints(JSON.parse(storedSprints))
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('sprints', JSON.stringify(sprints))
  }, [sprints])

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const taskWithId = { ...newTask, id: Date.now().toString() }
    setTasks((prevTasks) => [...prevTasks, taskWithId])
  }

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleCreateSprint = (newSprint: Omit<Sprint, 'id' | 'status'>) => {
    const sprintWithId = {
      ...newSprint,
      id: Date.now().toString(),
      status: 'On Track' as const
    }
    setSprints((prevSprints) => [...prevSprints, sprintWithId])
    
    // Remove selected tasks from the task pool
    setTasks((prevTasks) => 
      prevTasks.filter((task) => !selectedTasks.includes(task.id))
    )
    setSelectedTasks([])
  }

  return (
    <main className="container mx-auto">
      <Header onAddTask={handleAddTask} />
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Task Pool</h2>
          <CreateSprintModal
            selectedTasks={tasks.filter((task) => selectedTasks.includes(task.id))}
            onCreateSprint={handleCreateSprint}
          />
        </div>
        <TaskPool
          tasks={tasks}
          selectedTasks={selectedTasks}
          onTaskSelect={handleTaskSelect}
        />
      </div>
    </main>
  )
}

