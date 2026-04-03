package com.diasporabridge.backend.security;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

	@Autowired
	AuthenticationManager authMgr;

	private final UsersRepository usersRepository;
	
	@Value("${app.cors.allowed-origins}")
	private String allowedOrigins;
	
	@Bean
	public SecurityFilterChain filterChain (HttpSecurity http) throws Exception{
		
        JWTAuthenticationFilter jwtAuthFilter = new JWTAuthenticationFilter(authMgr, usersRepository);

        http
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .csrf(csrf -> csrf.disable())
        
        .cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration c = new CorsConfiguration();

			List<String> origins = Arrays.stream(allowedOrigins.split(","))
                        .map(String::trim)
                        .toList();

            c.setAllowedOrigins(origins);

            c.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
            ));

            c.setAllowedHeaders(List.of(
                "Authorization", "Content-Type", "Accept"
            ));

            c.setExposedHeaders(List.of("Authorization"));
			c.setAllowCredentials(true);
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
				
				.requestMatchers("/api/admin/**").hasRole("ADMIN")


        	    .anyRequest().authenticated()
        )
        
        .addFilter(jwtAuthFilter)
        .addFilterBefore(new JWTAuthorizationFilter(usersRepository), UsernamePasswordAuthenticationFilter.class);
        
        
        return http.build();
	}
}