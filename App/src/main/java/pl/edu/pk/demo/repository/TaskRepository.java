package pl.edu.pk.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.pk.demo.model.entities.Task;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    //find all user tasks
    List<Task> findAllByUserId(Long userId);
    //checks if exists and is owned by that user
    boolean existsByIdAndUserId(Long id, Long userId);


}
