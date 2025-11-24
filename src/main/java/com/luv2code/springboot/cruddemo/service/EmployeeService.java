package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.dao.EmployeeDAO;
import com.luv2code.springboot.cruddemo.entites.Customer;
import com.luv2code.springboot.cruddemo.entites.Employee;
import org.springframework.stereotype.Service;

@Service
public interface EmployeeService {
    public Employee register(Employee employee);
    public Employee login(String email , String password);
    public boolean checkPassword(String enteredPassword, String password);

}
