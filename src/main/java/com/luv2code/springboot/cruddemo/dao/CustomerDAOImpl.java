package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entites.Customer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CustomerDAOImpl implements CustomerDAO {

    private final EntityManager entityManager;

    @Autowired
    public CustomerDAOImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Customer findByPhoneNumber(String phoneNumber) {
        TypedQuery<Customer> query = entityManager.createQuery(
                "FROM Customer Where phone = :phone" , Customer.class
        );
        query.setParameter("phone",phoneNumber);
        List<Customer> results=query.getResultList();
        return  results.isEmpty() ? null : results.get(0);
    }

    @Override
    public Customer findByEmail(String email) {
        TypedQuery<Customer> query = entityManager.createQuery(
                "FROM Customer WHERE email = :email", Customer.class);
        query.setParameter("email", email);

        List<Customer> results = query.getResultList();
        return results.isEmpty() ? null : results.get(0);
    }

    @Override
    public Customer save(Customer customer) {
        return entityManager.merge(customer);

    }

    @Override
    public Customer findById(long customerId) {
        return entityManager.find(Customer.class, customerId);
    }

    @Override
    public List<Customer> findAll() {
        TypedQuery<Customer> query = entityManager.createQuery("SELECT c FROM Customer c", Customer.class);
        return query.getResultList();
    }

    @Transactional
    @Override
    public Customer updateCustomer(Customer customer) {
       Customer managed =  entityManager.merge(customer);
        entityManager.flush();
        return managed;
    }

    @Transactional
    @Override
    public void deleteById(long customerId) {
        Customer customer = findById(customerId);
        entityManager.remove(customer);

    }
}
