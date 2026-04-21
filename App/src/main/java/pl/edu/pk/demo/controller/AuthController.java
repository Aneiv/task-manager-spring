package pl.edu.pk.demo.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pk.demo.model.LoginModel;
import pl.edu.pk.demo.model.LoginResponse;
import pl.edu.pk.demo.model.RegisterModel;
import pl.edu.pk.demo.model.User;
import pl.edu.pk.demo.service.AuthService;
import pl.edu.pk.demo.service.JwtService;

@RestController
@RequestMapping("api/auth")
public class AuthController {
    private final AuthService service;
    private final JwtService jwtService;

    public AuthController(AuthService userService, JwtService jwt){
        this.service = userService;
        this.jwtService = jwt;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterModel userModel){
        service.signUp(userModel);
        return ResponseEntity.status(201).body("User created");
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginModel loginUserDto) {
        User authenticatedUser = service.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse().setToken(jwtToken).setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }
}
