package com.diasporabridge.backend.security;

import java.util.Map;


import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.services.UserService;

import DTO.RegistrationRequest;
import DTO.ResendVerificationRequest;

/*@CrossOrigin(origins = "http://localhost:4200")*/
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UserService userService,
                          BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegistrationRequest resquest) {
    	return userService.registerUser(resquest);
    }
    
    @GetMapping("/verifyEmail/{token}")
    public User verifyEmail(@PathVariable("token") String token) {
    	return userService.validateToken(token);
    }
    
    @PostMapping("/verifyEmail/resend")
    public ResponseEntity<?> resendVerification(@RequestBody ResendVerificationRequest req) {
        userService.resendVerificationToken(req.email());
        return ResponseEntity.ok(Map.of("message", "If the email exists, a verification code was sent."));
    }
}
