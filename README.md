# Expense Tracker

A full stack expense tracking application built with React and Spring Boot.

## Tech Stack
- **Frontend:** React 18, React Router, Axios
- **Backend:** Spring Boot 3.2, Spring Security, JWT
- **Database:** MySQL with JPA/Hibernate

## Features
- User registration and login with JWT authentication
- Add, view and delete expenses
- Filter expenses by category (Food, Travel, Bills, Entertainment, Other)
- Monthly summary with category breakdown

## Setup

### Backend
1. Create a MySQL database: `CREATE DATABASE expense_tracker;`
2. Copy `application.properties.example` to `application.properties`
3. Update your MySQL credentials
4. Run `ExpenseTrackerApplication.java`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get JWT token |
| GET | /api/expenses | Get all expenses |
| POST | /api/expenses | Add expense |
| DELETE | /api/expenses/{id} | Delete expense |
| GET | /api/expenses/category/{cat} | Filter by category |
| GET | /api/expenses/summary | Monthly summary |
