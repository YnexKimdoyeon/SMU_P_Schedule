package com.teamcollab.backend.controller;

import com.teamcollab.backend.entity.User;
import com.teamcollab.backend.security.JwtUtil;
import com.teamcollab.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            
            final UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());
            final String jwt = jwtUtil.generateToken(userDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("user", userDetails);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", true);
            errorResponse.put("message", "이메일 또는 비밀번호가 올바르지 않습니다.");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword());
            user.setName(registerRequest.getName());
            user.setRole(User.Role.MEMBER);
            
            User savedUser = userService.createUser(user);
            
            final UserDetails userDetails = userService.loadUserByUsername(savedUser.getUsername());
            final String jwt = jwtUtil.generateToken(userDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("user", savedUser);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", true);
            errorResponse.put("message", "회원가입에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String username = jwtUtil.extractUsername(token);
                
                if (username != null && jwtUtil.validateToken(token, userService.loadUserByUsername(username))) {
                    User user = userService.getUserByUsername(username)
                            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
                    return ResponseEntity.ok(user);
                }
            }
            return ResponseEntity.status(401).body("인증되지 않은 요청입니다.");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("토큰이 유효하지 않습니다: " + e.getMessage());
        }
    }
    
    // Request DTOs
    public static class LoginRequest {
        private String username;
        private String password;
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String name;
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
} 