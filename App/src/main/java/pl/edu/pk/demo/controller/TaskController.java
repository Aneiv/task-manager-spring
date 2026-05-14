package pl.edu.pk.demo.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pk.demo.exceptions.ResourceNotFoundException;
import pl.edu.pk.demo.model.CategoryModel;
import pl.edu.pk.demo.model.DTO.CategoryDTO;
import pl.edu.pk.demo.model.DTO.TaskDTO;
import pl.edu.pk.demo.model.TaskModel;
import pl.edu.pk.demo.model.entities.Category;
import pl.edu.pk.demo.model.entities.Task;
import pl.edu.pk.demo.service.CategoryService;
import pl.edu.pk.demo.service.TaskService;

import java.util.List;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
        private final TaskService taskService;

        public TaskController(TaskService taskService){this.taskService = taskService;}

        //create
        @PostMapping
        public ResponseEntity<String> createTask(@RequestBody @Valid TaskModel taskModel) {
            Task task = taskService.createTask(taskModel);
            System.out.println(task);
            return ResponseEntity.status(HttpStatus.CREATED).body("Task created");
        }
        //get
        @GetMapping
        public ResponseEntity<List<TaskDTO>> getTasks(){
            List<Task> tasks = taskService.findAll();
            if(tasks.isEmpty()){
                throw new ResourceNotFoundException("No tasks found");
            }
            // task return model dto
            List<TaskDTO> response = tasks.stream()
                    .map(task -> {
                        CategoryDTO categoryDTO = null;
                        if (task.getCategory() != null) {
                            categoryDTO = new CategoryDTO(
                                    task.getCategory().getId(),
                                    task.getCategory().getName()
                            );
                        }

                        return new TaskDTO(
                                task.getId(),
                                task.getTitle(),
                                task.getDesc(),
                                task.getStatus(),
                                task.getPriority(),
                                categoryDTO,
                                task.getCreatedDate(),
                                task.getDueDate(),
                                task.getUpdatedDate()
                        );
                    })
                    .toList();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }
        //edit
        @PutMapping("/{id}")
        public ResponseEntity<String> updateTask(
                @PathVariable Long id,
                @RequestBody @Valid TaskModel taskModel) {

            Task updated = taskService.updateTask(taskModel, id);
            return ResponseEntity.status(HttpStatus.OK).body("Task updated");
        }

    //delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.status(HttpStatus.OK).body("Content removed");
    }

}
