"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Calendar, User, MessageSquare, Paperclip, Send, Edit, Save, Plus, Clock, AlertTriangle } from "lucide-react"
import type { Task, Comment } from "@/app/page"

interface TaskDetailPanelProps {
  task: Task
  onClose: () => void
  onUpdate: (task: Task) => void
}

// 마감일까지 남은 일수 계산
const getDaysUntilDue = (dueDate: string) => {
  const today = new Date()
  const due = new Date(dueDate)
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  const diffTime = due.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function TaskDetailPanel({ task, onClose, onUpdate }: TaskDetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)
  const [newComment, setNewComment] = useState("")
  const [commentSent, setCommentSent] = useState(false)

  const daysLeft = getDaysUntilDue(task.dueDate)
  const isUrgent = daysLeft <= 3 && task.priority === "high"
  const isOverdue = daysLeft < 0

  const handleSave = () => {
    onUpdate(editedTask)
    setIsEditing(false)
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: "Current User",
      content: newComment,
      timestamp: new Date().toISOString(),
    }

    const updatedTask = {
      ...task,
      comments: [...task.comments, comment],
    }

    onUpdate(updatedTask)
    setNewComment("")
    setCommentSent(true)
    setTimeout(() => setCommentSent(false), 1000)
  }

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  const statusColors = {
    todo: "bg-gray-100 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    hold: "bg-yellow-100 text-yellow-800",
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className={`p-4 border-b transition-all duration-300 ${
          isUrgent
            ? "bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-l-red-300"
            : isOverdue
              ? "bg-gradient-to-r from-red-100 to-red-50 border-l-4 border-l-red-400"
              : "bg-gradient-to-r from-primary/5 to-secondary/5"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">업무 상세</h3>
            {isUrgent && (
              <Badge variant="destructive" className="bg-orange-100 text-orange-800 border-orange-300">
                <AlertTriangle className="h-3 w-3 mr-1" />
                긴급
              </Badge>
            )}
            {isOverdue && (
              <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
                <Clock className="h-3 w-3 mr-1" />
                지연됨
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} className="transition-all duration-200 hover:scale-110">
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="transition-all duration-200 hover:scale-110"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="transition-all duration-200 hover:scale-110 hover:bg-primary/10"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="transition-all duration-200 hover:scale-110 hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 마감일 카운트다운 */}
        <div className="mt-2 flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span
            className={`font-medium ${
              isOverdue
                ? "text-red-600"
                : daysLeft <= 1
                  ? "text-orange-600"
                  : daysLeft <= 3
                    ? "text-yellow-600"
                    : "text-muted-foreground"
            }`}
          >
            {isOverdue ? `${Math.abs(daysLeft)}일 지연` : daysLeft === 0 ? "오늘 마감" : `${daysLeft}일 남음`}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-2 block">제목</label>
            {isEditing ? (
              <Input
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="transition-all duration-200 focus:scale-[1.02]"
              />
            ) : (
              <h2 className="text-lg font-semibold">{task.title}</h2>
            )}
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">상태</label>
              {isEditing ? (
                <Select
                  value={editedTask.status}
                  onValueChange={(value: Task["status"]) => setEditedTask({ ...editedTask, status: value })}
                >
                  <SelectTrigger className="transition-all duration-200 hover:scale-[1.02]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">할 일</SelectItem>
                    <SelectItem value="in-progress">진행 중</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                    <SelectItem value="hold">보류</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={`${statusColors[task.status]} transition-all duration-200 hover:scale-110`}>
                  {task.status.replace("-", " ")}
                </Badge>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">우선순위</label>
              {isEditing ? (
                <Select
                  value={editedTask.priority}
                  onValueChange={(value: Task["priority"]) => setEditedTask({ ...editedTask, priority: value })}
                >
                  <SelectTrigger className="transition-all duration-200 hover:scale-[1.02]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">낮음</SelectItem>
                    <SelectItem value="medium">보통</SelectItem>
                    <SelectItem value="high">높음</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  className={`${priorityColors[task.priority]} transition-all duration-200 hover:scale-110 ${
                    task.priority === "high" && daysLeft <= 3 ? "ring-2 ring-red-300" : ""
                  }`}
                >
                  {task.priority}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block">설명</label>
            {isEditing ? (
              <Textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                rows={4}
                className="transition-all duration-200 focus:scale-[1.02]"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{task.description}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              마감일
            </label>
            {isEditing ? (
              <Input
                type="date"
                value={editedTask.dueDate}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                className="transition-all duration-200 focus:scale-[1.02]"
              />
            ) : (
              <p
                className={`text-sm ${
                  isOverdue ? "text-red-600 font-bold" : daysLeft <= 1 ? "text-orange-600 font-semibold" : ""
                }`}
              >
                {new Date(task.dueDate).toLocaleDateString("ko-KR")}
              </p>
            )}
          </div>

          {/* Assignees */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <User className="h-4 w-4" />
              담당자
            </label>
            <div className="flex flex-wrap gap-2">
              {task.assignees.map((assignee, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-muted rounded-full px-3 py-1 transition-all duration-200 hover:scale-105 hover:bg-primary/10"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {assignee
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{assignee}</span>
                </div>
              ))}
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all duration-200 hover:scale-110 bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Attachments */}
          {task.attachments.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                첨부파일
              </label>
              <div className="space-y-2">
                {task.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-muted rounded transition-all duration-200 hover:scale-[1.02] hover:bg-primary/10"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm">{attachment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Comments */}
          <div>
            <label className="text-sm font-medium mb-4 block flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              댓글 ({task.comments.length})
            </label>

            <div className="space-y-4">
              {task.comments.map((comment, index) => (
                <div
                  key={comment.id}
                  className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {comment.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2 transition-all duration-200 hover:bg-muted/80">
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="댓글을 입력하세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                className="transition-all duration-200 focus:scale-[1.02]"
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                className={`transition-all duration-300 hover:scale-110 ${
                  commentSent ? "bg-green-500 hover:bg-green-600" : ""
                }`}
              >
                <Send
                  className={`h-4 w-4 transition-transform duration-200 ${
                    commentSent ? "scale-125" : "hover:translate-x-1"
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
