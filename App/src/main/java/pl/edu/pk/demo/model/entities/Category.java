package pl.edu.pk.demo.model.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY) // to not attach user data if unnecessary
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    public Category setName(String name) {
        this.name = name;
        return this;
    }
    public Category setUser(User user) {
        this.user = user;
        return this;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public User getUser() { return user; }
}
