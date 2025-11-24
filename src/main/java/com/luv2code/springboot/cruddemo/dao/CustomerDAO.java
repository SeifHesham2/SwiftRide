package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entites.Customer;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerDAO {
    public Customer findByPhoneNumber(String phoneNumber);
    public Customer findByEmail(String email);
    public Customer save(Customer customer);
    public Customer findById(long customerId);
    public void deleteById(long customerId);
    public List<Customer> findAll();
    public Customer updateCustomer(Customer customer);
}
