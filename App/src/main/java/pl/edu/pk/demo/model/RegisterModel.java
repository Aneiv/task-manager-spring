package pl.edu.pk.demo.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterModel(
    @NotBlank(message = "First name is required")
    @Size(max = 100)
    String firstName,

    @NotBlank(message = "Last name is required")
    @Size(max = 100)
    String lastName,

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 150)
    String email,

    @NotBlank(message = "Username is required")
    @Size(max = 100)
    String username,

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 255)
    String password
) {}