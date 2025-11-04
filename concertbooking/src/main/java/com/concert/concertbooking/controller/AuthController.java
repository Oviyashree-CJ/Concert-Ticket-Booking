package com.concert.concertbooking.controller;

import com.concert.concertbooking.model.User;
import com.concert.concertbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // ✅ Signup API
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
            if (existingUser.isPresent()) {
                response.put("success", false);
                response.put("message", "User already exists with this email");
                return ResponseEntity.badRequest().body(response);
            }

            // Default role if not provided
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("user");
            }

            userRepository.save(user);

            response.put("success", true);
            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Server error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // ✅ Login API
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

            if (existingUser.isPresent()) {
                User foundUser = existingUser.get();

                if (foundUser.getPassword().equals(user.getPassword())) {
                    response.put("success", true);
                    response.put("message", "Login successful");
                    response.put("role", foundUser.getRole());
                    response.put("name", foundUser.getName());
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("message", "Invalid password");
                    return ResponseEntity.status(401).body(response);
                }
            } else {
                response.put("success", false);
                response.put("message", "No user found with this email");
                return ResponseEntity.status(404).body(response);
            }

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Server error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
