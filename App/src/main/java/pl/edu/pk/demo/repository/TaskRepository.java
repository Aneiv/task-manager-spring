package pl.edu.pk.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.pk.demo.model.Task;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    //find all user tasks
    List<Task> findAllByUserId(Long userId);


}
