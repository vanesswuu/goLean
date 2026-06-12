# goLean

> **Empowering the Fitness Journey through Clean Engineering.**
> A production-ready, full-stack fitness and cardio ecosystem built for mobile scalability.

[![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?style=flat-square&logo=react)](https://reactnative.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![JWT Security](https://img.shields.io/badge/Auth-JWT_&_Bcrypt-red?style=flat-square&logo=json-web-tokens)](https://jwt.io)

goLean is a high-performance MERN mobile application designed to help users track running logs, monitor nutritional targets, capture progress photos, and receive persistent history notifications. The application is built using a decoupled architecture, separating a React Native frontend from a secured Node.js/Express MVC backend.

---

## Key Features

*   **Secure User Auth & Session Management:** Stateless login powered by **JSON Web Tokens (JWT)** and **bcrypt** password hashing, with global React Context API session management.
*   **Real-Time GPS Workout Tracker:** Native geolocation integration (`expo-location`) to track running routes, map coordinates, and calculate precise running distance, pace, and durations in real-time.
*   **Transformation Vault (Camera API & Uploads):** Capture and upload progress photos using `expo-image-picker`, sent to the Express server using `FormData` and processed using `multer` middleware.
*   **Persistent Notification Engine:** A database-backed notification log. Utilizes a custom global-local listener system in React Native that saves background notifications to MongoDB while updating the UI state using optimistic local badge increments.
*   **Meal & Calorie Log History:** Track daily meals and nutritional limits, with quick tab-switching and scrollable history logs connected directly to MongoDB.

---

## Tech Stack & Libraries

| Frontend (Mobile) | Backend (API) | Database |
| :--- | :--- | :--- |
| **React Native (Expo)** | **Node.js & Express** | **MongoDB** |
| React Navigation | JWT (jsonwebtoken) | Mongoose ODM |
| Expo Location | Multer (Multipart Form Data) | MongoDB Atlas |
| Expo Notifications | Bcryptjs | |
| Axios (API Requests) | Nodemon (Dev server) | |

---

## Project Architecture

```text
goLean/
├── mobile/                  # React Native (Expo) Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI Elements (Dashboard Header, Cards)
│   │   ├── context/         # AuthContext (Global Session State & Global Listeners)
│   │   ├── navigation/      # Navigation Stacks
│   │   ├── screens/         # Screen Views (Dashboard, History, Run Tracker, Photos)
│   │   ├── services/        # Axios API Service wrappers
│   │   └── utils/           # Helper scripts (OS Notification schedulers)
│
├── server/                  # Node.js Express Backend (MVC)
│   ├── src/
│   │   ├── config/          # Database & Environment Setup
│   │   ├── controllers/     # Request handlers & Query Logic
│   │   ├── middlewares/     # Authentication & Error handlers
│   │   ├── models/          # Mongoose Database Schemas
│   │   └── routes/          # Express API Endpoints
