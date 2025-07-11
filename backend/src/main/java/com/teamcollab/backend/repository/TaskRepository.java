package com.teamcollab.backend.repository;

import com.teamcollab.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.assignees LEFT JOIN FETCH t.project WHERE t.project.id = :projectId")
    List<Task> findByProjectId(@Param("projectId") Long projectId);
    
    @Query("SELECT DISTINCT t FROM Task t JOIN t.assignees a LEFT JOIN FETCH t.assignees LEFT JOIN FETCH t.project WHERE a.id = :userId")
    List<Task> findByAssigneeId(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.assignees LEFT JOIN FETCH t.project WHERE t.project.id = :projectId AND t.status = :status")
    List<Task> findByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") Task.TaskStatus status);
    
    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.assignees LEFT JOIN FETCH t.project WHERE t.project.id = :projectId AND t.priority = :priority")
    List<Task> findByProjectIdAndPriority(@Param("projectId") Long projectId, @Param("priority") Task.Priority priority);
    
    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.assignees LEFT JOIN FETCH t.project WHERE t.dueDate <= :dueDate")
    List<Task> findTasksDueBy(@Param("dueDate") java.time.LocalDate dueDate);
} 