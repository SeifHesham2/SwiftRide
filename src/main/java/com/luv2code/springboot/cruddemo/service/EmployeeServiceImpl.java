package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.dao.EmployeeDAO;
import com.luv2code.springboot.cruddemo.entites.Customer;
import com.luv2code.springboot.cruddemo.entites.Driver;
import com.luv2code.springboot.cruddemo.entites.Employee;
import com.luv2code.springboot.cruddemo.exception.EmailAlreadyExistsException;
import com.luv2code.springboot.cruddemo.exception.InvalidEmailOrPasswordException;
import com.luv2code.springboot.cruddemo.exception.PhoneNumberExistsException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class EmployeeServiceImpl implements EmployeeService{
    private  final  EmployeeDAO employeeDAO;
    private final BCryptPasswordEncoder passwordEncoder;


    @Autowired
    public EmployeeServiceImpl(EmployeeDAO employeeDAO, BCryptPasswordEncoder passwordEncoder) {
        this.employeeDAO = employeeDAO;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public Employee register(Employee employee) {
        Employee existingMail = employeeDAO.findByEmail(employee.getEmail());
        if (existingMail != null) {
            throw new EmailAlreadyExistsException("Email already registered: " + employee.getEmail());
        }
        Employee existingPhoneNumber = employeeDAO.findByPhoneNumber(employee.getPhone());
        if (existingPhoneNumber != null) {
            throw new PhoneNumberExistsException("Phone number already registered: " + employee.getPhone());
        }
        String encodedPassword = passwordEncoder.encode(employee.getPassword());
        employee.setPassword(encodedPassword);

        return employeeDAO.save(employee);
    }
    @Override
    @Transactional
    public Employee login(String email, String password) {
        Employee employee= employeeDAO.findByEmail(email);
        if(employee==null) throw new InvalidEmailOrPasswordException("the email or password you entered is not correct");
        boolean passwordMatches = checkPassword(password, employee.getPassword());
        if(!passwordMatches) throw new InvalidEmailOrPasswordException("the email or password you entered is not correct");
        return employee;
    }

    @Override
    public boolean checkPassword(String enteredPassword, String password) {
        boolean matches = false;
        matches = passwordEncoder.matches(enteredPassword,password);
        return matches;
    }
}
