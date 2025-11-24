package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entites.Customer;
import com.luv2code.springboot.cruddemo.entites.Driver;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DriverDAOImpl implements DriverDAO{
    private  final EntityManager entityManager;
@Autowired
    public DriverDAOImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Driver findFirstAvailableDriver() {
            return entityManager.createQuery(
                    "SELECT d FROM Driver d WHERE d.available = true", Driver.class)
                    .setMaxResults(1).getSingleResult();
    }

    @Override
    public Driver save(Driver driver) {
        return  entityManager.merge(driver);
    }

    @Override
    public Driver findByEmail(String email) {
        TypedQuery<Driver> typedQuery = entityManager.createQuery("SELECT d FROM Driver d WHERE d.email = :email ", Driver.class);
        typedQuery.setParameter("email", email);
        List<Driver> results = typedQuery.getResultList();
        return results.isEmpty() ? null : results.get(0);
    }

    @Override
    public Driver findByPhoneNumber(String phone) {
        TypedQuery<Driver> typedQuery = entityManager.createQuery("SELECT d FROM Driver d WHERE d.phone = :phone ", Driver.class);
        typedQuery.setParameter("phone", phone);
        List<Driver> results = typedQuery.getResultList();
        return results.isEmpty() ? null : results.get(0);
    }

    @Override
    public Driver update(Driver driver) {
       return  entityManager.merge(driver);
    }

    @Override
    public Driver findById(long id) {
       return entityManager.find(Driver.class,id);
    }

    @Override
    public Driver findByLicenseNumber(String licenseNumber) {
        TypedQuery<Driver> typedQuery = entityManager.createQuery("SELECT d FROM Driver d WHERE d.licenseNumber = :licenseNumber ", Driver.class);
        typedQuery.setParameter("licenseNumber", licenseNumber);
        List<Driver> results = typedQuery.getResultList();
        return results.isEmpty() ? null : results.get(0);
    }
    @Transactional
    @Override
    public List<Driver> findDriversWithoutCar() {
        String jpql = """
                SELECT d FROM Driver d 
                WHERE d.id NOT IN (
                    SELECT c.driver.id FROM Car c WHERE c.driver IS NOT NULL
                )
                """;
        TypedQuery<Driver> query = entityManager.createQuery(jpql, Driver.class);
        return query.getResultList();
    }
}
