package pl.edu.pk.demo.controller;


import io.swagger.v3.oas.models.responses.ApiResponse;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import pl.edu.pk.demo.model.Role;
import pl.edu.pk.demo.model.User;
import pl.edu.pk.demo.model.UserModel;
//import pl.edu.pk.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;
import pl.edu.pk.demo.repository.UserRepository;
import pl.edu.pk.demo.service.UserService;

import java.net.Authenticator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;
    public UserController(UserService userService){
        this.service = userService;
    }

    @GetMapping
    public List<User> getAll(){
        return service.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id){
        return service.getUser(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id, Authentication auth){
        boolean deleted = service.deleteUser(id, auth);
        if (deleted) {
            return ResponseEntity.status(HttpStatus.OK).body("User removed successfully");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
