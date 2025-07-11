package com.teamcollab.backend.service;

import com.teamcollab.backend.entity.Project;
import com.teamcollab.backend.entity.User;
import com.teamcollab.backend.repository.ProjectRepository;
import com.teamcollab.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }
    
    public List<Project> getProjectsByMemberId(Long memberId) {
        return projectRepository.findByMemberId(memberId);
    }
    
    public List<Project> getProjectsByCreatedById(Long createdById) {
        return projectRepository.findByCreatedById(createdById);
    }
    
    public List<Project> searchProjectsByName(String name) {
        return projectRepository.findByNameContainingIgnoreCase(name);
    }
    
    public Project createProject(Project project, Long createdById) {
        User creator = userRepository.findById(createdById)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        project.setCreatedBy(creator);
        project.addMember(creator); // 생성자는 자동으로 멤버가 됩니다
        
        return projectRepository.save(project);
    }
    
    public Project updateProject(Long id, Project projectDetails) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));
        
        project.setName(projectDetails.getName());
        project.setColor(projectDetails.getColor());
        
        return projectRepository.save(project);
    }
    
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
    
    public Project addMemberToProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        project.addMember(user);
        return projectRepository.save(project);
    }
    
    public Project removeMemberFromProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        project.removeMember(user);
        return projectRepository.save(project);
    }
} 