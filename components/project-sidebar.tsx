"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, FolderOpen } from "lucide-react"
import { TeamManagementDialog } from "@/components/team-management-dialog"
import { ProjectSettingsDialog } from "@/components/project-settings-dialog"
import type { Project } from "@/lib/api"

interface ProjectSidebarProps {
  projects: Project[]
  currentProject?: Project
  onSelectProject: (projectId: string) => void
  onAddProject: (project: { name: string; color: string; description?: string }) => void
  onUpdateProject: (project: Project) => void
  onDeleteProject: (projectId: string) => void
}

const projectColors = [
  { name: "파란색", value: "bg-blue-500" },
  { name: "초록색", value: "bg-green-500" },
  { name: "보라색", value: "bg-purple-500" },
  { name: "빨간색", value: "bg-red-500" },
  { name: "노란색", value: "bg-yellow-500" },
  { name: "분홍색", value: "bg-pink-500" },
]

export function ProjectSidebar({
  projects,
  currentProject,
  onSelectProject,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectColor, setNewProjectColor] = useState("bg-blue-500")

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddProject = () => {
    if (!newProjectName.trim()) return

    onAddProject({
      name: newProjectName,
      color: newProjectColor,
    })

    setNewProjectName("")
    setNewProjectColor("bg-blue-500")
    setIsAddProjectDialogOpen(false)
  }

  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="h-6 w-6" />
          <h2 className="font-semibold">프로젝트</h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프로젝트 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredProjects.map((project) => (
            <Button
              key={project.id}
              variant={currentProject?.id === project.id ? "secondary" : "ghost"}
              className="w-full justify-start mb-1 h-auto p-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
              onClick={() => onSelectProject(project.id)}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-3 h-3 rounded-full ${project.color} transition-all duration-200 hover:scale-125`} />
                <div className="flex-1 text-left min-w-0">
                  <div className="font-medium truncate">{project.name}</div>
                  <div className="text-xs text-muted-foreground">{project.members.length}명 참여중</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-4 space-y-2">
        <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:bg-primary/5"
            >
              <Plus className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />새 프로젝트
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 프로젝트 만들기</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">프로젝트 이름</Label>
                <Input
                  id="project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="프로젝트 이름을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="project-color">프로젝트 색상</Label>
                <Select value={newProjectColor} onValueChange={setNewProjectColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${color.value}`} />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddProject} className="flex-1">
                  만들기
                </Button>
                <Button variant="outline" onClick={() => setIsAddProjectDialogOpen(false)} className="flex-1">
                  취소
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex gap-2">
          {currentProject && (
            <>
              <TeamManagementDialog project={currentProject} onUpdateProject={onUpdateProject} />
              <ProjectSettingsDialog
                project={currentProject}
                onUpdateProject={onUpdateProject}
                onDeleteProject={onDeleteProject}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
