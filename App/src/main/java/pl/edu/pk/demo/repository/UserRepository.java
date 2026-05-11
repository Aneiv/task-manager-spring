package pl.edu.pk.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pk.demo.model.entities.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    //find user by username
    Optional<User> findByUsername(String username);

    <S extends User> S save(S entity);

    //find user by email
    Optional<User> findByEmail(String email);

    //Check if user with certain username exists
    boolean existsByUsername(String username);

    //Check if user with certain email exists
    boolean existsByEmail(String email);
}
