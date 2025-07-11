"use client"

import { useState, useEffect } from "react"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from "@dnd-kit/core"
import { ProjectSidebar } from "@/components/project-sidebar"
import { TaskBoard } from "@/components/task-board"
import { TaskDetailPanel } from "@/components/task-detail-panel"
import { ChatPanel } from "@/components/chat-panel"
import { TaskCard } from "@/components/task-card"
import { NotificationsPopover } from "@/components/notifications-popover"
import { UserMenu } from "@/components/auth/user-menu"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/contexts/auth-context"
import { projectApiService, taskApiService, type Project, type Member, type Task } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Calendar, Kanban, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 기존 Task 인터페이스는 lib/api.ts에서 가져온 타입을 사용

export interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
}

export interface Notification {
  id: string
  type: "mention" | "assignment" | "comment"
  content: string
  timestamp: string
  isRead: boolean
  chatId?: string
}

const mockMembers: Member[] = [
  { id: "1", name: "김철수", email: "chulsoo@example.com", role: "ADMIN" },
  { id: "2", name: "이영희", email: "younghee@example.com", role: "MEMBER" },
  { id: "3", name: "박민수", email: "minsu@example.com", role: "MEMBER" },
  { id: "4", name: "최지은", email: "jieun@example.com", role: "MEMBER" },
  { id: "5", name: "정현우", email: "hyunwoo@example.com", role: "MEMBER" },
]

