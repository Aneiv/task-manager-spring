package pl.edu.pk.demo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.pk.demo.exceptions.ResourceNotFoundException;
import pl.edu.pk.demo.exceptions.UnauthorizedException;
import pl.edu.pk.demo.model.Priority;
import pl.edu.pk.demo.model.TaskModel;
import pl.edu.pk.demo.model.entities.Category;
import pl.edu.pk.demo.model.entities.Status;
import pl.edu.pk.demo.model.entities.Task;
import pl.edu.pk.demo.model.entities.User;
import pl.edu.pk.demo.repository.*;
import pl.edu.pk.demo.service.SecurityService;
import pl.edu.pk.demo.service.TaskService;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {
    @Mock private SecurityService securityService;
    @Mock private TaskRepository taskRepository;
    @Mock private UserRepository userRepository;
    @Mock private StatusRepository statusRepository;
    @Mock private CategoryRepository categoryRepository;

    @InjectMocks private TaskService taskService;

    private TaskModel taskModel;
    private User user;
    private Status status;
    private Category category;
    private Task task;

    @BeforeEach
    void setUp() {
        // predefined data for tests
        taskModel = new TaskModel("Tytuł", "Opis", 1L, 2L, "HIGH", LocalDateTime.now().plusDays(1));
        user = new User();
        status = new Status();
        category = new Category();
        task = new Task().setId(1L).setTitle("Tytuł").setPriority(Priority.HIGH);
    }

    @Test
    void createTask_ShouldSuccess_WhenDataIsValid() {
        when(securityService.getCurrentUserId()).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(statusRepository.findById(1L)).thenReturn(Optional.of(status));
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(category));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        Task result = taskService.createTask(taskModel);

        assertNotNull(result);
        assertEquals("Tytuł", result.getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void deleteTask_ShouldThrowUnauthorizedException_WhenUserIsNotOwner() {
        Long taskId = 99L;
        when(securityService.getCurrentUserId()).thenReturn(1L);
        when(taskRepository.existsByIdAndUserId(taskId, 1L)).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> taskService.deleteTask(taskId));

        verify(taskRepository, never()).deleteById(anyLong());
    }

    @Test
    void deleteTask_ShouldSuccess_WhenUserIsOwner() {
        Long taskId = 1L;
        when(securityService.getCurrentUserId()).thenReturn(1L);
        when(taskRepository.existsByIdAndUserId(taskId, 1L)).thenReturn(true);

        assertDoesNotThrow(() -> taskService.deleteTask(taskId));

        verify(taskRepository, times(1)).deleteById(taskId);
    }

    @Test
    void updateTask_ShouldSuccess_WhenUserIsOwnerAndDataIsValid() {
        Long taskId = 1L;
        Long currentUserId = 1L;

        when(securityService.getCurrentUserId()).thenReturn(currentUserId);
        when(taskRepository.existsByIdAndUserId(taskId, currentUserId)).thenReturn(true);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(statusRepository.findById(taskModel.statusId())).thenReturn(Optional.of(status));
        when(categoryRepository.findById(taskModel.categoryId())).thenReturn(Optional.of(category));

        when(taskRepository.save(any(Task.class))).thenReturn(task);

        Task result = taskService.updateTask(taskModel, taskId);

        assertNotNull(result);
        verify(taskRepository, times(1)).save(any(Task.class));
        verify(taskRepository, times(1)).findById(taskId);
    }

    @Test
    void updateTask_ShouldThrowUnauthorizedException_WhenUserIsNotOwner() {
        Long taskId = 1L;
        Long currentUserId = 1L;

        when(securityService.getCurrentUserId()).thenReturn(currentUserId);
        when(taskRepository.existsByIdAndUserId(taskId, currentUserId)).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> taskService.updateTask(taskModel, taskId));

        verify(taskRepository, never()).findById(anyLong());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void updateTask_ShouldThrowResourceNotFoundException_WhenTaskDoesNotExistInDatabase() {
        Long taskId = 999L;
        Long currentUserId = 1L;

        when(securityService.getCurrentUserId()).thenReturn(currentUserId);
        when(taskRepository.existsByIdAndUserId(taskId, currentUserId)).thenReturn(true);
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.updateTask(taskModel, taskId));

        verify(taskRepository, never()).save(any(Task.class));
    }


    @Test
    void findAll_ShouldReturnListOfTasks_WhenTasksExistForUser() {
        Long currentUserId = 1L;
        List<Task> expectedTasks = List.of(task, new Task().setId(2L).setTitle("Drugie zadanie"));

        when(securityService.getCurrentUserId()).thenReturn(currentUserId);
        when(taskRepository.findAllByUserId(currentUserId)).thenReturn(expectedTasks);

        List<Task> result = taskService.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Tytuł", result.get(0).getTitle());
        assertEquals("Drugie zadanie", result.get(1).getTitle());
        verify(taskRepository, times(1)).findAllByUserId(currentUserId);
    }

    @Test
    void findAll_ShouldReturnEmptyList_WhenUserHasNoTasks() {
        Long currentUserId = 1L;
        when(securityService.getCurrentUserId()).thenReturn(currentUserId);
        when(taskRepository.findAllByUserId(currentUserId)).thenReturn(Collections.emptyList());

        List<Task> result = taskService.findAll();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(taskRepository, times(1)).findAllByUserId(currentUserId);
    }
}