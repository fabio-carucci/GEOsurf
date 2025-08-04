# GEOsurf - Surf School Finder Platform

GEOsurf is a full-stack web application designed to help users discover surf schools worldwide through geolocation-based search. This project was developed as the Capstone Project for the Epicode Web Development course.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Geolocation Search](#geolocation-search)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [License](#license)

## Overview

GEOsurf connects surf enthusiasts with surf schools around the world. Users can search for schools based on location, save favorites, write reviews, and access detailed information about each school. Surf schools can create profiles, showcase their services, and be discovered by potential students.

## Features

### For Users
- **Geolocation-based Search**: Find surf schools within a specified radius of any location
- **User Authentication**: Register and login via email or Google OAuth
- **Favorites System**: Save preferred surf schools to a favorites list
- **Review System**: Write and read reviews for surf schools
- **User Profiles**: Manage personal information and preferences

### For Surf Schools
- **Business Profiles**: Create and manage detailed business profiles
- **Service Listings**: Showcase available services with icons and descriptions
- **Location Management**: Register with precise geolocation for better discoverability
- **Media Management**: Upload logo and cover images
- **Review Management**: View and respond to user reviews

### General Features
- **Interactive Map**: Visualize the global distribution of surf schools
- **News Section**: Stay updated with the latest surfing news
- **Responsive Design**: Optimized for all devices
- **Multi-language Support**: Interface available in multiple languages

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with geospatial indexing
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Passport.js**: Authentication middleware with Google OAuth support
- **Multer**: File upload handling
- **Nodemailer**: Email functionality
- **Bcrypt**: Password hashing

### Frontend
- **React.js**: JavaScript library for building user interfaces
- **React Router**: Navigation and routing
- **React Bootstrap**: UI component library
- **React Icons**: Icon components
- **Nivo**: Data visualization components for maps
- **React Multi Carousel**: Carousel component
- **React Rating Stars**: Star rating component
- **React Select**: Enhanced select inputs
- **OpenStreetMap/Nominatim**: Geocoding services

## Project Structure

The project is organized into two main directories:

### Backend
- **controllers/**: Business logic for handling requests
- **models/**: MongoDB schemas (Company, User, Review, News, Address)
- **routes/**: API endpoint definitions
- **middlewares/**: Authentication, error handling, file uploads
- **server.js**: Main application entry point

### Frontend
- **components/**: Reusable UI components
- **views/**: Page components
- **context/**: React context for state management
- **assets/**: Static files (images, icons)

## API Endpoints

### Authentication
- `POST /auth/login`: User login
- `POST /auth/signup`: User registration
- `POST /auth/company/login`: Company login
- `POST /auth/company/signup`: Company registration
- `GET /auth/google`: Google OAuth authentication

### Companies
- `GET /searchCompanies`: Search companies by geolocation
- `POST /companies`: Get all companies
- `GET /companyProfile/:id`: Get company by ID
- `GET /countCompanies`: Get company count by country

### Protected Company Routes
- `GET /company/myProfile`: Get current company profile
- `PUT /company/updateCompany`: Update company information
- `DELETE /company/deleteCompany`: Delete company account
- `PATCH /company/updateCompanyLogo`: Update company logo
- `PATCH /company/updateCompanyCover`: Update company cover image
- `PUT /company/changeCompanyPW`: Change company password
- `PATCH /company/updateCompanyServices`: Update company services

### Users
- `GET /user/myProfile`: Get current user profile
- `PUT /user/updateUser`: Update user information
- `DELETE /user/deleteUser`: Delete user account
- `PATCH /user/updateUserAvatar`: Update user avatar
- `PUT /user/changeUserPW`: Change user password
- `PATCH /user/toggleFavorite`: Add/remove company from favorites

### Reviews
- `POST /reviews`: Create a new review
- `GET /reviews/:companyId`: Get reviews for a company
- `PUT /reviews/:reviewId`: Update a review
- `DELETE /reviews/:reviewId`: Delete a review

### News
- `GET /news`: Get all news
- `POST /news/create`: Create a news article (admin only)
- `PUT /news/:id`: Update a news article
- `DELETE /news/:id`: Delete a news article

## Authentication

GEOsurf implements a dual authentication system:

1. **JWT-based Authentication**: For email/password login
2. **OAuth 2.0**: For Google authentication

Authentication tokens are required for protected routes and are verified through middleware.

## Geolocation Search

The core feature of GEOsurf is its geolocation-based search:

1. User inputs a location
2. The application geocodes the address using OpenStreetMap's Nominatim API
3. The coordinates are sent to the backend
4. MongoDB's geospatial queries find surf schools within the specified radius
5. Results are returned sorted by distance

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the Backend directory:
   ```
   cd Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5002
   DB_URL=mongodb://localhost:27017/geosurf
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5002/auth/google/callback
   EMAIL_USER=your_email
   EMAIL_PASSWORD=your_email_password
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the Frontend directory:
   ```
   cd Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with:
   ```
   REACT_APP_API_URL=http://localhost:5002
   ```

4. Start the development server:
   ```
   npm start
   ```

## Deployment

The application is deployed with:
- Backend: Render
- Frontend: Vercel
- Database: MongoDB Atlas

## License

This project is licensed under the ISC License.

---

Created by Fabio Carucci as the Capstone Project for Epicode Web Development Course.