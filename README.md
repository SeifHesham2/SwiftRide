# SwiftRide - Ride Sharing Application 🚗

A full-stack ride-sharing platform built with Spring Boot backend and React frontends, implementing enterprise-level design patterns and modern software architecture.

## 🎯 Project Overview

SwiftRide is a comprehensive ride-sharing system that manages customers, drivers, employees, trips, payments, and complaints. The application demonstrates professional software engineering practices with clean architecture, design patterns, and scalable solutions.

## 🏗️ Architecture & Design Patterns

### 1. **Decorator Pattern** - Dynamic Fare Calculation
Implemented for flexible trip pricing with add-on features:
- **BaseTripDecorator**: Core trip fare wrapper
- **PremiumTripDecorator**: Adds +$25 for premium service
- **ChildSeatTripDecorator**: Adds +$15 for child seat option

This allows dynamic fare calculation by stacking decorators on top of the base trip fare.

### 2. **Strategy Pattern** - Payment Processing
Multiple payment methods with unified interface:
- **CashPaymentStrategy**: Cash payment processing
- **CreditCardPaymentStrategy**: Credit card transactions
- **WalletPaymentStrategy**: Digital wallet payments

Each strategy implements `PaymentStrategy` interface for consistent payment handling.

### 3. **Factory Pattern** - Payment Method Selection
**PaymentFactory** dynamically selects the appropriate payment strategy based on payment type, with automatic dependency injection of all available strategies.

### 4. **DTO Pattern** - Data Transfer Objects
Clean separation between entities and API responses:
- **Mappers**: CarMapper, CustomerMapper, DriverMapper, TripMapper, PaymentMapper, ComplaintMapper, EmployeeMapper
- **DTOs**: Prevent over-exposure of entity data and provide API-specific views

### 5. **Repository Pattern** - Data Access Layer
DAO interfaces for each entity with JPA implementation:
- CarDAO, CustomerDAO, DriverDAO, TripDAO, PaymentDAO, ComplaintDAO, EmployeeDAO
- Clean abstraction over database operations

### 6. **Service Layer Pattern** - Business Logic
Separation of concerns with dedicated service classes:
- Business logic isolated from controllers
- Transactional management
- Reusable service methods

## 🚀 Core Features

### User Management
- **Three User Roles**: Customer, Driver, Employee
- **Profile Management**: Photo upload, personal information
- **Secure Authentication**: Role-based access control

### Trip Management
- **Trip Lifecycle**: Request → Pending → Accepted → Completed/Cancelled
- **Real-time Updates**: Trip status tracking
- **Driver Assignment**: Automatic driver matching
- **Location Services**: Pickup and destination management
- **Scheduled Trips**: Support for future trip scheduling

### Payment System
- **Multiple Payment Methods**: Cash, Credit Card, Wallet
- **Dynamic Fare Calculation**: Base fare + decorators (premium, child seat)
- **Payment Tracking**: Complete payment history
- **Flexible Pricing**: Extensible decorator pattern for new pricing features

### Complaint System
- **Customer Complaints**: Submit and track issues
- **Employee Management**: Review and resolve complaints
- **Status Tracking**: Pending → Resolved

### Messaging & Notifications
- **Email Notifications**: Trip confirmations and updates via SMTP
- **RabbitMQ Integration**: Asynchronous message processing
- **Event-Driven Architecture**: EmailEvent and EmailListener for decoupled communication

### File Management
- **Profile Photo Upload**: Image storage and retrieval
- **Static File Serving**: Uploaded files accessible via API

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.3.5** - Core framework
- **Java 17/21** - Programming language
- **MySQL** - Relational database
- **Spring Data JPA** - ORM and data access
- **Spring Security** - Authentication & authorization
- **RabbitMQ** - Message queue for async processing
- **Spring Mail** - Email notifications (SMTP)
- **Maven** - Build and dependency management

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Dark Mode** - Theme toggle support

## 📋 Prerequisites

- **Java 17 or 21**
- **MySQL Server**
- **RabbitMQ Server**
- **Node.js & npm**
- **Maven**

## 🏃 Running the Application

### Backend
```bash
./mvnw clean install
./mvnw spring-boot:run
```
Backend runs on: `http://localhost:8080`

### Customer/Driver Frontend
```bash
cd frontend
npm install
npm run dev
```

### Employee Portal
```bash
cd employee-portal
npm install
npm run dev
```

## 🏗️ Project Structure

```
SwiftRide/
├── src/main/java/com/luv2code/springboot/cruddemo/
│   ├── controllers/        # REST API endpoints
│   ├── service/            # Business logic layer
│   ├── dao/                # Data access layer
│   ├── entities/           # JPA entities
│   ├── dto/                # Data transfer objects
│   ├── mapper/             # Entity-DTO mappers
│   ├── decorator/          # Decorator pattern (fare calculation)
│   ├── strategy/           # Strategy pattern (payment methods)
│   ├── factories/          # Factory pattern (payment factory)
│   ├── messaging/          # RabbitMQ event handling
│   ├── exception/          # Custom exceptions
│   ├── handler/            # Global exception handler
│   ├── config/             # Spring configuration
│   └── util/               # Utility classes
├── frontend/               # Customer/Driver React app
├── employee-portal/        # Employee React app
├── sql-scripts/            # Database scripts
└── uploads/                # User uploaded files
```

## 🎨 Key Entities

- **UserBase**: Base class for Customer, Driver, Employee (inheritance)
- **Trip**: Ride information with status tracking
- **Car**: Vehicle details linked to drivers
- **Payment**: Payment records with method and status
- **Complaint**: Customer complaint management
- **Enums**: TripStatus, PaymentMethod, PaymentStatus, ComplaintStatus, Role

## 🔒 Security Features

- Spring Security configuration
- Role-based access control (Customer, Driver, Employee)
- Secure password handling
- CORS configuration for frontend integration

## 📧 Email Notifications

Automated email notifications for:
- Trip acceptance confirmation
- Trip status updates
- Driver assignment details

## 🎨 Frontend Features

- **Responsive Design**: Mobile-friendly interface
- **Dark Mode**: System-wide theme toggle
- **Real-time Updates**: Live trip status
- **Location Autocomplete**: Nominatim API integration
- **Profile Management**: Photo upload and user info
- **Toast Notifications**: User feedback system
- **Inline Validation**: Form error handling

---

**Frontend:** Vibe coding by Antigravity ✨
