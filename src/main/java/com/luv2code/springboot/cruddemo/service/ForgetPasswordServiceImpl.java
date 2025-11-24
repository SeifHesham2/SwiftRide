package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.entites.Customer;
import com.luv2code.springboot.cruddemo.exception.CustomerNotFoundException;
import com.luv2code.springboot.cruddemo.util.PasswordResetTokenUtil;
import org.springframework.stereotype.Service;

@Service
public class ForgetPasswordServiceImpl implements ForgetPasswordService {

    private final CustomerService customerService;
    private final EmailService emailService;

    public ForgetPasswordServiceImpl(CustomerService customerService, EmailService emailService) {
        this.customerService = customerService;
        this.emailService = emailService;
    }

    @Override
    public void forgotPassword(String email) {
        Customer customer = customerService.findByEmail(email);
        if (customer == null) {
            throw new CustomerNotFoundException("Email not found: " + email);
        }
        String token = PasswordResetTokenUtil.generateToken(email);
        String subject = "SwiftRide Password Reset Request";
        String body = buildEmailBody(token,customer.getFirstName());
        emailService.sendEmail(customer.getEmail(), subject, body);
    }

    private String buildEmailBody(String token, String name) {
        return new StringBuilder()
                .append( name +" you have requested a password reset.\n\n")
                .append("Please go back to the SwiftRide application and enter the following token in the 'Token' field:\n\n")
                .append("Your Token: ").append(token).append("\n\n")
                .append("This token will expire in 10 minutes.")
                .toString();
    }
}
