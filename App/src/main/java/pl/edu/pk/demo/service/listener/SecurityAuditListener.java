package pl.edu.pk.demo.service.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import pl.edu.pk.demo.service.events.LoginFailedEvent;

@Component
public class SecurityAuditListener {
    private static final Logger logger = LoggerFactory.getLogger("security-events");

    @EventListener
    public void handleLoginFailed(LoginFailedEvent event){
        logger.warn("AUDIT ALERT: Failed login attempt for account: '{}'. Reason: {}",
        event.username(), event.errorMessage());
    }
}
