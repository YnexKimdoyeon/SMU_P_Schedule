"use client"

import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import { TaskCard } from "@/components/task-card"
import { CalendarView } from "@/components/calendar-view"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task, Project } from "@/lib/api"

interface TaskBoardProps {
  tasks: Task[]
  viewMode: "kanban" | "calendar"
  onTaskSelect: (task: Task) => void
  onAddTask: (task: Omit<Task, "id">) => void
  selectedProject: string
  projects: Project[]
}

const statusColumns = [
  { id: "TODO", title: "할 일", color: "bg-gray-100" },
  { id: "IN_PROGRESS", title: "진행 중", color: "bg-blue-100" },
  { id: "COMPLETED", title: "완료", color: "bg-green-100" },
  { id: "HOLD", title: "보류", color: "bg-yellow-100" },
] as const

function DroppableColumn({
  id,
  title,
  color,
  tasks,
  onTaskSelect,
  onAddTask,
  selectedProject,
}: {
  id: string
  title: string
  color: string
  tasks: Task[]
  onTaskSelect: (task: Task) => void
  onAddTask: (task: Omit<Task, "id">) => void
  selectedProject: string
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "column",
      status: id,
    },
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as Task["priority"],
    startDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
  })

  const handleAddTask = () => {
    if (!newTask.title.trim()) return

    onAddTask({
      ...newTask,
      status: id as Task["status"],
      projectId: selectedProject,
    })

    setNewTask({
      title: "",
      description: "",
      priority: "MEDIUM",
      startDate: new Date().toISOString().split("T")[0],
      dueDate: new Date().toISOString().split("T")[0],
    })
    setIsDialogOpen(false)
  }

  return (
    <div className="flex-1 min-w-[300px] max-w-[320px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold transition-colors duration-200 hover:text-primary">{title}</h3>
          <Badge variant="secondary" className="transition-all duration-200 hover:scale-110">
            {tasks.length}
          </Badge>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="transition-all duration-200 hover:scale-110 hover:bg-primary/10"
            >
              <Plus className="h-4 w-4 transition-transform duration-200 hover:rotate-90" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 업무 추가 - {title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title">제목</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="업무 제목을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="task-description">설명</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="업무 설명을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="task-priority">우선순위</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: Task["priority"]) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">낮음</SelectItem>
                    <SelectItem value="MEDIUM">보통</SelectItem>
                    <SelectItem value="HIGH">높음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">시작일</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="due-date">마감일</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddTask} className="flex-1">
                  추가
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  취소
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-[500px] rounded-lg p-3 transition-all duration-300 ${
          isOver ? "bg-muted ring-2 ring-primary ring-opacity-50 scale-[1.02] shadow-lg" : `${color} hover:shadow-md`
        }`}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskSelect(task)} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function TaskBoard({ tasks, viewMode, onTaskSelect, onAddTask, selectedProject, projects }: TaskBoardProps) {
  if (viewMode === "calendar") {
    return <CalendarView tasks={tasks} onTaskSelect={onTaskSelect} projects={projects} />
  }

  return (
    <div className="h-full p-6">
      <div className="flex gap-4 h-full overflow-x-auto">
        {statusColumns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id)

          return (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              tasks={columnTasks}
              onTaskSelect={onTaskSelect}
              onAddTask={onAddTask}
              selectedProject={selectedProject}
            />
          )
        })}
      </div>
    </div>
  )
}
