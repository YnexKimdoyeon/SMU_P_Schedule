"use client"

import { useDraggable } from "@dnd-kit/core"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, MessageSquare, Paperclip, GripVertical } from "lucide-react"
import type { Task } from "@/lib/api"

interface TaskCardProps {
  task: Task
  onClick?: () => void
  isDragging?: boolean
}

const priorityColors = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-red-100 text-red-800",
}

const statusColors = {
  TODO: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  HOLD: "bg-yellow-100 text-yellow-800",
}

const priorityLabels = {
  LOW: "낮음",
  MEDIUM: "보통",
  HIGH: "높음",
}

const statusLabels = {
  TODO: "할 일",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
  HOLD: "보류",
}

// 성만 추출하는 함수
const getLastName = (member: { name: string }) => {
  return member.name.charAt(0) // 한국 이름의 첫 글자(성)
}

export function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isDraggingState,
  } = useDraggable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  if (isDragging) {
    return (
      <Card className="opacity-50 rotate-5 cursor-grabbing w-full max-w-[280px] min-h-[160px] overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 overflow-hidden">
              <h4 className="font-medium text-sm leading-tight line-clamp-2 break-all">{task.title}</h4>
            </div>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className={priorityColors[task.priority]}>
              {priorityLabels[task.priority]}
            </Badge>
            <Badge variant="outline" className={statusColors[task.status]}>
              {statusLabels[task.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 break-all overflow-hidden">
            {task.description}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 w-full max-w-[280px] min-h-[160px] overflow-hidden border-l-4 border-l-transparent hover:border-l-primary ${
        isDraggingState ? "opacity-50 rotate-1" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 overflow-hidden">
            <h4 className="font-medium text-sm leading-tight line-clamp-2 break-all">{task.title}</h4>
          </div>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded flex-shrink-0 transition-all duration-200 hover:scale-110"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge
            variant="outline"
            className={`${priorityColors[task.priority]} transition-all duration-200 hover:scale-105`}
          >
            {priorityLabels[task.priority]}
          </Badge>
          <Badge
            variant="outline"
            className={`${statusColors[task.status]} transition-all duration-200 hover:scale-105`}
          >
            {statusLabels[task.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 break-all overflow-hidden">{task.description}</p>

                  <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
              <div className="flex -space-x-1 flex-shrink-0">
                {task.assignees.slice(0, 3).map((assignee, index) => (
                  <Avatar key={index} className="h-5 w-5 border-2 border-background">
                    <AvatarFallback className="text-xs">{getLastName(assignee)}</AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees.length > 3 && (
                  <div className="h-5 w-5 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs">+{task.assignees.length - 3}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-0.5 text-muted-foreground flex-shrink-0">
              <Calendar className="h-3 w-3" />
              <span className="text-xs truncate max-w-[60px]">
                {new Date(task.dueDate).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
      </CardContent>
    </Card>
  )
}
