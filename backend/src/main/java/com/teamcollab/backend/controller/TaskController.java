package com.teamcollab.backend.controller;

import com.teamcollab.backend.entity.Task;
import com.teamcollab.backend.entity.User;
import com.teamcollab.backend.service.TaskService;
import com.teamcollab.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProjectId(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getTasksByProjectId(projectId));
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<Task>> getMyTasks(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        return ResponseEntity.ok(taskService.getTasksByAssigneeId(user.getId()));
    }
    
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task, Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Task createdTask = taskService.createTask(task, user.getId());
        return ResponseEntity.ok(createdTask);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        try {
            Task updatedTask = taskService.updateTask(id, taskDetails);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long id, @RequestBody TaskStatusRequest request) {
        try {
            Task updatedTask = taskService.updateTaskStatus(id, request.getStatus());
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{taskId}/assignees/{userId}")
    public ResponseEntity<Task> addAssigneeToTask(@PathVariable Long taskId, @PathVariable Long userId) {
        try {
            Task task = taskService.addAssigneeToTask(taskId, userId);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{taskId}/assignees/{userId}")
    public ResponseEntity<Task> removeAssigneeFromTask(@PathVariable Long taskId, @PathVariable Long userId) {
        try {
            Task task = taskService.removeAssigneeFromTask(taskId, userId);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/project/{projectId}/status/{status}")
    public ResponseEntity<List<Task>> getTasksByProjectAndStatus(@PathVariable Long projectId, @PathVariable Task.TaskStatus status) {
        return ResponseEntity.ok(taskService.getTasksByProjectIdAndStatus(projectId, status));
    }
    
    @GetMapping("/due")
    public ResponseEntity<List<Task>> getTasksDueBy(@RequestParam String dueDate) {
        LocalDate date = LocalDate.parse(dueDate);
        return ResponseEntity.ok(taskService.getTasksDueBy(date));
    }
    
    // Request DTO
    public static class TaskStatusRequest {
        private Task.TaskStatus status;
        
        public Task.TaskStatus getStatus() { return status; }
        public void setStatus(Task.TaskStatus status) { this.status = status; }
    }
} 