"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings } from "lucide-react"
import type { Project } from "@/app/page"

interface ProjectSettingsDialogProps {
  project: Project
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

export function ProjectSettingsDialog({ project, onUpdateProject, onDeleteProject }: ProjectSettingsDialogProps) {
  const [name, setName] = useState(project.name)
  const [color, setColor] = useState(project.color)

  const handleSave = () => {
    onUpdateProject({ ...project, name, color })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>프로젝트 설정: {project.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="project-name">프로젝트 이름</Label>
            <Input id="project-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="project-color">프로젝트 색상</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {projectColors.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${c.value}`} />
                      {c.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} className="w-full">
            변경사항 저장
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                프로젝트 삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다. 프로젝트와 관련된 모든 데이터가 영구적으로 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeleteProject(project.id)}>삭제</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  )
}
