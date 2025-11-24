package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.util.EmailValidationTokenUtil;
import org.springframework.stereotype.Service;

@Service
public class EmailValidationServiceImpl implements EmailValidationService {

    private final EmailService emailService;

    public EmailValidationServiceImpl(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * إرسال توكن التحقق للمستخدم قبل التسجيل
     */
    @Override
    public boolean customerToken(String email, String firstName) {
        String token = EmailValidationTokenUtil.generateToken(email);
        String subject = "Email Verification - SwiftRide";
        String body = buildEmailBody(token, firstName);
        emailService.sendEmail(email, subject, body);
        System.out.println("hiii");
        return true;
    }
    @Override
    public String customerEmailValidation(String token) {
        String email = EmailValidationTokenUtil.validateToken(token);
        return  email;
    }

    private String buildEmailBody(String token, String name) {
        return new StringBuilder()
                .append("Hello ").append(name).append(",\n\n")
                .append("Welcome to SwiftRide! Please verify your email using the token below:\n\n")
                .append("Your Verification Token: ").append(token).append("\n\n")
                .append("This token will expire in 10 minutes.\n\n")
                .append("Thank you,\nThe SwiftRide Team")
                .toString();
    }
}
