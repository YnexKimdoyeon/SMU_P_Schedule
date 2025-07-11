package com.teamcollab.backend.repository;

import com.teamcollab.backend.entity.Project;
import com.teamcollab.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    @Query("SELECT p FROM Project p JOIN p.members m WHERE m.id = :userId")
    List<Project> findByMemberId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Project p WHERE p.createdBy.id = :userId")
    List<Project> findByCreatedById(@Param("userId") Long userId);
    
    List<Project> findByNameContainingIgnoreCase(String name);
} 