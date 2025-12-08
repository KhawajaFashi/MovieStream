# MERN Stack Assignment TODOs

**Deadline:** December 8, 2025

## 1. Project Setup & Architecture
- [x] **Extend Assignment 2:** Use your existing frontend and expand it into a full MERN (MongoDB, Express, React, Node) application.
- [x] **Backend Structure:** Implement an MVC (Model-View-Controller) or service-layer architecture.
- [x] **Environment Variables:** Use `dotenv` to manage sensitive configuration.
- [x] **Database:** Set up MongoDB with Mongoose for schema validation and relationships (e.g., users owning posts).



## 2. Authentication & Authorization
- [x] **Sign Up/Login:** Implement user registration and login using JWT (JSON Web Tokens).
- [x] **Security:** Hash passwords using `bcrypt`.
- [x] **Role Management:** Implement Role-Based Access Control (RBAC) specifically for **User** and **Admin** roles.
- [x] **Protection:** Create middleware to protect routes (verify JWT).

## 3. Core Features (CRUD & Logic)
- [ ] **Main Entity CRUD:** Implement Create, Read, Update, and Delete operations for your main entity (e.g., posts, products, tasks).
- [x] **Pagination:** Implement pagination (`?page=` and `?limit=`).
- [x] **Search and Filtering:** Implement search and filtering (`?search=` and `?sort=`).
- [ ] **Ownership Logic:** Ensure users can only edit or delete their *own* items.
- [x] **Dashboard:** Create a protected dashboard displaying data analytics (counts, charts, comparisons).
- [ ] **User Profile:** Allow users to update profiles and reset/change passwords.

## 4. API & Backend Implementation
- [x] **RESTful Standards:** Ensure all routes follow RESTful conventions with correct HTTP status codes.
- [ ] **Validation:** Implement input validation using libraries like Joi, validator.js, or custom logic.
- [ ] **Global Error Handling:** Create global error-handling middleware.
- [ ] **Async Error Wrapper:** Use an async error wrapper (`catchAsync`).
- [ ] **File Handling:** Implement image upload functionality.
- [ ] **Notifications:** Integrate email notifications.

## 5. Security Measures
- [x] **CORS:** Configure Cross-Origin Resource Sharing.
- [ ] **Sanitization:** Implement input sanitization to prevent NoSQL injection.
- [ ] **Rate Limiting:** Implement rate limiting to prevent brute-force attacks.

## 6. Testing & Deployment
- [ ] **Testing:** Write a unit test for at least one **POST** and one **PATCH** API route using Jest, Supertest, or Cypress.
- [ ] **Frontend Deployment:** Deploy your frontend to **Vercel** or **Netlify**.

## 7. Submission Guidelines
- [ ] **Format:** Submit a zipped folder containing your files.
- [ ] **Repository:** Include a link to your **public GitHub Repository**.
- [ ] **Strict Warning:** Do not use AI-generated code or plagiarize; you must be able to justify every part of your implementation.

## Bonus / Recommended Learning
- [ ] **Redis:** Explore implementing basic caching for an API route.
- [ ] **Docker:** Try containerizing the application (Frontend, Backend, Database).
