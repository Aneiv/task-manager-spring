package pl.edu.pk.demo.model.entities;

import jakarta.persistence.*;
import pl.edu.pk.demo.model.Priority;

import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "description", nullable = true, length = 255)
    private String desc;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id", nullable = false)
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    // updates timestamp
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }
    public User getUser() {
        return user;
    }

    public Task setUser(User user) {
        this.user = user;
        return this;
    }

    public String getTitle() {
        return title;
    }

    public Task setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getDesc() {
        return desc;
    }

    public Task setDesc(String desc) {
        this.desc = desc;
        return this;
    }

    public Status getStatus() {
        return status;
    }

    public Task setStatus(Status status) {
        this.status = status;
        return this;
    }

    public Priority getPriority() {
        return priority;
    }

    public Task setPriority(Priority priority) {
        this.priority = priority;
        return this;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public LocalDateTime getCreatedDate() {
        return createdAt;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedAt;
    }
    public Task setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
        return this;
    }

}
