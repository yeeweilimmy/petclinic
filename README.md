## Veterinary Clinic Management System
# Description
This is a web-based application to help veterinary clinics manage their daily operations.
The current application assumes that this is a single-veterinarian clinic.

---

# Implemented Features
- Appointment scheduling and management
- Pet profile management
- User authentication and profile management

# Planned Features (Not Yet Implemented)
- Medical record management
- Pet owner profile management
- Billing system for appointments and services
- Payment history

# Future Improvements
- Veterinarian profile to allow for management of multiple veterinarians
- Veterinarian schedule management system
- Vaccination and appointment reminder system

---

# Tech Stack
- Frontend: React, Axios, TailwindCSS, JavaScript
- Backend: Node.js
- Database: MongoDB
- Tools: Git (version control), GitHub, Jira (project tracking), draw.io (SysML diagrams), AWS EC2 instance

---

# Links to this Application
- Live Server: [http://13.211.167.97](http://13.211.167.97)
- Local Server: [http://localhost:3000](http://localhost:3000)

## Configuration / Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- MongoDB instance (local or cloud)
- Git

### Clone Repository
git clone https://github.com/yeeweilimmy/petclinic.git

### Backend Setup
- cd backend
- npm install
- cp .env.example .env
- .env file variables example:

PORT=5001
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
(Please find these copy pasted in the report, due to security reasons it is not included in this readme file)

## To start the backend server:
npm run dev   # development mode with nodemon
# or
npm run start # production mode

## Frontend Setup
- cd ../frontend
- npm install
- npm start
- Open http://localhost:3000 in your browser

# Default Test User (or register your own)
Username: vet@mail.com
Password: 123
