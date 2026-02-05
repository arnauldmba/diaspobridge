package com.diasporabridge.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.services.UserService;

@EnableScheduling
@SpringBootApplication
public class BackendApplication {
	
	@Autowired
	UserService userService;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
	
	void ini_users() {
		userService.addRoleToUser("arnauldmba@gmail.com", User.Role.ADMIN);
	}

}
