package com.teamcollab.backend.config;

import com.teamcollab.backend.entity.Project;
import com.teamcollab.backend.entity.Task;
import com.teamcollab.backend.entity.User;
import com.teamcollab.backend.repository.ProjectRepository;
import com.teamcollab.backend.repository.TaskRepository;
import com.teamcollab.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // 사용자 데이터 초기화
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setName("관리자");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            
            User user1 = new User();
            user1.setUsername("user1");
            user1.setEmail("user1@example.com");
            user1.setPassword(passwordEncoder.encode("user123"));
            user1.setName("김철수");
            user1.setRole(User.Role.MEMBER);
            userRepository.save(user1);
            
            User user2 = new User();
            user2.setUsername("user2");
            user2.setEmail("user2@example.com");
            user2.setPassword(passwordEncoder.encode("user123"));
            user2.setName("이영희");
            user2.setRole(User.Role.MEMBER);
            userRepository.save(user2);
            
            User user3 = new User();
            user3.setUsername("user3");
            user3.setEmail("user3@example.com");
            user3.setPassword(passwordEncoder.encode("user123"));
            user3.setName("박민수");
            user3.setRole(User.Role.MEMBER);
            userRepository.save(user3);
            
            // 프로젝트 데이터 초기화
            Project project1 = new Project();
            project1.setName("웹사이트 리뉴얼");
            project1.setColor("#3B82F6");
            project1.setCreatedBy(admin);
            project1.addMember(admin);
            project1.addMember(user1);
            project1.addMember(user2);
            projectRepository.save(project1);
            
            Project project2 = new Project();
            project2.setName("모바일 앱 개발");
            project2.setColor("#10B981");
            project2.setCreatedBy(admin);
            project2.addMember(admin);
            project2.addMember(user2);
            project2.addMember(user3);
            projectRepository.save(project2);
            
            // 태스크 데이터 초기화
            Task task1 = new Task();
            task1.setTitle("홈페이지 레이아웃 디자인");
            task1.setDescription("새로운 홈페이지 디자인을 위한 와이어프레임 및 목업 제작");
            task1.setStatus(Task.TaskStatus.TODO);
            task1.setPriority(Task.Priority.HIGH);
            task1.setProject(project1);
            task1.setCreatedBy(admin);
            task1.setStartDate(LocalDate.now());
            task1.setDueDate(LocalDate.now().plusDays(7));
            task1.addAssignee(user1);
            task1.addAssignee(user2);
            taskRepository.save(task1);
            
            Task task2 = new Task();
            task2.setTitle("사용자 인증 시스템 구현");
            task2.setDescription("JWT 인증 시스템과 로그인/회원가입 기능 구현");
            task2.setStatus(Task.TaskStatus.IN_PROGRESS);
            task2.setPriority(Task.Priority.HIGH);
            task2.setProject(project1);
            task2.setCreatedBy(admin);
            task2.setStartDate(LocalDate.now().plusDays(2));
            task2.setDueDate(LocalDate.now().plusDays(12));
            task2.addAssignee(user3);
            taskRepository.save(task2);
            
            Task task3 = new Task();
            task3.setTitle("앱 아이콘 디자인");
            task3.setDescription("iOS 및 Android용 앱 아이콘 시안 제작");
            task3.setStatus(Task.TaskStatus.COMPLETED);
            task3.setPriority(Task.Priority.MEDIUM);
            task3.setProject(project2);
            task3.setCreatedBy(admin);
            task3.setStartDate(LocalDate.now().minusDays(5));
            task3.setDueDate(LocalDate.now().minusDays(2));
            task3.addAssignee(user2);
            taskRepository.save(task3);
            
            System.out.println("초기 데이터가 성공적으로 생성되었습니다.");
        }
    }
} 