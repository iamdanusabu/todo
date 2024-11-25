"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sprint, Task } from "@/types"

interface CreateSprintModalProps {
  selectedTasks: Task[]
  onCreateSprint: (sprint: Omit<Sprint, 'id' | 'status'>) => void
}

export function CreateSprintModal({ selectedTasks, onCreateSprint }: CreateSprintModalProps) {
  const [sprintName, setSprintName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isToday, setIsToday] = useState(false)

  const handleCreateSprint = () => {
    if (sprintName && (isToday || (startDate && endDate))) {
      const newSprint: Omit<Sprint, 'id' | 'status'> = {
        name: sprintName,
        startDate: isToday ? new Date().toISOString() : startDate,
        endDate: isToday ? new Date().toISOString() : endDate,
        tasks: {
          Open: selectedTasks,
          "In Progress": [],
          Done: []
        }
      }
      onCreateSprint(newSprint)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Start Sprint</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Sprint</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sprint-name" className="text-right">
              Sprint Name
            </Label>
            <Input
              id="sprint-name"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="today-sprint" className="text-right">
              Today Sprint
            </Label>
            <Input
              id="today-sprint"
              type="checkbox"
              checked={isToday}
              onChange={(e) => setIsToday(e.target.checked)}
              className="col-span-3"
            />
          </div>
          {!isToday && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-date" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-date" className="text-right">
                  End Date
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </>
          )}
        </div>
        <Button onClick={handleCreateSprint}>Create Sprint</Button>
      </DialogContent>
    </Dialog>
  )
}

