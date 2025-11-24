package com.luv2code.springboot.cruddemo.mapper;

import com.luv2code.springboot.cruddemo.dto.CustomerDTO;
import com.luv2code.springboot.cruddemo.dto.EmployeeDTO;
import com.luv2code.springboot.cruddemo.entites.Customer;
import com.luv2code.springboot.cruddemo.entites.Employee;

public class EmployeeMapper {
    public static EmployeeDTO toDTO(Employee employee){
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        return dto;
    }
}
