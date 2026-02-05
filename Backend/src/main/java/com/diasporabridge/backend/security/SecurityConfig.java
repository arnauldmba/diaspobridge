package com.diasporabridge.backend.security;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.diasporabridge.backend.entities.Match;
import com.diasporabridge.backend.entities.ParcelRequest;
import com.diasporabridge.backend.entities.TransporterTrip;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.entities.Match.MatchStatus;
import com.diasporabridge.backend.entities.Match.ProposedBy;
import com.diasporabridge.backend.repos.UsersRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
//@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
	@Autowired
	AuthenticationManager authMgr;

	private final UsersRepository usersRepository;
	
	
	@Bean
	public SecurityFilterChain filterChain (HttpSecurity http) throws Exception{
		
        JWTAuthenticationFilter jwtAuthFilter = new JWTAuthenticationFilter(authMgr, usersRepository);

        http
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .csrf(csrf -> csrf.disable())
        
        // permet la coonection avec angular. Sinon erreur Cross origin dans le frontend (angular)
        /*
        .cors(cors -> cors.configurationSource(new CorsConfigurationSource() {

			@Override
			public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
				CorsConfiguration cors = new CorsConfiguration();
				// TODO : passer à une variable env plus tard
				cors.setAllowedOrigins(Collections.singletonList("http://localhost:4200")); 
				cors.setAllowedMethods(Collections.singletonList("*")); 
				cors.setAllowedHeaders(Collections.singletonList("*")); 
				cors.setExposedHeaders(Collections.singletonList("Authorization")); 		
				return cors;
			}
        }))
        */
        
        .cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration c = new CorsConfiguration();

            c.setAllowedOrigins(java.util.List.of(
                "http://localhost:4200",
                "http://192.168.178.21:4200"
            ));

            c.setAllowedMethods(java.util.List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
            ));

            c.setAllowedHeaders(java.util.List.of(
                "Authorization", "Content-Type", "Accept"
            ));

            c.setExposedHeaders(java.util.List.of("Authorization"));
            c.setMaxAge(3600L);

            return c;
        }))
        
        .authorizeHttpRequests(requests -> requests
        		.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        		
        		// public
        	    .requestMatchers("/api/auth/**").permitAll()
        	    .requestMatchers(HttpMethod.GET, "/api/trip/**").permitAll()
        	    .requestMatchers(HttpMethod.GET, "/api/trip/search/**").permitAll()
        	    
        	    // authenticated
        	    .requestMatchers(HttpMethod.POST, "/api/trip/**").authenticated()
        	    .requestMatchers(HttpMethod.PUT, "/api/trip/**").authenticated()
        	    .requestMatchers(HttpMethod.DELETE, "/api/trip/**").authenticated()
        	    
        	    .requestMatchers("/api/profile/me").authenticated()
        	    .requestMatchers("/api/matches/**").authenticated()
        	    .requestMatchers("/api/messages/**").authenticated()

        	    // admin (si tu veux le garder)
        	    .requestMatchers("/api/users/**").hasAuthority("ADMIN")

        	    .anyRequest().authenticated()
        )
        
        .addFilter(jwtAuthFilter)
        .addFilterBefore(new JWTAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        
        return http.build();
	}
}