package com.diasporabridge.backend.services;

import java.util.List;
import java.util.Optional;

import com.diasporabridge.backend.entities.User;

public interface UserService {
	public User saveUser(User user);
	public User updateUser(User user);
	void deleteUser(User user);
	void deleteUserById(Long id);
	List <User> getAllUsers();
	
	Optional<User> findByEmail(String email);
	Optional<User> findByEmailIgnoreCase(String email);   // <-- recommandé	List<User> findByEmailContains(String email);
	boolean existsByEmail(String email);
	boolean existsByEmailIgnoreCase(String email);
	List<User> findByFirstName(String firstName);
}
