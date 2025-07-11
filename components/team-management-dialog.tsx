"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Trash2 } from "lucide-react"
import type { Project, Member } from "@/app/page"

interface TeamManagementDialogProps {
  project: Project
  onUpdateProject: (project: Project) => void
}

export function TeamManagementDialog({ project, onUpdateProject }: TeamManagementDialogProps) {
  const [members, setMembers] = useState(project.members)
  const [inviteEmail, setInviteEmail] = useState("")

  const handleInvite = () => {
    if (!inviteEmail.trim() || members.some((m) => m.email === inviteEmail)) return

    const newMember: Member = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: "Member",
    }
    const updatedMembers = [...members, newMember]
    setMembers(updatedMembers)
    onUpdateProject({ ...project, members: updatedMembers })
    setInviteEmail("")
  }

  const handleRoleChange = (memberId: string, role: Member["role"]) => {
    const updatedMembers = members.map((m) => (m.id === memberId ? { ...m, role } : m))
    setMembers(updatedMembers)
    onUpdateProject({ ...project, members: updatedMembers })
  }

  const handleRemoveMember = (memberId: string) => {
    const updatedMembers = members.filter((m) => m.id !== memberId)
    setMembers(updatedMembers)
    onUpdateProject({ ...project, members: updatedMembers })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          <Users className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>팀원 관리: {project.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>팀원 초대</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="이메일로 초대"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Button onClick={handleInvite}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="h-64">
            <div className="space-y-2 pr-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={member.role}
                      onValueChange={(value) => handleRoleChange(member.id, value as Member["role"])}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">관리자</SelectItem>
                        <SelectItem value="Member">멤버</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(member.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
