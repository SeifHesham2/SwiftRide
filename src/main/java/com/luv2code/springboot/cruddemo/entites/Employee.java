package com.luv2code.springboot.cruddemo.entites;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "employees")
@AttributeOverride(name = "id" ,column = @Column(name = "employee_id"))
public class Employee extends UserBase{


}
