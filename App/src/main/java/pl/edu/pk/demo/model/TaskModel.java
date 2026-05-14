package pl.edu.pk.demo.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record TaskModel(
        @NotBlank(message = "Title is required")
        @Size(max = 50)
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 500)
        String description,

        @NotNull(message = "Status is required")
        Long statusId,

        @NotNull(message = "Category is required")
        Long categoryId,

        @NotBlank(message = "Priority is required")
        String priority,

        @NotNull(message = "Due date is required")
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime dueDate
)

{
}
