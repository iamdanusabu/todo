"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { TaskPool } from "@/components/task-pool"
import { CreateSprintModal } from "@/components/create-sprint-modal"
import KanbanBoard from "@/components/kanban-board"
import { NotesSection } from "@/components/notes-section"
import { Task, Sprint, Note, Column } from "@/types"

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

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed'>) => {
    const taskWithId: Task = { 
      ...newTask, 
      id: Date.now().toString(),
      completed: false
    }
    setTasks((prevTasks) => [...prevTasks, taskWithId])
  }

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleEditTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    )
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    setSelectedTasks((prevSelected) => prevSelected.filter((id) => id !== taskId))
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

  const handleUpdateSprint = (sprintId: string, newTasks: Task[]) => {
    setSprints((prevSprints) =>
      prevSprints.map((sprint) => {
        if (sprint.id === sprintId) {
          return {
            ...sprint,
            tasks: {
              ...sprint.tasks,
              Open: [...sprint.tasks.Open, ...newTasks],
            },
          };
        }
        return sprint;
      })
    );

    // Remove added tasks from the task pool
    setTasks((prevTasks) => 
      prevTasks.filter((task) => !newTasks.some(newTask => newTask.id === task.id))
    );

    // Clear selected tasks
    setSelectedTasks([]);
  };

  const handleDeleteSprint = (sprintId: string) => {
    setSprints((prevSprints) => prevSprints.filter((sprint) => sprint.id !== sprintId))
    // Move tasks back to the task pool
    const deletedSprint = sprints.find((sprint) => sprint.id === sprintId)
    if (deletedSprint) {
      const tasksToMove = Object.values(deletedSprint.tasks).flat()
      setTasks((prevTasks) => [...prevTasks, ...tasksToMove])
    }
  }

  const handleSendTaskToPool = (taskId: string) => {
    let taskToMove: Task | undefined;
    setSprints((prevSprints) =>
      prevSprints.map((sprint) => {
        const updatedSprint = { ...sprint };
        (Object.keys(sprint.tasks) as Column[]).forEach((column) => {
          const taskIndex = updatedSprint.tasks[column].findIndex((task) => task.id === taskId);
          if (taskIndex !== -1) {
            [taskToMove] = updatedSprint.tasks[column].splice(taskIndex, 1);
          }
        });
        return updatedSprint;
      })
    );

    if (taskToMove) {
      setTasks((prevTasks) => [...prevTasks, taskToMove!]);
    }
  }

  const handleDeleteTaskFromSprint = (taskId: string) => {
    setSprints((prevSprints) =>
      prevSprints.map((sprint) => ({
        ...sprint,
        tasks: Object.fromEntries(
          Object.entries(sprint.tasks).map(([column, tasks]) => [
            column,
            tasks.filter((task) => task.id !== taskId),
          ])
        ) as Record<Column, Task[]>,
      }))
    );
  }

  const handleAddNote = (newNote: Omit<Note, 'id' | 'createdAt'>) => {
    const noteWithId = {
      ...newNote,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setNotes((prevNotes) => [...prevNotes, noteWithId])
  }

  const handleEditNote = (id: string, updatedNote: Partial<Note>) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, ...updatedNote } : note))
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
                onUpdateSprint={handleUpdateSprint}
                existingSprints={sprints}
              />
            </div>
            <TaskPool
              tasks={tasks}
              selectedTasks={selectedTasks}
              onTaskSelect={handleTaskSelect}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
            <h2 className="text-2xl font-semibold text-gray-800 mt-8">Active Sprints</h2>
            {sprints.map((sprint) => (
              <KanbanBoard
                key={sprint.id}
                sprint={sprint}
                onUpdateSprint={(updatedSprint) => {
                  setSprints((prevSprints) =>
                    prevSprints.map((s) => (s.id === updatedSprint.id ? updatedSprint : s))
                  );
                }}
                onDeleteSprint={handleDeleteSprint}
                onSendTaskToPool={handleSendTaskToPool}
                onDeleteTask={handleDeleteTaskFromSprint}
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

