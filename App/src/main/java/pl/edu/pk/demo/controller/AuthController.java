package pl.edu.pk.demo.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import pl.edu.pk.demo.model.User;
import pl.edu.pk.demo.model.UserModel;
import pl.edu.pk.demo.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
public class AuthController {
    private final UserService service;

    public AuthController(UserService userService){
        this.service = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid UserModel userModel){
        service.createUser(userModel);
        return ResponseEntity.status(201).body("User created");
    }
}
