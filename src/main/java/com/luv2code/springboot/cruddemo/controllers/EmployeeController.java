package com.luv2code.springboot.cruddemo.controllers;

import com.luv2code.springboot.cruddemo.dto.EmployeeDTO;
import com.luv2code.springboot.cruddemo.entites.Employee;
import com.luv2code.springboot.cruddemo.mapper.EmployeeMapper;
import com.luv2code.springboot.cruddemo.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private  final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }
    @PostMapping("/register")
   public ResponseEntity<?> register(@Valid @RequestBody Employee employee){
      Employee registerdEmployee =  employeeService.register(employee);
        EmployeeDTO dto = EmployeeMapper.toDTO(registerdEmployee);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Employee employee){
        Employee loginedEmployee =  employeeService.login(employee.getEmail(), employee.getPassword());
        EmployeeDTO dto = EmployeeMapper.toDTO(loginedEmployee);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }
}
