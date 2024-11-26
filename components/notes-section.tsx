"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MoreVertical } from 'lucide-react'
import { Note } from "@/types"
import { format } from "date-fns"

interface NotesSectionProps {
  notes: Note[]
  onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void
  onEditNote: (id: string, note: Partial<Note>) => void
  onDeleteNote: (id: string) => void
}

export function NotesSection({ notes, onAddNote, onEditNote, onDeleteNote }: NotesSectionProps) {
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNote, setNewNote] = useState({ 
    title: "", 
    description: "", 
    tags: "" 
  })
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const processTags = (tagsInput: string): string[] => {
    return tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '')
  }

  const handleAddNote = () => {
    if (newNote.title.trim() && newNote.description.trim()) {
      onAddNote({
        title: newNote.title,
        description: newNote.description,
        tags: processTags(newNote.tags)
      })
      setNewNote({ title: "", description: "", tags: "" })
      setIsAddingNote(false)
    }
  }

  const handleEditNote = () => {
    if (editingNote && editingNote.title.trim() && editingNote.description.trim()) {
      onEditNote(editingNote.id, {
        title: editingNote.title,
        description: editingNote.description,
        tags: processTags(editingNote.tags.join(','))
      })
      setEditingNote(null)
    }
  }

  return (
    <div className="w-full max-w-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Notes</h2>
        <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Input
                  placeholder="Title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Description"
                  value={newNote.description}
                  onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Tags (comma-separated)"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                />
              </div>
              <Button onClick={handleAddNote} className="w-full">
                Add Note
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm font-medium">{note.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setEditingNote(note)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onSelect={() => onDeleteNote(note.id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <time className="text-sm text-muted-foreground">
                  {format(new Date(note.createdAt), 'MMM d, yyyy')}
                </time>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{note.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Input
                  placeholder="Title"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Description"
                  value={editingNote.description}
                  onChange={(e) => setEditingNote({ ...editingNote, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Tags (comma-separated)"
                  value={editingNote.tags.join(', ')}
                  onChange={(e) => setEditingNote({ 
                    ...editingNote, 
                    tags: e.target.value
                      .split(',')
                      .map(tag => tag.trim())
                      .filter(tag => tag !== '')
                  })}
                />
              </div>
              <Button onClick={handleEditNote} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}