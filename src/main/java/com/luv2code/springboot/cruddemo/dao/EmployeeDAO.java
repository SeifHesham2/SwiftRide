package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entites.Employee;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeDAO {
    public Employee findById(long Id);
    public Employee findByEmail(String email);
    public Employee findByPhoneNumber(String phoneNumber);
    public Employee save(Employee employee);
}
