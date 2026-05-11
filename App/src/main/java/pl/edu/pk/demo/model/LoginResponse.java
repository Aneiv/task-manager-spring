package pl.edu.pk.demo.model;

public class LoginResponse {
    private String token;

    private long expiresIn;

    public String getToken() {
        return token;
    }
    public LoginResponse setToken(String tok){
        this.token = tok;
        return this;
    }
    public LoginResponse setExpiresIn(long expire){
        this.expiresIn = expire;
        return this;
    }
}