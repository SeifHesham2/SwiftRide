import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response Interceptor - Fixed to prevent duplicate toasts
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't show toast here - let components handle it
        // This prevents duplicate error messages

        let errorMessage = 'An unexpected error occurred';

        if (error.response) {
            const data = error.response.data;

            if (data && data.message) {
                errorMessage = data.message;
            } else if (typeof data === 'string' && data.length > 0) {
                errorMessage = data;
            } else {
                errorMessage = `HTTP Error ${error.response.status}`;
            }
        } else if (error.request) {
            errorMessage = 'No response from server. Please check your connection.';
        } else {
            errorMessage = error.message;
        }

        // Attach the formatted message to the error object
        error.message = errorMessage;

        return Promise.reject(error);
    }
);

export const customerAPI = {
    login: (data) => api.post('/customers/login', data),

    sendEmailToken: (email, firstName) =>
        api.post(`/customers/register/send-token?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}`),

    register: (data, token) =>
        api.post(`/customers/register?token=${encodeURIComponent(token)}`, data),

    sendAcceptanceEmail: (customerId, driverId, tripId) =>
        api.post(`/customers/trip/send-email?customerId=${customerId}&driverId=${driverId}&tripId=${tripId}`),

    updateProfile: (id, data) => api.patch(`/customers/update/${id}`, data),

    forgotPassword: (email) => api.post(`/customers/forgot-password?email=${encodeURIComponent(email)}`),
    resetPassword: (token, newPassword) => api.post(`/customers/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`),

    uploadPhoto: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/customers/upload-photo/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
};

export const driverAPI = {
    login: (data) => api.post('/drivers/login', data),
    updateProfile: (id, data) => api.patch(`/drivers/update/${id}`, data),
    getDriversWithoutCar: () => api.get('/drivers/without-car'),
    rateDriver: (driverId, rating, tripId) => api.post(`/drivers/rate/${driverId}?rating=${rating}&tripId=${tripId}`),

    uploadPhoto: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/drivers/upload-photo/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
};

export const employeeAPI = {
    login: (data) => api.post('/employees/login', data),
    register: (data) => api.post('/employees/register', data),
    registerDriver: (data) => api.post('/drivers/register', data),
};

export const tripAPI = {
    bookTrip: (customerId, tripData, paymentMethod) =>
        api.post(`/trips/book?customerId=${customerId}&paymentMethod=${paymentMethod}`, tripData),

    getCustomerTrips: (customerId) => api.get(`/trips/customer/trips/${customerId}`),
    getPreviousTrips: (customerId) => api.get(`/trips/customer/previous-trips?customerId=${customerId}`),

    getRequestedTrips: () => api.get('/trips/requested'),
    getActiveTrips: (driverId) => api.get(`/trips/driver/trips/active/${driverId}`),

    acceptTrip: (driverId, tripId) => api.post(`/trips/accept/${tripId}?driverId=${driverId}`),
    startTrip: (driverId, tripId) => api.post(`/trips/start/${tripId}?driverId=${driverId}`),
    endTrip: (driverId, tripId) => api.post(`/trips/end/${tripId}?driverId=${driverId}`),

    cancelByCustomer: (customerId, tripId) => api.post(`/trips/cancel/customer/${tripId}?customerId=${customerId}`),
    cancelByDriver: (driverId, tripId) => api.post(`/trips/cancel/driver/${tripId}?driverId=${driverId}`),
};

export const carAPI = {
    getAllCars: () => api.get('/cars'),
    getAvailableCars: () => api.get('/cars/available'),
    registerCar: (carData) => api.post('/cars/register', carData),
    assignCar: (carId, driverId) => api.post(`/cars/assign?carId=${carId}&driverId=${driverId}`),
    deleteCar: (carId) => api.delete(`/cars/${carId}`),
};

export const complaintAPI = {
    getByStatus: (status) => api.get(`/complaints/status/${status}`),
    sendComplaint: (customerId, tripId, message) =>
        api.post(`/complaints/send/complaint?customerId=${customerId}&tripId=${tripId}`, { message }),
    openComplaint: (id) => api.post(`/complaints/open/complaint/${id}`),
    closeComplaint: (id) => api.post(`/complaints/closed/complaint/${id}`),
};

export default api;
