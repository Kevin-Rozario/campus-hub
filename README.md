# Campus Hub

Campus Hub is a modern, full-featured campus management system designed to streamline academic and administrative processes for students, faculty, and administrators. Built with a robust backend using Node.js, Express, TypeScript, and Prisma ORM, it provides secure, scalable APIs for managing users, courses, enrollments, attendance, announcements, events, and results.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Models](#database-models)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [API Structure](#api-structure)
- [Security](#security)
- [Contribution](#contribution)
- [License](#license)

---

## Features
- **User Authentication & Authorization**: Secure registration, login, JWT-based sessions, and role-based access control (Student, Faculty, Admin).
- **API Key Support**: Generate and validate API keys for secure API access.
- **Course Management**: Create, view, and manage courses and course materials.
- **Enrollment Management**: Enroll students in courses, view enrollments by student or course.
- **Attendance Tracking**: Faculty can record and view attendance; students and admins can view attendance records.
- **Announcements**: Faculty and admins can post announcements; all users can view them.
- **Event Management**: Organize and view campus events, filterable by user role.
- **Results Management**: Admins can upload results; students and faculty can view results.
- **Admin Controls**: Manage users, change roles, and oversee all campus data.

---

## Tech Stack
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL (managed via Prisma ORM)
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens), API Keys
- **Validation**: Zod
- **Environment Management**: dotenv
- **Password Hashing**: bcrypt
- **Other Tools**: tsx, ts-node, Prettier, Faker (for seeding)

---

## Database Models
The system uses a relational schema managed by Prisma. Key models include:

- **User**: Students, Faculty, Admins (with roles, email, password, etc.)
- **ApiKey**: For secure API access
- **Announcement**: Title, body, posted by, timestamps
- **Course**: Name, code, description, credits, created by
- **Material**: Linked to courses, uploaded by faculty
- **Result**: Linked to students and courses, includes grades
- **Enrollment**: Student-course relationships
- **Attendance**: Records for each student per course per date
- **Event**: Campus events, roles, organizer, schedule

See [`prisma/schema.prisma`](prisma/schema.prisma) for full details.

---

## Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database

### 1. Clone the Repository
```bash
git clone <repo-url>
cd campus-hub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d
NODE_ENV=development
PORT=3000
```

### 4. Run Database Migrations & Seed Data
```bash
npm run migrate-dev
npm run seed
```

### 5. Start the Development Server
```bash
npm start
```

---

## Usage
- The API will be available at `http://localhost:3000/api/v1/`
- Use tools like Postman or Insomnia to interact with the endpoints.
- Authentication is required for most endpoints (JWT in cookies, API key in headers).

---

## API Structure

### Main Endpoints
- `/auth` – Register, login, logout, profile, API key
- `/announcements` – CRUD for announcements
- `/attendances` – Record and view attendance
- `/courses` – Manage courses and materials
- `/enrollments` – Manage enrollments
- `/events` – Manage and view events
- `/results` – Upload and view results
- `/admin` – User management (admin only)

### Example: Register a User
```http
POST /api/v1/auth/register
Content-Type: application/json
{
  "email": "student@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "Student"
}
```

### Example: Protected Route
- Pass JWT tokens in cookies after login
- Pass API key in `x-api-key` header for certain endpoints

---

## Security
- **JWT Authentication**: Access and refresh tokens for session management
- **API Key Validation**: For sensitive/protected endpoints
- **Role-Based Access Control**: Permissions enforced for each route
- **Input Validation**: All input validated with Zod schemas
- **Password Hashing**: bcrypt
- **Error Handling**: Consistent API error and response structure

---

## Contribution
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.