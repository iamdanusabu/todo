export type Priority = 'Low' | 'Medium' | 'High' | 'Very High' | 'Critical'

export type Task = {
  id: string
  description: string
  priority: Priority
  createdAt: string
  completed: boolean
}

export type SprintStatus = 'Completed' | 'On Track' | 'Out of Track'

export type Column = 'Open' | 'In Progress' | 'Done'

export type Sprint = {
  id: string
  name: string
  startDate: string
  endDate: string
  tasks: {
    [key in Column]: Task[]
  }
  status: SprintStatus
}

export type Note = {
  id: string
  title: string
  description: string
  tags: string[]
  createdAt: string
}

