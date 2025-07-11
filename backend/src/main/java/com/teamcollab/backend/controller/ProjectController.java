package com.teamcollab.backend.controller;

import com.teamcollab.backend.entity.Project;
import com.teamcollab.backend.entity.User;
import com.teamcollab.backend.service.ProjectService;
import com.teamcollab.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<Project>> getMyProjects(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        return ResponseEntity.ok(projectService.getProjectsByMemberId(user.getId()));
    }
    
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project, Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Project createdProject = projectService.createProject(project, user.getId());
        return ResponseEntity.ok(createdProject);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project projectDetails) {
        try {
            Project updatedProject = projectService.updateProject(id, projectDetails);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{projectId}/members/{userId}")
    public ResponseEntity<Project> addMemberToProject(@PathVariable Long projectId, @PathVariable Long userId) {
        try {
            Project project = projectService.addMemberToProject(projectId, userId);
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<Project> removeMemberFromProject(@PathVariable Long projectId, @PathVariable Long userId) {
        try {
            Project project = projectService.removeMemberFromProject(projectId, userId);
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Project>> searchProjects(@RequestParam String name) {
        return ResponseEntity.ok(projectService.searchProjectsByName(name));
    }
} 