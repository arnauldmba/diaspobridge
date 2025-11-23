package com.diasporabridge.backend.entities.login;

import jakarta.validation.constraints.*;

public record RegisterDto(
  @Email @NotBlank String email,
  @NotBlank @Size(min=6,max=100) String password,
  @NotBlank String role,
  String firstName, String lastName, String phone
) {}
