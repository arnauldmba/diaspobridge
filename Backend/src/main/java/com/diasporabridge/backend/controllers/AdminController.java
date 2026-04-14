package com.diasporabridge.backend.controllers;

import com.diasporabridge.backend.user.entity.User;
import com.diasporabridge.backend.user.service.UserService;
import com.diasporabridge.backend.admin.dto.AdminDashboardStatsDTO;
import com.diasporabridge.backend.admin.dto.AdminTripRowDTO;
import com.diasporabridge.backend.admin.dto.AdminUserRowDTO;
import com.diasporabridge.backend.admin.service.AdminService;
import com.diasporabridge.backend.trip.entity.TransporterTrip;

//import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

  private final AdminService adminService;
  private final UserService userService;


  public AdminController(UserService userService, AdminService adminService) {
    this.userService = userService;
    this.adminService = adminService; 
  }

  // =========================
  // DASHBOARD
  // =========================
  @GetMapping("/dashboard/stats")
  public AdminDashboardStatsDTO getStats() {
    return adminService.getDashboardStats();
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

  // retourn uniquement les utilisateurs actifs
  // ✅ GET /api/admin/users/{id}
  @GetMapping("/users/{id}/active")
  public User getUserActiveById(@PathVariable Long id) {
    return userService.findActiveById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  // retourn uniquement les utilisateurs actifs
  // ✅ GET /api/admin/users/{id}
  @GetMapping("/users/{id}")
  public User getUserById(@PathVariable Long id) {
    return userService.findById(id)
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

  // ✅ RESTORE /api/admin/users/{id}
  @PatchMapping("/users/{id}/restore")
  public ResponseEntity<Void> restoreUser(@PathVariable Long id) {
      userService.restoreUserById(id);
      return ResponseEntity.noContent().build();
  }

  // =========================
  // LISTINGS
  // =========================
  @GetMapping("/listings")
  public List<TransporterTrip> getListings() {
      return adminService.getAllListings();
      //return transporterTripService.getAllTransporterTrip();
  }

  @DeleteMapping("/listings/{id}")
  public void deleteListing(@PathVariable Long id) {
      adminService.deleteListing(id);
  }

  @PatchMapping("/listings/{id}/hide")
  public void hideListing(@PathVariable Long id) {
      adminService.hideListing(id);
  }

  // =========================
  // USERS
  // =========================
  @GetMapping("/users/all")
  public List<AdminUserRowDTO> getAllUsersIncludingDeleted() {
      return adminService.getAllUsersIncludingDeleted();
  }

  @GetMapping("/trips/all")
  public List<AdminTripRowDTO> getAllTripsIncludingDeletedTransporters() {
      return adminService.getAllTripsIncludingDeletedTransporters();
  }
}