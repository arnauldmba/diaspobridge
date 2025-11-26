package com.diasporabridge.backend.entities.login;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginDto(@Email @NotBlank String email, @NotBlank String password) {}
