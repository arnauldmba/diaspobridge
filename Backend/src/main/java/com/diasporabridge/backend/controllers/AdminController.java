package com.diasporabridge.backend.controllers;

import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

  private final UserService userService;

  public AdminController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/ping")
  public String ping() {
    return "ok";
  }

  // ✅ GET /api/admin/users
  @GetMapping("/users")
  public Page<User> getAllActiveUsers(Pageable pageable) {
    return userService.getAllActiveUsers(pageable);
  }

  // ✅ GET /api/admin/users/{id}
  @GetMapping("/users/{id}")
  public User getUserById(@PathVariable Long id) {
    return userService.findActiveById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  // ✅ GET /api/admin/users/by-email?email=...
  @GetMapping("/users/by-email")
  public User getUserByEmail(@RequestParam String email) {
    return userService.findActiveByEmailIgnoreCase(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  // ✅ PUT /api/admin/users/{id}
  @PutMapping("/users/{id}")
  public User updateUser(@PathVariable Long id, @RequestBody User incomingUser) {
    return userService.updateUserProfile(id, incomingUser);
  }

  // ✅ PUT /api/admin/users/{id}/disable
  @PutMapping("/users/{id}/disable")
  public ResponseEntity<Void> disableUser(@PathVariable Long id) {
    userService.setActive(id, false);
    return ResponseEntity.noContent().build();
  }

  // ✅ PUT /api/admin/users/{id}/enable
  @PutMapping("/users/{id}/enable")
  public ResponseEntity<Void> enableUser(@PathVariable Long id) {
    userService.setActive(id, true);
    return ResponseEntity.noContent().build();
  }

  // ✅ DELETE /api/admin/users/{id}
  @DeleteMapping("/users/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.deleteUserById(id);
    return ResponseEntity.noContent().build();
  }
}
