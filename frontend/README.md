# MiniUber Frontend

Modern, production-ready React frontend for MiniUber ride-hailing application.

## 🚀 Features

- **Beautiful UI**: Modern design with Tailwind CSS and Framer Motion animations
- **Customer Dashboard**: Book trips, track active rides, view history
- **Driver Dashboard**: Accept trips, manage active rides, track earnings
- **Authentication**: Secure login/register for customers and drivers
- **Responsive**: Works perfectly on all devices
- **Real-time Updates**: Live trip status updates
- **Arabic Support**: Full RTL support

## 🛠️ Tech Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router v6
- Axios
- React Hot Toast

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Usage

1. **Start the backend**: Make sure your Spring Boot backend is running on `http://localhost:8080`

2. **Start the frontend**:
```bash
npm run dev
```

3. **Open browser**: Navigate to `http://localhost:5173`

## 📱 Pages

- `/` - Landing page
- `/login` - Login (Customer/Driver)
- `/register` - Registration
- `/customer/dashboard` - Customer dashboard
- `/driver/dashboard` - Driver dashboard

## 🎨 Design Features

- Glassmorphism effects
- Gradient backgrounds
- Smooth animations
- Hover effects
- Loading states
- Toast notifications
- Responsive grid layouts

## 🔐 Authentication

The app uses localStorage to store user data. Protected routes automatically redirect to login if not authenticated.

## 📝 Environment

Update the API base URL in `src/services/api.js` if your backend runs on a different port:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 🚀 Production Build

```bash
npm run build
```

The build will be in the `dist` folder, ready to deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## 📄 License

Educational project - MiniUber

---

**Built with ❤️ using React + Vite**
