package com.diasporabridge.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.UsersRepository;

@Service
public class UserServiceImpl implements UserService{
	@Autowired
	UsersRepository usersRepository;

	@Override
	public User saveUser(User user) {
		return usersRepository.save(user);
	}

	@Override
	public User updateUser(User user) {
		return usersRepository.save(user);
	}

	@Override
	public void deleteUser(User user) {
		usersRepository.delete(user);
	}

	@Override
	public void deleteUserById(Long id) {
		usersRepository.deleteById(id);
	}

	@Override
	public List<User> getAllUsers() {
		return usersRepository.findAll();
	}


	@Override
	public Optional<User> findByEmailIgnoreCase(String email) {
		return usersRepository.findByEmailIgnoreCaseAndDeletedAtIsNull(email);
	}


	@Override
	public boolean existsByEmailIgnoreCase(String email) {
		return usersRepository.existsByEmailIgnoreCaseAndDeletedAtIsNull(email);
	}

	@Override
	public Optional<User> findByEmail(String email) {
		// TODO Auto-generated method stub
		return Optional.empty();
	}

	@Override
	public boolean existsByEmail(String email) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public List<User> findByFirstName(String firstName) {
		// TODO Auto-generated method stub
		return null;
	}

}
