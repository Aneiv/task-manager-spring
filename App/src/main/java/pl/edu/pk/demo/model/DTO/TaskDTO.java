package pl.edu.pk.demo.model.DTO;

import pl.edu.pk.demo.model.Priority;
import pl.edu.pk.demo.model.entities.Status;

import java.time.LocalDateTime;

public record TaskDTO(
        Long taskId,
        String title,
        String description,
        Status status,
        Priority priority,
        LocalDateTime createdDate,
        LocalDateTime dueDate,
        LocalDateTime updatedDate

        )
{
}
