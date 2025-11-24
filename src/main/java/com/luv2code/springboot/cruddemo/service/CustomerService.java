package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.entites.Customer;
import com.luv2code.springboot.cruddemo.entites.Driver;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CustomerService {
    public boolean checkPassword(String enteredPassword , String emailPassword);
    public Customer findByEmail(String email);
    public Customer findById(long customerId);
    public void deleteById(long customerId);
    public  Customer partialUpdate (Long id , Customer newData);
    public List<Customer> findAll();
    public Customer updateCustomer(Customer customer);
    public Customer register(Customer customer ,String token);
    public Customer login(String email , String password);
    public String resetPassword(String token ,String newPassword);
    public String forgotPassword(String email);
    public boolean sendEmailToken(String email, String firstName);
    public void sendDriverAcceptanceEmail(long driverId , long customerId,long tripId);


}
