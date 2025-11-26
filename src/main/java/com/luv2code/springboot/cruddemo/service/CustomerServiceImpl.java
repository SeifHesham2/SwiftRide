package com.luv2code.springboot.cruddemo.service;

import com.luv2code.springboot.cruddemo.dao.CustomerDAO;
import com.luv2code.springboot.cruddemo.entites.Car;
import com.luv2code.springboot.cruddemo.entites.Customer;
import com.luv2code.springboot.cruddemo.entites.Driver;
import com.luv2code.springboot.cruddemo.entites.Trip;
import com.luv2code.springboot.cruddemo.exception.*;
import com.luv2code.springboot.cruddemo.messaging.EmailEvent;
import com.luv2code.springboot.cruddemo.util.EmailValidationTokenUtil;
import com.luv2code.springboot.cruddemo.util.PasswordResetTokenUtil;
import jakarta.transaction.Transactional;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerDAO customerDAO;
    private final BCryptPasswordEncoder passwordEncoder;
    private final ForgetPasswordServiceImpl forgetPasswordService;
    private final EmailValidationService emailValidationService;
    private final DriverService driverService;
    private final EmailService emailService;
    private final TripService tripService;
    private final CarService carService;
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public CustomerServiceImpl(CustomerDAO customerDAO, BCryptPasswordEncoder passwordEncoder,
            @Lazy ForgetPasswordServiceImpl forgetPasswordService, EmailValidationService emailValidationService,
            DriverService driverService, EmailService emailService, @Lazy TripService tripService,
            CarService carService, RabbitTemplate rabbitTemplate) {
        this.customerDAO = customerDAO;
        this.passwordEncoder = passwordEncoder;
        this.forgetPasswordService = forgetPasswordService;
        this.emailValidationService = emailValidationService;
        this.driverService = driverService;
        this.emailService = emailService;
        this.tripService = tripService;
        this.carService = carService;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public boolean checkPassword(String enteredPassword, String emailPassword) {
        boolean matches = false;
        matches = passwordEncoder.matches(enteredPassword, emailPassword);
        return matches;
    }

    @Override
    public Customer findByEmail(String email) {
        Customer customer = customerDAO.findByEmail(email);
        if (customer == null) {
            throw new CustomerNotFoundException("the customer is not found");
        }
        return customer;
    }

    @Override
    public Customer findById(long customerId) {
        Customer customer = customerDAO.findById(customerId);
        if (customer == null) {
            throw new CustomerNotFoundException("The Customer is not found -- " + customerId);
        }
        return customer;
    }

    @Transactional
    @Override
    public void deleteById(long customerId) {
        Customer customer = customerDAO.findById(customerId);
        if (customer == null) {
            throw new CustomerNotFoundException("The Customer is not found -- " + customerId);
        }
        customerDAO.deleteById(customerId);
    }

    @Transactional
    @Override
    public Customer partialUpdate(Long id, Customer newData) {
        Customer existing = findById(id);

        if (newData.getFirstName() != null)
            existing.setFirstName(newData.getFirstName());

        if (newData.getLastName() != null)
            existing.setLastName(newData.getLastName());

        if (newData.getPhone() != null) {
            Customer foundByPhone = customerDAO.findByPhoneNumber(newData.getPhone());
            if (foundByPhone != null) {
                throw new PhoneNumberExistsException("Phone number already registered: " + newData.getPhone());
            }
            existing.setPhone(newData.getPhone());
        }

        if (newData.getPassword() != null)
            existing.setPassword(passwordEncoder.encode(newData.getPassword()));

        Customer customer = customerDAO.save(existing);
        return customer;
    }

    @Override
    public List<Customer> findAll() {
        return customerDAO.findAll();
    }

    @Transactional
    @Override
    public Customer updateCustomer(Customer customer) {
        return customerDAO.updateCustomer(customer);
    }

    @Override
    @Transactional
    public Customer register(Customer customer, String token) {
        Customer existingMail = customerDAO.findByEmail(customer.getEmail());
        if (existingMail != null) {
            throw new EmailAlreadyExistsException("Email already registered: " + customer.getEmail());
        }
        Customer existingPhoneNumber = customerDAO.findByPhoneNumber(customer.getPhone());
        if (existingPhoneNumber != null) {
            throw new PhoneNumberExistsException("Phone number already registered: " + customer.getPhone());
        }
        String encodedPassword = passwordEncoder.encode(customer.getPassword());
        customer.setPassword(encodedPassword);
        String email = emailValidationService.customerEmailValidation(token);
        if (email == null)
            throw new TokenIsExpiredOrWrongException("Expired or wrong token");
        return customerDAO.save(customer);
    }

    @Transactional
    @Override
    public Customer login(String email, String password) {
        Customer customer = customerDAO.findByEmail(email);
        if (customer == null)
            throw new InvalidEmailOrPasswordException("the email or password you entered is not correct");
        boolean passwordMatches = checkPassword(password, customer.getPassword());
        if (!passwordMatches)
            throw new InvalidEmailOrPasswordException("the email or password you entered is not correct");
        return customer;
    }

    @Transactional
    @Override
    public String resetPassword(String token, String newPassword) {
        String email = PasswordResetTokenUtil.validateToken(token);
        if (email == null)
            return "Invalid or expired token";
        Customer customer = findByEmail(email);
        if (customer == null)
            throw new CustomerNotFoundException("Customer is not found");
        customer.setPassword(passwordEncoder.encode(newPassword));
        customerDAO.save(customer);
        return "Password reset successful";
    }

    @Override
    public String forgotPassword(String email) {
        forgetPasswordService.forgotPassword(email);
        return "Reset  token sent to your email!";

    }

    @Override
    public boolean sendEmailToken(String email, String firstName) {
        Customer customer = customerDAO.findByEmail(email);
        if (customer != null)
            throw new EmailAlreadyExistsException("Email is already exists");
        return emailValidationService.customerToken(email, firstName);
    }

    @Override
    public void sendDriverAcceptanceEmail(long driverId, long customerId, long tripId) {
        Driver driver = driverService.findById(driverId);
        if (driver == null)
            throw new DriverNotFoundException("Driver is not found");
        Customer customer = customerDAO.findById(customerId);
        if (customer == null)
            throw new CustomerNotFoundException("Customer is not found");
        Trip trip = tripService.findById(tripId);
        if (trip == null)
            throw new TripNotFoundException("Trips is not found");
        Car car = carService.findByDriverId(driverId);
        if (car == null)
            throw new CarNotFoundException("Car is not found");

        // Check if driver is assigned to the trip
        if (trip.getDriver() == null)
            throw new CustomerOrDriverNotAssigned("Driver is not assigned to this trip yet");

        // Validate that the correct driver and customer are assigned
        if (trip.getDriver().getId() != driverId || trip.getCustomer().getId() != customerId)
            throw new CustomerOrDriverNotAssigned("Customer or driver are not assigned to this trip");

        String emailBody = buildEmailBody(driver, customer, trip, car);
        rabbitTemplate.convertAndSend("emailQueue",
                new EmailEvent(customer.getEmail(), "Your Ride Has Been Accepted!", emailBody));

    }

    private String buildEmailBody(Driver driver, Customer customer, Trip trip, Car car) {
        return new StringBuilder()
                .append("Hello ").append(customer.getFirstName()).append(",\n\n")
                .append("Good news! Your ride request has been accepted by a driver.\n\n")
                .append("Driver Details:\n")
                .append("Name: ").append(driver.getFirstName()).append(" ").append(driver.getLastName()).append("\n")
                .append("Phone: ").append(driver.getPhone()).append("\n")
                .append("Car: ").append(car.getModel()).append(" - ").append(car.getLicensePlate()).append("\n\n")
                .append("Trip Details:\n")
                .append("Pickup: ").append(trip.getPickupLocation()).append("\n")
                .append("Destination: ").append(trip.getDestination()).append("\n")
                .append("Estimated Fare: ").append(trip.getFare()).append(" EGP\n\n")
                .append("Please contact your driver if needed.\n")
                .append("Thank you for choosing SwiftRide!\n\n")
                .append("Best regards,\n")
                .append("SwiftRide Team")
                .toString();
    }

    @Transactional
    @Override
    public Customer uploadPhoto(long customerId, String imageUrl) {
        Customer customer = findById(customerId);
        customer.setImageUrl(imageUrl);
        return customerDAO.save(customer);
    }
}
