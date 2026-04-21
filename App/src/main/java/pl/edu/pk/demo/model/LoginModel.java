package pl.edu.pk.demo.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginModel(

        @NotBlank(message = "Username is required")
        @Size(max = 100)
        String username,

        @NotBlank(message = "Password is required")
        @Size(min = 6, max = 255)
        String password
) {

    @Override
    public String username() {
        return username;
    }

    @Override
    public String password() {
        return password;
    }
}
