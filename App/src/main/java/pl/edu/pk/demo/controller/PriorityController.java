package pl.edu.pk.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.pk.demo.model.Priority;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/priority")
public class PriorityController {
    @GetMapping
    public List<Map<String, String>> getPrioritiesFormatted() {
        return Stream.of(Priority.values())
                .map(p -> Map.of(
                        "value", p.name(),
                        "label", p.name().substring(0, 1) + p.name().substring(1).toLowerCase()
                ))
                .toList();
    }
}
