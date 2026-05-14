package pl.edu.pk.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.pk.demo.model.DTO.TaskDTO;
import pl.edu.pk.demo.model.Priority;
import pl.edu.pk.demo.model.entities.Status;
import pl.edu.pk.demo.service.StatusService;
import pl.edu.pk.demo.service.TaskService;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/status")
public class StatusController {
    private final StatusService statusService;

    public StatusController(StatusService statusService) {
        this.statusService = statusService;
    }

    @GetMapping
    public ResponseEntity<List<Status>> getStatuses() {
        return ResponseEntity.status(HttpStatus.OK).body(statusService.getAll());
    }
}
