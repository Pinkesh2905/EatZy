# EatZy – Smart Food Delivery Ecosystem

EatZy is a next-generation food delivery platform built with the MEAN stack (MongoDB, Express, Angular, Node.js). 

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on `mongodb://localhost:27017`

---

### 1. Backend Setup (Express & MongoDB)
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. (Optional) Seed the database with initial data (Restaurants & Menus):
   ```bash
   node seed.js
   ```
3. Start the backend server:
   ```bash
   node app.js
   ```
   The server will run on `http://localhost:5000`.

---

### 2. Frontend Setup (Angular)
1. Open a **new** terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Start the Angular development server:
   ```bash
   npm start
   ```
3. Open your browser and visit:
   ```
   http://localhost:4200
   ```

---

## 🛠 Features Implemented (Phase 1)
- **User Authentication**: Register/Login with JWT.
- **Restaurant Discovery**: Browse restaurants and menus with nutrition facts.
- **Cart System**: Reactive cart using Angular Signals.
- **Order Placement**: Checkout flow and Order History.

## 📁 Project Structure
- `/server`: Node.js/Express backend, Mongoose models, and Auth logic.
- `/client`: Modern Angular 19 frontend with glassmorphism design.

---

**Happy Coding!** 🌮🍕
