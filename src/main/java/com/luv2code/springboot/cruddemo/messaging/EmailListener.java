package com.luv2code.springboot.cruddemo.messaging;

import com.luv2code.springboot.cruddemo.service.EmailService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailListener {

   private final EmailService emailService;
     @Autowired
    public EmailListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @RabbitListener(queues = "emailQueue")
    public void handleEmailEvent(EmailEvent event) {
        emailService.sendEmail(event.getTo(), event.getSubject(), event.getBody());
    }
}
