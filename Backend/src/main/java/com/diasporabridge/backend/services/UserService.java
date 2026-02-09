package com.diasporabridge.backend.services;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import com.diasporabridge.backend.entities.User;

import DTO.RegistrationRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
	
	public User saveUser(User user);
	User findByFirstName(String firstName);
	public User currentUser(Principal principal);
	
	/*
	User addRoleToUser(String unsername, User.Role rolname);
	Page<User> listByRole(User user, User.Role role, Pageable pageable);
	*/
	
	public User updateUser(User user);
	public User updateUserProfile(Long id, User incomingUser);
	void deleteUser(User user);
	void deleteUserById(Long id);
	
	Optional<User> findActiveByEmailIgnoreCase(String email);
	boolean existsActiveByEmailIgnoreCase(String email);
	Optional<User> findActiveById(Long id);
	
	List<User> getAllActiveUsers();
	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);
	
	User addRoleToUser(String email, User.Role rolname);
	
	User registerUser(RegistrationRequest request);
	
	public void resendVerificationToken(String email);
	
	public void sendEmailUser(User user, String code);
	public User validateToken(String code);
	public Page<User> getAllActiveUsers(Pageable pageable);
	public void setActive(Long userId, boolean active) ;
	
}
