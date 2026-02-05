package com.diasporabridge.backend.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JWTAuthorizationFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String jwt = request.getHeader("Authorization");

		if(jwt == null || !jwt.startsWith(SecParams.PREFIX)) {
			filterChain.doFilter(request, response);
			return; 
		}

		try {
			String tocken = jwt.substring(SecParams.PREFIX.length()); 
			JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SecParams.SECRET)).build();

			DecodedJWT decodedJWT = verifier.verify(tocken);

			String email = decodedJWT.getSubject();
			List<String> roles = decodedJWT.getClaims().get("roles").asList(String.class);

			Collection <GrantedAuthority> authorities = new ArrayList<>();

			if (roles != null) {
				for (String r : roles) authorities.add(new SimpleGrantedAuthority(r));
			}

			UsernamePasswordAuthenticationToken user = new UsernamePasswordAuthenticationToken(email, null, authorities);

			SecurityContextHolder.getContext().setAuthentication(user);
			filterChain.doFilter(request, response);

		} catch (TokenExpiredException ex) {
			SecurityContextHolder.clearContext();
			sendUnauthorized(response, "TOKEN_EXPIRED", "Votre session a expiré. Veuillez vous reconnecter.");
		} catch (JWTVerificationException ex) {
			SecurityContextHolder.clearContext();
			sendUnauthorized(response, "INVALID_TOKEN", "Token invalide. Veuillez vous reconnecter.");
		}

	}

	private void sendUnauthorized(HttpServletResponse response, String code, String message) throws IOException {
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
		response.setContentType("application/json");
		new ObjectMapper().writeValue(response.getOutputStream(), java.util.Map.of(
				"error", code,
				"message", message
				));
	}

}
