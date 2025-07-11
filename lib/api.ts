const API_BASE_URL = 'http://localhost:8080/api'

export interface LoginRequest {
  username: string
  password: string
}

export interface SignupRequest {
  username: string
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    fullName: string
  }
}

export interface ApiError {
  message: string
  status?: number
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '로그인에 실패했습니다.')
    }

    localStorage.setItem('token', data.token)
    return data
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '회원가입에 실패했습니다.')
    }

    localStorage.setItem('token', data.token)
    return data
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('사용자 정보를 가져올 수 없습니다.')
    }

    return response.json()
  }

  logout(): void {
    localStorage.removeItem('token')
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  }
}

export const apiService = new ApiService()

// 프로젝트 관련 타입 정의
export interface Project {
  id: string
  name: string
  description?: string
  color: string
  members: Member[]
  createdAt: string
  updatedAt: string
}

export interface Member {
  id: string
  name: string
  email: string
  role: "ADMIN" | "MEMBER"
}

export interface CreateProjectRequest {
  name: string
  description?: string
  color: string
}

export interface UpdateProjectRequest {
  name?: string
  description?: string
  color?: string
}

// 프로젝트 API 서비스
class ProjectApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects/my`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('프로젝트 목록을 가져올 수 없습니다.')
    }

    return response.json()
  }

  async createProject(projectData: CreateProjectRequest): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '프로젝트 생성에 실패했습니다.')
    }

    return data
  }

  async updateProject(projectId: string, projectData: UpdateProjectRequest): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '프로젝트 수정에 실패했습니다.')
    }

    return data
  }

  async deleteProject(projectId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || '프로젝트 삭제에 실패했습니다.')
    }
  }

  async addMemberToProject(projectId: string, userId: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/members/${userId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '멤버 추가에 실패했습니다.')
    }

    return data
  }

  async removeMemberFromProject(projectId: string, userId: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/members/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '멤버 제거에 실패했습니다.')
    }

    return data
  }
}

export const projectApiService = new ProjectApiService()

// 태스크 관련 타입 정의
export interface Task {
  id: string
  title: string
  description: string
  status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "HOLD"
  priority: "LOW" | "MEDIUM" | "HIGH"
  assignees: Member[]
  startDate: string
  dueDate: string
  projectId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskRequest {
  title: string
  description: string
  status: Task["status"]
  priority: Task["priority"]
  startDate: string
  dueDate: string
  projectId: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  status?: Task["status"]
  priority?: Task["priority"]
  startDate?: string
  dueDate?: string
}

// 태스크 API 서비스
class TaskApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/project/${projectId}`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('태스크 목록을 가져올 수 없습니다.')
    }

    return response.json()
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '태스크 생성에 실패했습니다.')
    }

    return data
  }

  async updateTask(taskId: string, taskData: UpdateTaskRequest): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '태스크 수정에 실패했습니다.')
    }

    return data
  }

  async updateTaskStatus(taskId: string, status: Task["status"]): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '태스크 상태 수정에 실패했습니다.')
    }

    return data
  }

  async deleteTask(taskId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || '태스크 삭제에 실패했습니다.')
    }
  }

  async addAssigneeToTask(taskId: string, userId: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assignees/${userId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '담당자 추가에 실패했습니다.')
    }

    return data
  }

  async removeAssigneeFromTask(taskId: string, userId: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assignees/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '담당자 제거에 실패했습니다.')
    }

    return data
  }
}

export const taskApiService = new TaskApiService() 