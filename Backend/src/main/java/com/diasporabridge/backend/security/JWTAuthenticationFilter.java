package com.diasporabridge.backend.security;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.UsersRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;


public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter{
	
	private AuthenticationManager authenticationManager;
	
	//@Autowired
	private final UsersRepository usersRepository;

	public JWTAuthenticationFilter(AuthenticationManager authenticationManager,UsersRepository usersRepository) {
		super();
		this.authenticationManager = authenticationManager;
		this.usersRepository = usersRepository;
		setFilterProcessesUrl("/api/auth/login");
	}
	
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		
		try {
            LoginRequest loginRequest = new ObjectMapper()
                    .readValue(request.getInputStream(), LoginRequest.class);

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    );

            return authenticationManager.authenticate(authToken);

        } catch (IOException e) {
            throw new RuntimeException("Erreur de lecture de la requête login", e);
        }
		
	}

	@Override
	protected void successfulAuthentication(HttpServletRequest request, 
											HttpServletResponse response,
											FilterChain chain,
											Authentication authResult)
													throws IOException, ServletException {
		
		org.springframework.security.core.userdetails.User springUser =
				(org.springframework.security.core.userdetails.User) authResult.getPrincipal(); 
		
		if (!springUser.isEnabled()) { // garde-fou
	        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
	        response.setContentType("application/json");
	        new ObjectMapper().writeValue(response.getOutputStream(), Map.of(
	                "errorCause", "disabled",
	                "message", "Compte non activé"
	        ));
	        return;
	    }
		
		List<String> roles = springUser.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.toList());
		
		User userEntity = usersRepository.findActiveByEmailIgnoreCase(springUser.getUsername())
		        .orElseThrow(() -> new IllegalStateException("User not found for email: " + springUser.getUsername()));

		

        String jwt = JWT.create()
                .withSubject(springUser.getUsername()) 
                .withClaim("userId", userEntity.getId())  
                .withArrayClaim("roles", roles.toArray(new String[0]))
                .withExpiresAt(new Date(System.currentTimeMillis() + SecParams.EXP_TIME)) // 24h
                .sign(Algorithm.HMAC256(SecParams.SECRET));

        String bearerToken = SecParams.PREFIX + jwt;

        // Header
        response.addHeader("Authorization", bearerToken);

        // Réponse JSON
        response.setContentType("application/json");
        Map<String, Object> body = new HashMap<>();
        body.put("token", bearerToken);
        body.put("email", springUser.getUsername());
        body.put("roles", roles);
        body.put("UserId", userEntity.getId());

        new ObjectMapper().writeValue(response.getOutputStream(), body);
	} 
	
	@Override
	protected void unsuccessfulAuthentication(HttpServletRequest request,
			HttpServletResponse response, AuthenticationException failed)
					throws IOException, ServletException {
		if (failed instanceof DisabledException ) {
			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
			response.setContentType("application/json");
			Map<String, Object> data = new HashMap<>();

			data.put("errorCause", "disabled");
			data.put("message", "L'utilisateur est désactivé !");
			ObjectMapper objectMapper = new ObjectMapper();
			String json = objectMapper.writeValueAsString(data);
			PrintWriter writer = response.getWriter();
			writer.println(json);
			writer.flush();

		} else {
			super.unsuccessfulAuthentication(request, response, failed);
		}
	}
	
	
}
