"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { TaskPool } from "@/components/task-pool"
import { CreateSprintModal } from "@/components/create-sprint-modal"
import { KanbanBoard } from "@/components/kanban-board"
import { NotesSection } from "@/components/notes-section"
import { Task, Sprint, Note } from "@/types"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    const storedSprints = localStorage.getItem('sprints')
    const storedNotes = localStorage.getItem('notes')
    if (storedTasks) setTasks(JSON.parse(storedTasks))
    if (storedSprints) setSprints(JSON.parse(storedSprints))
    if (storedNotes) setNotes(JSON.parse(storedNotes))
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('sprints', JSON.stringify(sprints))
  }, [sprints])

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

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

  const handleUpdateSprint = (updatedSprint: Sprint) => {
    setSprints((prevSprints) =>
      prevSprints.map((sprint) =>
        sprint.id === updatedSprint.id ? updatedSprint : sprint
      )
    )
  }

  const handleDeleteSprint = (sprintId: string) => {
    setSprints((prevSprints) => prevSprints.filter((sprint) => sprint.id !== sprintId))
    // Move tasks back to the task pool
    const deletedSprint = sprints.find((sprint) => sprint.id === sprintId)
    if (deletedSprint) {
      const tasksToMove = Object.values(deletedSprint.tasks).flat()
      setTasks((prevTasks) => [...prevTasks, ...tasksToMove])
    }
  }

  const handleAddNote = (newNote: Omit<Note, 'id' | 'createdAt'>) => {
    const noteWithId = {
      ...newNote,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setNotes((prevNotes) => [...prevNotes, noteWithId])
  }

  const handleEditNote = (id: string, updatedNote: Partial<Note>) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, ...updatedNote } : note
      )
    )
  }

  const handleDeleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header onAddTask={handleAddTask} />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
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
            <h2 className="text-2xl font-semibold text-gray-800 mt-8">Active Sprints</h2>
            {sprints.map((sprint) => (
              <KanbanBoard
                key={sprint.id}
                sprint={sprint}
                onUpdateSprint={handleUpdateSprint}
                onDeleteSprint={handleDeleteSprint}
              />
            ))}
          </div>
        </main>
        <aside className="w-80 flex-shrink-0 overflow-y-auto border-l border-gray-200">
          <NotesSection
            notes={notes}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
          />
        </aside>
      </div>
    </div>
  )
}

