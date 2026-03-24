package pl.edu.pk.demo.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pl.edu.pk.demo.model.Role;
import pl.edu.pk.demo.model.User;
import pl.edu.pk.demo.model.UserModel;
import pl.edu.pk.demo.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passEncoder){
        this.repository = userRepository;
        this.passwordEncoder = passEncoder;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers(){
        return repository.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public Optional<User> getUser(Long id) {
        return repository.findById(id);
    }

    /**
     * Method to delete users from database <br>
     * Uses {@link #deleteIfOwner} to check if user performing operation is owner <br>
     * Uses {@link #deleteAuthorized} when user performing operation is detected as admin
     * @param id id of user that is about to be deleted
     * @param auth authentication of user performing operation
     * @return
     * true if user was deleted with success <br>
     * false if user was not deleted
     */
    public boolean deleteUser(Long id, Authentication auth){
        String username = auth.getName();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + Role.ADMIN.name()));

        if (isAdmin) {
            return deleteAuthorized(id);
        } else {
            return deleteIfOwner(id, username);
        }
    }


    /// Method used for user to delete own account only
    public boolean deleteIfOwner(Long id, String username){
        Optional<User> userOpt = repository.findById(id);
        if(userOpt.isEmpty()) return false; // user not found

        User user = userOpt.get();

        if(!user.getUsername().equals(username)){
            return false; //not owner
        }

        repository.delete(user);
        return true;
    }

    /// Method used by ADMIN users to remove users
    public boolean deleteAuthorized(Long id){
        Optional<User> userOpt = repository.findById(id);
        if(userOpt.isEmpty()) return false;
        User user = userOpt.get();

        repository.delete(user);
        return true;
    }

    /**
     * Creates and add to database new User
     * @param userModel - DTO user model
     * @return saved user model to database
     */
    public User createUser(UserModel userModel){
        User user = new User();
        user.setFirstName(userModel.firstName());
        user.setLastName(userModel.lastName());
        user.setEmail(userModel.email());
        user.setUsername(userModel.username());
        user.setPassword(passwordEncoder.encode(userModel.password()));//password hashing

        return repository.save(user);
    }

}
