package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entites.Car;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CarDAOImpl implements CarDAO {

    private final EntityManager entityManager;

    @Autowired
    public CarDAOImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<Car> findAll() {
        TypedQuery<Car> query = entityManager.createQuery("FROM Car", Car.class);
        return query.getResultList();
    }

    @Override
    public Car findById(long id) {
        return entityManager.find(Car.class, id);
    }

    @Override
    @Transactional
    public Car save(Car car) {
        return entityManager.merge(car);
    }

    @Override
    @Transactional
    public void deleteById(long id) {
        Car car = entityManager.find(Car.class, id);
        if (car != null) {
            entityManager.remove(car);
        }
    }

    @Override
    public List<Car> findAvailableCars() {
        TypedQuery<Car> query = entityManager.createQuery(
                "SELECT c FROM Car c WHERE c.driver IS NULL", Car.class);
        return query.getResultList();
    }

    @Override
    public Car findByDriverId(long driverId) {
        try {
            TypedQuery<Car> query = entityManager.createQuery(
                    "SELECT c FROM Car c WHERE c.driver.id = :driverId", Car.class);
            query.setParameter("driverId", driverId);
            return query.getSingleResult();
        } catch (RuntimeException e) {
            return null;
        }
    }

    @Override
    public Car findByLicensePlate(String licensePlate) {
        try {
            TypedQuery<Car> query = entityManager.createQuery(
                    "SELECT c FROM Car c WHERE c.licensePlate = :licensePlate", Car.class);
            query.setParameter("licensePlate", licensePlate);
            return query.getSingleResult();
        } catch (RuntimeException e) {
            return null;
        }
    }

}
