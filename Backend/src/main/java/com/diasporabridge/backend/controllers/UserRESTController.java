package com.diasporabridge.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.services.UserService;

import jakarta.transaction.Transactional;


@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserRESTController {

	//@Autowired
	UserService userService;
	
	public UserRESTController(UserService userService) { this.userService = userService; }

	
	//@GetMapping
	@RequestMapping(method=RequestMethod.GET)
	List<User> getAllUsers(){
		return userService.getAllUsers();
	}
	
	@PostMapping
	public User create(@RequestBody User user) {
	  return userService.saveUser(user);
	}
	

}
