package com.luv2code.springboot.cruddemo.controllers;

import com.luv2code.springboot.cruddemo.dto.CustomerDTO;
import com.luv2code.springboot.cruddemo.entites.Customer;
import com.luv2code.springboot.cruddemo.mapper.CustomerMapper;
import com.luv2code.springboot.cruddemo.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    CustomerService customerService;
    @Autowired
    public CustomerController(CustomerService customerService) {

        this.customerService = customerService;
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody Customer newCustomer , @RequestParam String token ) {
        Customer customer = customerService.register(newCustomer,token);
        CustomerDTO toDTO = CustomerMapper.toDTO(customer);
        return new ResponseEntity<>(toDTO, HttpStatus.CREATED);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Customer loginCustomer) {
       Customer customer =  customerService.login(loginCustomer.getEmail(),loginCustomer.getPassword());
       CustomerDTO customerDTO = CustomerMapper.toDTO(customer);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }
    @PatchMapping("update/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody Customer updateData) {
        Customer updated = customerService.partialUpdate(id, updateData);
        CustomerDTO toDTO = CustomerMapper.toDTO(updated);
        return  new ResponseEntity<>( toDTO , HttpStatus.OK);

    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        String message = customerService.forgotPassword(email);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        String message = customerService.resetPassword(token, newPassword);
        return ResponseEntity.ok(message);
    }
    @PostMapping("/register/send-token")
    public ResponseEntity<String> sendVerificationToken(@RequestParam String email, @RequestParam String firstName) {
        boolean isVaild = customerService.sendEmailToken(email, firstName);
        System.out.println("hello");
        if(!isVaild) ResponseEntity.badRequest();
        return ResponseEntity.ok("Verification token sent to your email.");
    }
    @PostMapping("/trip/send-email")
    public ResponseEntity<String> sendAcceptanceEmail(@RequestParam long customerId, @RequestParam long driverId , @RequestParam long tripId) {
        customerService.sendDriverAcceptanceEmail(driverId,customerId,tripId);
        return ResponseEntity.ok("Acceptance sent to your email.");
    }



}



