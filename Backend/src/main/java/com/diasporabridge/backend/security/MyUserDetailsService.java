package com.diasporabridge.backend.security;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.services.UserService;

@Service
public class MyUserDetailsService implements UserDetailsService {
	
	@Autowired
	UserService userService;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

	    //️⃣ Trouver l'utilisateur par email
	    User user = userService.findActiveByEmailIgnoreCase(email)
	    		.orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable : " + email));

	    List<GrantedAuthority> auths = new ArrayList<>();
	    auths.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
	    
	    boolean enabled = Boolean.TRUE.equals(user.getIsActive())
	               && Boolean.TRUE.equals(user.getEmailVerified());
	    
	    
	    return new org.springframework.security.core.userdetails.User(
	            user.getEmail(), // identifiant
	            user.getPasswordHash(), // mot de passe
	            enabled,
	            true, 
	            true, 
	            true,
	            auths // autorités
	    );
	}

}
