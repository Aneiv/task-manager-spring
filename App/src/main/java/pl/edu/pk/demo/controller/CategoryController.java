package pl.edu.pk.demo.controller;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pk.demo.exceptions.ResourceNotFoundException;
import pl.edu.pk.demo.model.entities.Category;
import pl.edu.pk.demo.model.CategoryModel;
import pl.edu.pk.demo.model.DTO.CategoryDTO;
import pl.edu.pk.demo.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    //create
    @PostMapping
    public ResponseEntity<String> createCategory(@RequestBody @Valid CategoryModel categoryModel) {
        Category newCategory = categoryService.createCategory(categoryModel);
        return ResponseEntity.status(HttpStatus.CREATED).body("Category created");
    }
    //get
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CategoryDTO>> getCategoriesByUserId(@PathVariable Long userId) {
        List<Category> categories = categoryService.findAllByUserId(userId);
        if(categories.isEmpty()){
            throw new ResourceNotFoundException("No categories found");
        }

        List<CategoryDTO> response = categories.stream()
                .map(cat-> new CategoryDTO(cat.getId(), cat.getName()))
                .toList();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    //edit
    @PutMapping("/{id}")
    public ResponseEntity<String> updateCategory(
            @PathVariable Long id,
            @RequestBody @Valid CategoryModel categoryModel) {

        Category updated = categoryService.updateCategory(id, categoryModel.name());
        return ResponseEntity.status(HttpStatus.OK).body("Category updated");
    }

    //delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.status(HttpStatus.OK).body("Content removed");
    }
}
