package pl.edu.pk.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.sql.DataSource;
import java.sql.*;

@SpringBootApplication
public class DemoApplication {
    @Autowired
    private DataSource dataSource;

    public void testConnection() {
        try (Connection conn = dataSource.getConnection()) {
            System.out.println("Connected!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        var context = SpringApplication.run(DemoApplication.class, args);
        DemoApplication app = context.getBean(DemoApplication.class);

        app.testConnection();
    }

}
