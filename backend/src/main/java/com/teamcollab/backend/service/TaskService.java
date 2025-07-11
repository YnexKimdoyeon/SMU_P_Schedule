package com.teamcollab.backend.service;

import com.teamcollab.backend.entity.Task;
import com.teamcollab.backend.entity.User;
import com.teamcollab.backend.entity.Project;
import com.teamcollab.backend.repository.TaskRepository;
import com.teamcollab.backend.repository.UserRepository;
import com.teamcollab.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
    
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }
    
    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }
    
    public List<Task> getTasksByAssigneeId(Long assigneeId) {
        return taskRepository.findByAssigneeId(assigneeId);
    }
    
    public List<Task> getTasksByProjectIdAndStatus(Long projectId, Task.TaskStatus status) {
        return taskRepository.findByProjectIdAndStatus(projectId, status);
    }
    
    public List<Task> getTasksByProjectIdAndPriority(Long projectId, Task.Priority priority) {
        return taskRepository.findByProjectIdAndPriority(projectId, priority);
    }
    
    public List<Task> getTasksDueBy(LocalDate dueDate) {
        return taskRepository.findTasksDueBy(dueDate);
    }
    
    public Task createTask(Task task, Long createdById, Long projectId) {
        User creator = userRepository.findById(createdById)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        // Project 설정
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));
        task.setProject(project);
        
        task.setCreatedBy(creator);
        return taskRepository.save(task);
    }
    
    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("태스크를 찾을 수 없습니다."));
        
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setPriority(taskDetails.getPriority());
        task.setStartDate(taskDetails.getStartDate());
        task.setDueDate(taskDetails.getDueDate());
        
        return taskRepository.save(task);
    }
    
    public Task updateTaskStatus(Long id, Task.TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("태스크를 찾을 수 없습니다."));
        
        task.setStatus(status);
        return taskRepository.save(task);
    }
    
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
    
    public Task addAssigneeToTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("태스크를 찾을 수 없습니다."));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        task.addAssignee(user);
        return taskRepository.save(task);
    }
    
    public Task removeAssigneeFromTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("태스크를 찾을 수 없습니다."));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        task.removeAssignee(user);
        return taskRepository.save(task);
    }
} 