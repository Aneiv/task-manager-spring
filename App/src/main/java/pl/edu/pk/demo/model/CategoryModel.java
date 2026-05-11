package pl.edu.pk.demo.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryModel(
        @NotBlank(message = "Category name is required")
        @Size(max = 50)
        String name
        )
{
}
