package com.concert.concertbooking.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // Frontend access
public class UserController {

    private final List<Map<String, Object>> users = new ArrayList<>();

    public UserController() {
        // Default Admin (for testing)
        Map<String, Object> admin = new HashMap<>();
        admin.put("id", 1);
        admin.put("name", "Admin");
        admin.put("email", "admin@concert.com");
        admin.put("password", "admin123");
        admin.put("role", "ADMIN");
        users.add(admin);
    }

    // ✅ SIGNUP - Register new user
    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody Map<String, Object> newUser) {
        String email = (String) newUser.get("email");

        // Check if user already exists
        boolean exists = users.stream().anyMatch(u -> u.get("email").equals(email));
        if (exists) {
            return Map.of("error", "User already exists!");
        }

        newUser.put("id", users.size() + 1);
        newUser.put("role", "USER");
        users.add(newUser);

        return Map.of("message", "User registered successfully!", "user", newUser);
    }

    // ✅ LOGIN - Verify credentials
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, Object> credentials) {
        String email = (String) credentials.get("email");
        String password = (String) credentials.get("password");

        Optional<Map<String, Object>> userOpt = users.stream()
                .filter(u -> u.get("email").equals(email) && u.get("password").equals(password))
                .findFirst();

        if (userOpt.isPresent()) {
            return Map.of("message", "Login successful", "user", userOpt.get());
        } else {
            return Map.of("error", "Invalid email or password");
        }
    }

    // ✅ Get all users (Admin)
    @GetMapping
    public List<Map<String, Object>> getAllUsers() {
        return users;
    }
}
