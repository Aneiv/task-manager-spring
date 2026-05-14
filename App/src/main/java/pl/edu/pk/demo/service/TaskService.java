package pl.edu.pk.demo.service;

import org.springframework.stereotype.Service;
import pl.edu.pk.demo.exceptions.ResourceNotFoundException;
import pl.edu.pk.demo.exceptions.UnauthorizedException;
import pl.edu.pk.demo.model.Priority;
import pl.edu.pk.demo.model.TaskModel;
import pl.edu.pk.demo.model.entities.Category;
import pl.edu.pk.demo.model.entities.Status;
import pl.edu.pk.demo.model.entities.Task;
import pl.edu.pk.demo.model.entities.User;
import pl.edu.pk.demo.repository.StatusRepository;
import pl.edu.pk.demo.repository.TaskRepository;
import pl.edu.pk.demo.repository.UserRepository;

import java.util.List;

@Service
public class TaskService {

    private final SecurityService securityService;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final StatusRepository statusRepository;

    public TaskService(SecurityService securityService, TaskRepository taskRepository, UserRepository userRepository, StatusRepository statusRepository) {
        this.securityService = securityService;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.statusRepository = statusRepository;
    }



    public Task createTask(TaskModel taskModel){
        //get user
        Long userId = securityService.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Status status = statusRepository.findById(taskModel.statusId())
                .orElseThrow(() -> new RuntimeException("Status not found"));


        Task task = new Task()
                .setUser(user)
                .setTitle(taskModel.title())
                .setDesc(taskModel.description())
                .setStatus(status)
                .setPriority(Priority.valueOf(taskModel.priority().toUpperCase()))
                .setDueDate(taskModel.dueDate());

        return taskRepository.save(task);
    }
    public List<Task> findAll(){
        return taskRepository.findAllByUserId(securityService.getCurrentUserId());
    }
    //update
    public Task updateTask(TaskModel taskModel, Long taskId) {
        //check ownership
        if (!taskRepository.existsByIdAndUserId(taskId, securityService.getCurrentUserId())) {
            throw new UnauthorizedException("You do not have permission to access this resource");
        }
        //find by id
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task does not exist"));

        //get status data
        Status status = statusRepository.findById(taskModel.statusId())
                .orElseThrow(() -> new RuntimeException("Status not found"));

        //change data
        task.setTitle(taskModel.title());
        task.setDesc(taskModel.description());
        task.setStatus(status); //
        task.setPriority(Priority.valueOf(taskModel.priority().toUpperCase()));
        task.setDueDate(taskModel.dueDate());

        //update
        return taskRepository.save(task);
    }

    //delete
    public void deleteTask(Long id) {
        //check ownership
        if(!taskRepository.existsByIdAndUserId(id,securityService.getCurrentUserId())){
            throw new UnauthorizedException("You do not have permission to access this resource");
        }
        taskRepository.deleteById(id);
    }
}
