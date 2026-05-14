package pl.edu.pk.demo.service;

import org.springframework.stereotype.Service;
import pl.edu.pk.demo.model.entities.Status;
import pl.edu.pk.demo.model.entities.Task;
import pl.edu.pk.demo.repository.StatusRepository;

import java.util.List;

@Service
public class StatusService {
    private final StatusRepository statusRepository;

    public StatusService(StatusRepository statusRepository) {
        this.statusRepository = statusRepository;
    }

    public List<Status> getAll(){
        return statusRepository.findAll();
    }

}
