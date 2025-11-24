package com.luv2code.springboot.cruddemo.service;

import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    public void sendEmail(String to, String subject, String text);
}
