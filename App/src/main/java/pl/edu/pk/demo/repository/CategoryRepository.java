package pl.edu.pk.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.pk.demo.model.Category;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    //find all user categories
    List<Category> findAllByUserId(Long userId);
    boolean existsByNameAndUserId(String name, Long userId);
    //checks if exists and is owned by that user
    boolean existsByIdAndUserId(Long id, Long userId);

}
