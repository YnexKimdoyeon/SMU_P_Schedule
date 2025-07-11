"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Clock, AlertTriangle } from "lucide-react"
import type { Task, Project } from "@/app/page"
import { cn } from "@/lib/utils"

const TASK_COLOR_PALETTE = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
]

interface CalendarViewProps {
  tasks: Task[]
  projects: Project[]
  onTaskSelect: (task: Task) => void
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

// 우선순위에 따른 애니메이션 클래스
const getPriorityAnimation = (priority: Task["priority"], daysLeft: number) => {
  if (priority === "high" && daysLeft <= 1) {
    return "bg-red-500 text-white border-2 border-red-300"
  }
  if (priority === "high" && daysLeft <= 3) {
    return "bg-orange-500 text-white border-2 border-orange-300"
  }
  if (priority === "medium" && daysLeft <= 1) {
    return "bg-yellow-500 text-black border-2 border-yellow-300"
  }
  return ""
}

// A utility to get the number of days in a month
const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

// A utility to get the first day of the month
const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

export function CalendarView({ tasks, projects, onTaskSelect }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [hoveredTask, setHoveredTask] = useState<string | null>(null)

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(1) // Avoid issues with different month lengths
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthYear = currentDate.toLocaleDateString("ko-KR", {
    month: "long",
    year: "numeric",
  })

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)

  const calendarDays = Array.from({ length: firstDayOfMonth + daysInMonth }, (_, i) => {
    if (i < firstDayOfMonth) return null
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), i - firstDayOfMonth + 1)
  })

  const weeks: (Date | null)[][] = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  const getTaskLayoutForWeek = (week: (Date | null)[]) => {
    const weekTasks: { task: Task; startCol: number; span: number; slot: number; color: string; daysLeft: number }[] =
      []
    const weekStart = week[0] || week.find((d) => d)
    const weekEnd = week[6] || [...week].reverse().find((d) => d)

    if (!weekStart || !weekEnd) return []

    const tasksInWeek = tasks
      .filter((task) => {
        const taskStart = new Date(task.startDate)
        const taskEnd = new Date(task.dueDate)
        taskStart.setHours(0, 0, 0, 0)
        taskEnd.setHours(0, 0, 0, 0)
        return taskStart <= weekEnd && taskEnd >= weekStart
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

    const slots: (Task | null)[][] = Array.from({ length: 7 }, () => [])
    tasksInWeek.forEach((task) => {
      const taskStart = new Date(task.startDate)
      const taskEnd = new Date(task.dueDate)

      const startCol = taskStart < weekStart ? 0 : taskStart.getDay()
      const endCol = taskEnd > weekEnd ? 6 : taskEnd.getDay()
      const span = endCol - startCol + 1

      let assignedSlot = -1
      for (let i = 0; ; i++) {
        let isFree = true
        for (let j = startCol; j < startCol + span; j++) {
          if (slots[j] && slots[j][i]) {
            isFree = false
            break
          }
        }
        if (isFree) {
          assignedSlot = i
          break
        }
      }

      for (let i = startCol; i < startCol + span; i++) {
        if (!slots[i]) slots[i] = []
        slots[i][assignedSlot] = task
      }

      const taskIndex = tasks.findIndex((t) => t.id === task.id)
      const color = TASK_COLOR_PALETTE[taskIndex % TASK_COLOR_PALETTE.length]
      const daysLeft = getDaysUntilDue(task.dueDate)

      weekTasks.push({ task, startCol, span, slot: assignedSlot, color, daysLeft })
    })

    return weekTasks
  }

  // 오늘 마감인 업무들
  const todayTasks = tasks.filter((task) => getDaysUntilDue(task.dueDate) === 0)
  const urgentTasks = tasks.filter((task) => getDaysUntilDue(task.dueDate) <= 3 && task.priority === "high")

  return (
    <div className="h-full p-6">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {monthYear}
              {urgentTasks.length > 0 && (
                <Badge variant="destructive" className="bg-orange-100 text-orange-800 border-orange-300">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  긴급 {urgentTasks.length}개
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="transition-all duration-200 hover:scale-110 hover:bg-primary/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
                className="transition-all duration-200 hover:scale-110 hover:bg-primary/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 오늘 마감 업무 알림 */}
          {todayTasks.length > 0 && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <Clock className="h-4 w-4" />
                <span className="font-medium">오늘 마감: {todayTasks.length}개 업무</span>
              </div>
              <div className="mt-1 text-sm text-red-600">{todayTasks.map((task) => task.title).join(", ")}</div>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day} className="p-2 text-center font-medium text-sm text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-rows-5 gap-1">
            {weeks.map((week, weekIndex) => {
              const weekLayout = getTaskLayoutForWeek(week)
              return (
                <div key={weekIndex} className="grid grid-cols-7 gap-1 relative">
                  {week.map((date, dayIndex) => {
                    const isToday = date && date.toDateString() === new Date().toDateString()
                    const dayTasks = tasks.filter((task) => {
                      if (!date) return false
                      const taskDate = new Date(task.dueDate)
                      return taskDate.toDateString() === date.toDateString()
                    })

                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          "border rounded-lg transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
                          date ? "bg-background cursor-pointer" : "bg-muted/20",
                          isToday && "ring-2 ring-primary bg-primary/10",
                        )}
                      >
                        {date && (
                          <div className="p-2">
                            <div className={cn("text-sm font-medium", isToday && "text-primary font-bold")}>
                              {date.getDate()}
                            </div>
                            {dayTasks.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {dayTasks.slice(0, 2).map((task) => {
                                  const daysLeft = getDaysUntilDue(task.dueDate)
                                  return (
                                    <div
                                      key={task.id}
                                      className={cn(
                                        "w-2 h-2 rounded-full transition-all duration-200 hover:scale-150",
                                        task.priority === "high"
                                          ? "bg-red-500"
                                          : task.priority === "medium"
                                            ? "bg-yellow-500"
                                            : "bg-green-500",
                                        daysLeft === 0 && "ring-2 ring-red-300",
                                      )}
                                      title={task.title}
                                    />
                                  )
                                })}
                                {dayTasks.length > 2 && (
                                  <div className="text-xs text-muted-foreground">+{dayTasks.length - 2}</div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {weekLayout.map(({ task, startCol, span, slot, color, daysLeft }) => (
                    <div
                      key={task.id + weekIndex}
                      className={cn(
                        "absolute h-6 rounded-md px-2 py-1 text-xs cursor-pointer flex items-center text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:z-10",
                        color,
                        getPriorityAnimation(task.priority, daysLeft),
                        hoveredTask === task.id && "scale-110 shadow-xl z-20",
                      )}
                      style={{
                        gridColumnStart: startCol + 1,
                        gridColumnEnd: `span ${span}`,
                        top: `${2.25 + slot * 1.75}rem`,
                        left: "0.125rem",
                        right: "0.125rem",
                      }}
                      onClick={() => onTaskSelect(task)}
                      onMouseEnter={() => setHoveredTask(task.id)}
                      onMouseLeave={() => setHoveredTask(null)}
                      title={`${task.title} - ${daysLeft}일 남음`}
                    >
                      <span className="font-semibold truncate">{task.title}</span>
                      {daysLeft <= 1 && <AlertTriangle className="h-3 w-3 ml-1 animate-bounce" />}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
