"use client"

import { useState, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sprint, Task } from "@/types"

interface CreateSprintModalProps {
  selectedTasks: Task[]
  onCreateSprint: (sprint: Omit<Sprint, 'id' | 'status'>) => void
  onUpdateSprint: (sprintId: string, newTasks: Task[]) => void
  existingSprints: Sprint[]
}

export function CreateSprintModal({ selectedTasks, onCreateSprint, onUpdateSprint, existingSprints }: CreateSprintModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sprintName, setSprintName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedSprintId, setSelectedSprintId] = useState("new")

  useEffect(() => {
    if (!isOpen) {
      setSprintName("")
      setStartDate("")
      setEndDate("")
      setSelectedSprintId("new")
    }
  }, [isOpen])

  const handleCreateOrUpdateSprint = () => {
    if (selectedSprintId !== "new") {
      onUpdateSprint(selectedSprintId, selectedTasks)
    } else if (sprintName && startDate && endDate) {
      const newSprint: Omit<Sprint, 'id' | 'status'> = {
        name: sprintName,
        startDate,
        endDate,
        tasks: {
          Open: selectedTasks,
          "In Progress": [],
          Done: []
        }
      }
      onCreateSprint(newSprint)
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Start Sprint</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Sprint or Add to Existing</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sprint-select" className="text-right">
              Sprint
            </Label>
            <Select value={selectedSprintId} onValueChange={setSelectedSprintId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select sprint" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Create New Sprint</SelectItem>
                {existingSprints.map((sprint) => (
                  <SelectItem key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedSprintId === "new" && (
            <>
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
        <Button onClick={handleCreateOrUpdateSprint}>
          {selectedSprintId !== "new" ? "Add to Sprint" : "Create Sprint"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

