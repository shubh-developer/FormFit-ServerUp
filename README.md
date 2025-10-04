# Massage Home Service

A comprehensive massage booking and management system built with Next.js, TypeScript, and PostgreSQL.

## Features

- **Client Booking System**: Easy-to-use booking form for massage services
- **Admin Dashboard**: Complete management interface for bookings, inquiries, and feedback
- **Client Authentication**: Secure login system for clients to view their booking history
- **Admin Authentication**: Static credentials for admin access
- **Real-time Notifications**: WhatsApp and email notifications
- **Responsive Design**: Mobile-friendly interface

## Authentication System

### Client Login
- **Access**: Use the "My Profile" link in the navigation
- **Credentials**: 
  - Email: Use the same email you used when booking
  - Phone: Use the same phone number you used when booking
- **Features**: View booking history, profile information, and session details

### Admin Login
- **Access**: Use the "Admin" link in the navigation
- **Credentials**: 
  - Username: `admin` (or set via `ADMIN_USERNAME` environment variable)
  - Password: `admin123` (or set via `ADMIN_PASSWORD` environment variable)
- **Features**: Manage bookings, inquiries, feedback, and view analytics

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd massage-home-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   # Update database credentials in .env.local
   ```

5. **Run the development server**
```bash
npm run dev
   ```

6. **Access the application**
   - Client Portal: http://localhost:3000/login
   - Admin Portal: http://localhost:3000/admin/login

## Environment Variables

Key environment variables for authentication:

```env
# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# JWT Secret (Change in production!)
JWT_SECRET=your_super_secret_jwt_key_change_in_production_min_32_chars
```

## Security Features

- **Rate Limiting**: Prevents brute force attacks on login endpoints
- **JWT Tokens**: Secure session management
- **Input Validation**: Comprehensive form validation using Zod
- **SQL Injection Protection**: Parameterized queries
- **Security Logging**: All authentication attempts are logged

## API Endpoints

### Client Authentication
- `POST /api/auth/login` - Client login with email and phone
- `GET /api/auth/profile` - Get client profile and booking history
- `POST /api/auth/logout` - Client logout

### Admin Authentication
- `POST /api/admin/login` - Admin login with static credentials
- `GET /api/admin/verify` - Verify admin token

## Database Schema

The system uses PostgreSQL with the following key tables:
- `users` - Client user accounts
- `bookings` - Massage session bookings
- `admin_sessions` - Admin login sessions
- `feedback` - Client feedback and reviews

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
