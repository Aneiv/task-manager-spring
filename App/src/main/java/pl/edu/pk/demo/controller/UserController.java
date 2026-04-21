package pl.edu.pk.demo.controller;


import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import pl.edu.pk.demo.exceptions.ResourceNotFoundException;
import pl.edu.pk.demo.model.User;
//import pl.edu.pk.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import pl.edu.pk.demo.service.UserService;

import java.util.List;


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
        User user = service.getUser(id)
                .orElseThrow(()-> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(user);
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
