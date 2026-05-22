package pl.edu.pk.demo.service.events;

public record LoginFailedEvent(String username, String errorMessage) {}