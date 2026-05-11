package pl.edu.pk.demo.service;

import org.springframework.stereotype.Service;
import pl.edu.pk.demo.exceptions.AlreadyExistsException;
import pl.edu.pk.demo.exceptions.ResourceNotFoundException;
import pl.edu.pk.demo.exceptions.UnauthorizedException;
import pl.edu.pk.demo.model.entities.Category;
import pl.edu.pk.demo.model.CategoryModel;
import pl.edu.pk.demo.model.entities.User;
import pl.edu.pk.demo.repository.CategoryRepository;
import pl.edu.pk.demo.repository.UserRepository;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final SecurityService securityService;

    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository, SecurityService securityService) {
        this.categoryRepository = categoryRepository; this.userRepository = userRepository; this.securityService = securityService;
    }

    //create
    public Category createCategory(CategoryModel model) {
        if (model.name() == null || model.name().isBlank()) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }

        //get user
        Long userId = securityService.getCurrentUserId();
        User user = userRepository.getReferenceById(userId);

        Category category = new Category()
                .setName(model.name())
                .setUser(user);

        //check if category exists by name
        if (categoryRepository.existsByNameAndUserId(model.name(), userId)) {
            throw new AlreadyExistsException("Category already exists");
        }

        return categoryRepository.save(category);
    }

    //update
    public Category updateCategory(Long id, String newName) {
        //check ownership
        if (!categoryRepository.existsByIdAndUserId(id, securityService.getCurrentUserId())) {
            throw new UnauthorizedException("You do not have permission to access this resource");
        }
        //find by id
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category does not exist"));
        if (newName == null || newName.isBlank()) {
                    throw new IllegalArgumentException("Category name cannot be empty");
        }
        //change data
        category.setName(newName);

        //update
        return categoryRepository.save(category);
    }

    //delete
    public void deleteCategory(Long id) {
        //check ownership
        if(!categoryRepository.existsByIdAndUserId(id,securityService.getCurrentUserId())){
            throw new UnauthorizedException("You do not have permission to access this resource");
        }
        categoryRepository.deleteById(id);
    }

    public List<Category> findAllByUserId(Long userId) {
        return categoryRepository.findAllByUserId(userId);
    }
}