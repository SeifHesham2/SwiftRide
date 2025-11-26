package com.luv2code.springboot.cruddemo.handler;

import com.luv2code.springboot.cruddemo.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {
        @ExceptionHandler(CustomerNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleNotFoundException(CustomerNotFoundException ex) {
                ErrorResponse error = new ErrorResponse(
                                HttpStatus.NOT_FOUND.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
                String errorMessage = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                                .findFirst()
                                .orElse("Validation error");

                ErrorResponse error = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                errorMessage,
                                LocalDateTime.now());

                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(EmailAlreadyExistsException.class)
        public ResponseEntity<ErrorResponse> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(PhoneNumberExistsException.class)
        public ResponseEntity<ErrorResponse> handlePhoneNumberExistsException(PhoneNumberExistsException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(InvalidEmailOrPasswordException.class)
        public ResponseEntity<ErrorResponse> HandleInvalidEmailOrPasswordException(InvalidEmailOrPasswordException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(DriverNotFoundException.class)
        public ResponseEntity<ErrorResponse> HandleDriverNotFoundException(DriverNotFoundException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(TripNotFoundException.class)
        public ResponseEntity<ErrorResponse> HandleTripNotFoundException(TripNotFoundException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(DriverNotAvailableException.class)
        public ResponseEntity<ErrorResponse> DriverNotAvailableException(DriverNotAvailableException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(LicenseNumberExistsException.class)
        public ResponseEntity<ErrorResponse> handleLicenseNumberExistsException(LicenseNumberExistsException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(StartBeforeScheduledTimeException.class)
        public ResponseEntity<ErrorResponse> handleStartBeforeScheduledTimeException(
                        StartBeforeScheduledTimeException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(OverlapsTripsException.class)
        public ResponseEntity<ErrorResponse> handleOverlapsTripsException(OverlapsTripsException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(GapBetweenTripsException.class)
        public ResponseEntity<ErrorResponse> handleGapBetweenTripsException(GapBetweenTripsException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(DriverBookedMoreThan3TripsException.class)
        public ResponseEntity<ErrorResponse> handleDriverBookedMoreThan3TripsException(
                        DriverBookedMoreThan3TripsException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(InvalidTripDateException.class)
        public ResponseEntity<ErrorResponse> handleInvalidTripDateException(InvalidTripDateException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(CarNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleCarNotFoundException(CarNotFoundException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(DriverHasCarException.class)
        public ResponseEntity<ErrorResponse> handleDriverHasCarException(DriverHasCarException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(CarHasDriverException.class)
        public ResponseEntity<ErrorResponse> handleCarHasDriverException(CarHasDriverException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(ComplaintNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleComplaintNotFoundExceptionException(ComplaintNotFoundException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(TokenIsExpiredOrWrongException.class)
        public ResponseEntity<ErrorResponse> handleTokenIsExpiredOrWrongException(TokenIsExpiredOrWrongException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(CustomerOrDriverNotAssigned.class)
        public ResponseEntity<ErrorResponse> handleCustomerOrDriverNotAssigned(CustomerOrDriverNotAssigned ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(PaymentMethodIsNotSupportedException.class)
        public ResponseEntity<ErrorResponse> handlePaymentMethodIsNotSupportedException(
                        PaymentMethodIsNotSupportedException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(PaymentNotFoundException.class)
        public ResponseEntity<ErrorResponse> handlePaymentNotFoundException(PaymentNotFoundException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(DriverIsAlreadyRated.class)
        public ResponseEntity<ErrorResponse> handleDriverIsAlreadyRated(DriverIsAlreadyRated ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(CarLicensePlateExistsException.class)
        public ResponseEntity<ErrorResponse> handleCarLicensePlateExistsException(CarLicensePlateExistsException ex) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.CONFLICT.value(),
                                ex.getMessage(),
                                LocalDateTime.now());
                return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }

}