const mockTasks: Task[] = [
  {
    id: "1",
    title: "홈페이지 레이아웃 디자인",
    description: "새로운 홈페이지 디자인을 위한 와이어프레임 및 목업 제작",
    status: "TODO",
    priority: "HIGH",
    assignees: [mockMembers[0], mockMembers[1]],
    startDate: "2025-07-01",
    dueDate: "2025-07-07",
    projectId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "사용자 인증 시스템 구현",
    description: "JWT 인증 시스템과 로그인/회원가입 기능 구현",
    status: "IN_PROGRESS",
    priority: "HIGH",
    assignees: [mockMembers[2]],
    startDate: "2025-07-03",
    dueDate: "2025-07-12",
    projectId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "앱 아이콘 디자인",
    description: "iOS 및 Android용 앱 아이콘 시안 제작",
    status: "COMPLETED",
    priority: "MEDIUM",
    assignees: [mockMembers[3]],
    startDate: "2025-07-08",
    dueDate: "2025-07-10",
    projectId: "2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "푸시 알림 서버 구축",
    description: "FCM을 이용한 푸시 알림 기능 구현",
    status: "IN_PROGRESS",
    priority: "HIGH",
    assignees: [mockMembers[4]],
    startDate: "2025-07-11",
    dueDate: "2025-07-18",
    projectId: "2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "SNS 광고 캠페인 기획",
    description: "인스타그램 및 페이스북 광고 소재 제작 및 예산 수립",
    status: "TODO",
    priority: "MEDIUM",
    assignees: [mockMembers[1]],
    startDate: "2025-07-15",
    dueDate: "2025-07-22",
    projectId: "3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "블로그 콘텐츠 작성",
    description: "신규 기능 홍보를 위한 블로그 포스팅",
    status: "COMPLETED",
    priority: "LOW",
    assignees: [mockMembers[3]],
    startDate: "2025-07-20",
    dueDate: "2025-07-23",
    projectId: "3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    title: "데이터베이스 마이그레이션",
    description: "기존 데이터를 신규 스키마로 이전",
    status: "HOLD",
    priority: "HIGH",
    assignees: [mockMembers[4], mockMembers[2]],
    startDate: "2025-07-25",
    dueDate: "2025-07-30",
    projectId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const mockProjects: Project[] = [
  { 
    id: "1", 
    name: "웹사이트 리뉴얼", 
    color: "bg-blue-500", 
    members: mockMembers,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: "2", 
    name: "모바일 앱 개발", 
    color: "bg-green-500", 
    members: mockMembers.slice(0, 3),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: "3", 
    name: "마케팅 캠페인", 
    color: "bg-purple-500", 
    members: mockMembers.slice(2, 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
]

export default function HomePage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [selectedProject, setSelectedProject] = useState<string>("1")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [projects, setProjects] = useState<Project[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"kanban" | "calendar">("kanban")
  const [showChat, setShowChat] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "mention",
      content: "이영희님이 '홈페이지 레이아웃' 업무에서 당신을 멘션했습니다.",
      timestamp: "2025-01-15T10:00:00Z",
      isRead: false,
      chatId: "john-doe",
    },
    {
      id: "2",
      type: "assignment",
      content: "'사용자 인증 시스템' 업무에 배정되었습니다.",
      timestamp: "2025-01-14T14:30:00Z",
      isRead: false,
    },
    {
      id: "3",
      type: "comment",
      content: "김철수님이 '콘텐츠 전략' 업무에 댓글을 남겼습니다.",
      timestamp: "2025-01-13T09:00:00Z",
      isRead: true,
      chatId: "park-minsu",
    },
  ])

  // 프로젝트와 태스크 로딩
  useEffect(() => {
    if (user) {
      loadProjects()
    }
  }, [user])

  useEffect(() => {
    if (selectedProject) {
      loadTasks()
    }
  }, [selectedProject])

  const loadProjects = async () => {
    try {
      const projectsData = await projectApiService.getProjects()
      setProjects(projectsData)
      if (projectsData.length > 0 && !selectedProject) {
        setSelectedProject(projectsData[0].id)
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "프로젝트 로딩 실패",
        description: error.message,
      })
    }
  }

  const loadTasks = async () => {
    if (!selectedProject) return
    
    try {
      const tasksData = await taskApiService.getTasksByProject(selectedProject)
      setTasks(tasksData)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "태스크 로딩 실패",
        description: error.message,
      })
    }
  }

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const activeTask = tasks.find((task) => task.id === active.id)
    if (!activeTask) {
      setActiveId(null)
      return
    }

    const overId = over.id as string
    const newStatus = overId as Task["status"]

    if (activeTask.status !== newStatus) {
      try {
        const updatedTask = await taskApiService.updateTaskStatus(activeTask.id, newStatus)
        setTasks(tasks.map((task) => (task.id === active.id ? updatedTask : task)))
        toast({
          title: "태스크 상태 변경",
          description: "태스크 상태가 업데이트되었습니다.",
        })
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "태스크 상태 변경 실패",
          description: error.message,
        })
      }
    }

    setActiveId(null)
  }

  const handleAddProject = async (project: { name: string; color: string; description?: string }) => {
    try {
      const newProject = await projectApiService.createProject({
        name: project.name,
        description: project.description,
        color: project.color,
      })
      setProjects([...projects, newProject])
      toast({
        title: "프로젝트 생성 성공",
        description: "새 프로젝트가 생성되었습니다.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "프로젝트 생성 실패",
        description: error.message,
      })
    }
  }

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      const { id, ...updateData } = updatedProject
      const result = await projectApiService.updateProject(id, updateData)
      setProjects(projects.map((project) => (project.id === updatedProject.id ? result : project)))
      toast({
        title: "프로젝트 수정 성공",
        description: "프로젝트가 수정되었습니다.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "프로젝트 수정 실패",
        description: error.message,
      })
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      await projectApiService.deleteProject(projectId)
      setProjects(projects.filter((project) => project.id !== projectId))
      if (selectedProject === projectId) {
        setSelectedProject(projects[0]?.id || "")
      }
      toast({
        title: "프로젝트 삭제 성공",
        description: "프로젝트가 삭제되었습니다.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "프로젝트 삭제 실패",
        description: error.message,
      })
    }
  }

  const handleAddTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "assignees">) => {
    try {
      const newTask = await taskApiService.createTask({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        dueDate: task.dueDate,
        projectId: selectedProject,
      })
      setTasks([...tasks, newTask])
      toast({
        title: "태스크 생성 성공",
        description: "새 태스크가 생성되었습니다.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "태스크 생성 실패",
        description: error.message,
      })
    }
  }

  const currentProject = projects.find((p) => p.id === selectedProject)
  const filteredTasks = tasks.filter((task) => task.projectId === selectedProject)
  const activeTask = tasks.find((task) => task.id === activeId)

  const handleReadMessages = (chatId: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.chatId === chatId ? { ...notification, isRead: true } : notification)),
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <ProjectSidebar
          projects={projects}
          currentProject={currentProject}
          onSelectProject={setSelectedProject}
          onAddProject={handleAddProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
        />

        <div className="flex-1 flex flex-col">
          <header className="border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">{currentProject?.name}</h1>
              <Badge variant="secondary">{filteredTasks.length}개 업무</Badge>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border p-1 bg-muted/50">
                <Button
                  variant={viewMode === "kanban" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("kanban")}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Kanban className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant={showChat ? "default" : "outline"}
                size="sm"
                onClick={() => setShowChat(!showChat)}
                className="transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>

              <div className="transition-all duration-200 hover:scale-105">
                <NotificationsPopover
                  notifications={notifications}
                  onMarkAllAsRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))}
                />
              </div>
              <div className="transition-all duration-200 hover:scale-105">
                <UserMenu />
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden">
            <TaskBoard
              tasks={filteredTasks}
              viewMode={viewMode}
              onTaskSelect={setSelectedTask}
              onAddTask={handleAddTask}
              selectedProject={selectedProject}
              projects={projects}
            />
          </div>
        </div>

        <div className="w-80 border-l flex flex-col">
          {showChat ? (
            <ChatPanel projectId={selectedProject} onReadMessages={handleReadMessages} />
          ) : selectedTask ? (
            <TaskDetailPanel
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
              onUpdate={(updatedTask) => {
                setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
                setSelectedTask(updatedTask)
              }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Kanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>업무를 선택하여 상세 정보를 확인하세요</p>
              </div>
            </div>
          )}
        </div>

        <DragOverlay>{activeTask ? <TaskCard task={activeTask} isDragging /> : null}</DragOverlay>
      </DndContext>
    </div>
  )
}
