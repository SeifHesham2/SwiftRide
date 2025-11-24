package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entites.Customer;
import com.luv2code.springboot.cruddemo.entites.Employee;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EmployeeDAOImpl implements EmployeeDAO{
    final  private  EntityManager entityManager;

    public EmployeeDAOImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
@Transactional
    @Override
    public Employee findById(long id) {
        return entityManager.find(Employee.class,id);
    }
@Transactional
    @Override
    public Employee findByEmail(String email) {
        TypedQuery<Employee> typedQuery = entityManager.createQuery(
                "SELECT e FROM Employee e WHERE email = :email ",
                 Employee.class);
        typedQuery.setParameter("email",email);
        List<Employee> results = typedQuery.getResultList();
        return results.isEmpty() ? null : results.get(0);
    }
@Transactional
    @Override
    public Employee findByPhoneNumber(String phoneNumber) {
        TypedQuery<Employee> query = entityManager.createQuery(
                "FROM Employee Where phone = :phone" , Employee.class
        );
        query.setParameter("phone",phoneNumber);
        List<Employee> results=query.getResultList();
        return  results.isEmpty() ? null : results.get(0);
    }
  @Transactional
    @Override
    public Employee save(Employee employee) {
        return entityManager.merge(employee);
    }
}
