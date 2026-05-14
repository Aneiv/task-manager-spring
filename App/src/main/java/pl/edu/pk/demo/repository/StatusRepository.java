package pl.edu.pk.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.pk.demo.model.entities.Status;


public interface StatusRepository extends JpaRepository<Status, Long> {

}
