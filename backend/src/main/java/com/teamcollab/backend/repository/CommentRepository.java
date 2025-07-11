package com.teamcollab.backend.repository;

import com.teamcollab.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByTaskIdOrderByCreatedAtDesc(Long taskId);
    
    List<Comment> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
} 