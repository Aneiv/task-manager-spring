package pl.edu.pk.demo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.pk.demo.exceptions.UnauthorizedException;
import pl.edu.pk.demo.model.entities.Category;
import pl.edu.pk.demo.model.CategoryModel;
import pl.edu.pk.demo.model.entities.User;
import pl.edu.pk.demo.repository.CategoryRepository;
import pl.edu.pk.demo.service.CategoryService;
import pl.edu.pk.demo.service.SecurityService;

import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
//@SpringBootTest
@ExtendWith(MockitoExtension.class)
class DemoApplicationTests {

    @Mock
    private CategoryRepository catRepo;

    @Mock
    private SecurityService securityService;

    @InjectMocks
    private CategoryService catSer;

	@Test
	void shouldReturnCategoriesWhenExists() {
        // Given
        Long userId = 1L;
        User user = new User();
        user.setId(userId);

        List<Category> mockOutput = List.of(
                new Category().setName("Praca").setUser(user),
                new Category().setName("Zakupy").setUser(user)
        );

        //mock repository behaviour
        when(catRepo.findAllByUserId(userId)).thenReturn(mockOutput);

        // When
        List<Category> result = catSer.findAllByUserId(userId);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Praca", result.get(0).getName());
        assertEquals("Zakupy", result.get(1).getName());

        //check if was invoked once
        verify(catRepo, times(1)).findAllByUserId(userId);
	}
	@Test
	void shouldThrowExceptionWhenCategoryValidationFails() {
        // Given
        String name = ""; //blank name
        CategoryModel category = new CategoryModel(name);

        // When
        assertThrows(IllegalArgumentException.class, () -> {
           catSer.createCategory(category);
        });

        // Then
        verify(catRepo, never()).save(any()); //check if save was never invoked
	}

    @Test
	void shouldDeleteCategoryWhenExists() {
        // Given
        Long categoryId = 1L;
        Long userId = 100L;
        when(securityService.getCurrentUserId()).thenReturn(userId);
        when(catRepo.existsByIdAndUserId(categoryId,userId)).thenReturn(true);
        // When
        catSer.deleteCategory(categoryId);

        // Then
        verify(catRepo, times(1)).deleteById(categoryId);
    }
    @Test
	void shouldThrowExceptionWhenDeletingNonExistentCategory() {
        // Given
        Long categoryId = 99L;
        Long userId = 100L;

        when(securityService.getCurrentUserId()).thenReturn(userId);
        when(catRepo.existsByIdAndUserId(categoryId, userId)).thenReturn(false);
        // When
        assertThrows(UnauthorizedException.class, () -> {
           catSer.deleteCategory(categoryId);
        });

        // Then
        verify(catRepo, never()).deleteById(anyLong()); //check if deleteById was never invoked
    }

}
