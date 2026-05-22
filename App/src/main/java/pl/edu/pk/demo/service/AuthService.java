package pl.edu.pk.demo.service;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pl.edu.pk.demo.exceptions.UserAlreadyExistsException;
import pl.edu.pk.demo.model.LoginModel;
import pl.edu.pk.demo.model.RegisterModel;
import pl.edu.pk.demo.model.entities.User;
import pl.edu.pk.demo.repository.UserRepository;
import pl.edu.pk.demo.service.events.LoginFailedEvent;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final BCryptPasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;

    public AuthService(UserRepository repo, AuthenticationManager authManager, BCryptPasswordEncoder passwordEncoder, ApplicationEventPublisher eventPublisher){
        this.userRepository = repo;
        this.authenticationManager = authManager;
        this.passwordEncoder = passwordEncoder;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Creates and add to database new User
     * @param input - DTO user model
     * @return saved user model to database
     */
    public User signUp(RegisterModel input){
        //check if user exists
        if (userRepository.existsByUsername(input.username())) {
            throw new UserAlreadyExistsException("User '" + input.username() + "' exists already.");
        }

        // check if email is unique
        if (userRepository.existsByEmail(input.email())) {
            throw new UserAlreadyExistsException("Email '" + input.email() + "' is assigned already.");
        }
        User user = new User()
                .setFirstName(input.firstName())
                .setLastName(input.lastName())
                .setUsername(input.username())
                .setEmail(input.email())
                .setPassword(passwordEncoder.encode(input.password()));


        return userRepository.save(user);
    }

    public User authenticate(LoginModel input){
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            input.username(),
                            input.password()
                    )
            );
        }catch (AuthenticationException e){
            eventPublisher.publishEvent(new LoginFailedEvent(input.username(), e.getMessage()));
            throw e;
        }
        return userRepository.findByUsername(input.username())
                .orElseThrow();
    }

}
