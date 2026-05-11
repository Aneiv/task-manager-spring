package pl.edu.pk.demo.model;

import java.util.ArrayList;
import java.util.List;

public class CategoryResponse {
    private List<String> names = new ArrayList<>();

    public CategoryResponse addName(String n){
        this.names.add(n);
        return this;
    }
    public List<String> getNames() {
        return names;
    }
}
