package com.diasporabridge.backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.services.UserService;

import DTO.RegistrationRequest;
import jakarta.transaction.Transactional;


@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserRESTController {

	//@Autowired
	private final UserService userService;
	
	public UserRESTController(UserService userService) { 
		this.userService = userService; 
	}

	
	//@GetMapping
	@RequestMapping(method=RequestMethod.GET)
	List<User> getAllUsers(){
		return userService.getAllActiveUsers();
	}
	
	// POST /api/users
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }
	
    // GET /api/users/{id}
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findActiveById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
	
	
	@PutMapping("/{id}")
	public User updateUser(
	        @PathVariable Long id,
	        @RequestBody User incomingUser
	) {
	    return userService.updateUserProfile(id, incomingUser);
	}
	
	// DELETE /api/users/{id}
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
    }
}
