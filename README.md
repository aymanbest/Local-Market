# Spring React E-Commerce Platform

A modern e-commerce platform built with React and Spring Boot, featuring a responsive UI with Tailwind CSS.

## 🚀 Features

- **User Authentication**: Secure login, registration, and password recovery
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add products, manage quantities, and checkout
- **Order Processing**: Complete payment flow with success confirmation
- **User Profiles**: Account management and order history
- **Seller Dashboard**: For merchants to manage their products
- **Admin Panel**: Comprehensive admin controls
- **Real-time Notifications**: Using WebSockets
- **Responsive Design**: Works on desktop and mobile devices
- **Theme Support**: Light and dark mode

## 🛠️ Tech Stack

### Frontend
- **React**: UI library
- **Redux Toolkit**: State management with persistence
- **React Router**: Navigation and routing
- **Tailwind CSS**: Styling and UI components
- **Flowbite React**: UI component library
- **Framer Motion**: Animations
- **Chart.js/Recharts/ApexCharts**: Data visualization
- **Axios**: API requests
- **WebSockets**: Real-time communication

### Backend
- **Spring Boot**: Java-based backend framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database access
- **PostgreSQL/MySQL**: Database (based on configuration)
- **RESTful API**: Communication between frontend and backend

## 📋 Prerequisites

- Node.js (v16+)
- npm or yarn
- Java 17+
- Maven or Gradle
- PostgreSQL/MySQL database

## 🚀 Getting Started

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ProjectSpringreact.git
   cd ProjectSpringreact/Frontend
   ```

2. Configure environment variables:
   ```bash
   # Clone the environment example file
   cp .env.example .env
   
   # Edit the .env file with your configuration
   # VITE_API_URL=http://localhost:8080 (default)
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The application will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```

2. Configure your database settings:
   ```bash
   # Clone the environment example file
   cp .env.example .env
   
   # Edit the .env file with your database credentials
   # Replace the values with your actual configuration.
   ```

3. Build and run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   or
   ```bash
   mvn spring-boot:run
   ```

4. The API will be available at `http://localhost:8080`

## 🧪 Testing

```bash
# Run backend tests
mvn test
```

## 🚢 Deployment

### Frontend
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Backend
```bash
mvn package
```

The JAR file will be created in the `target/` directory.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- [kaouthar zhani](https://github.com/katycase)

## 🙏 Acknowledgments

- All the open-source libraries used in this project

