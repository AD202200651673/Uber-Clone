# 🚗 Uber Clone

A full-stack ride-hailing app inspired by Uber. Riders can search locations, compare fares, and book a ride, while captains (drivers) receive live ride requests, accept them, verify the rider with an OTP, and complete the trip. Ride updates are pushed to both sides in real time with Socket.IO, and maps are powered by Mapbox.

Built with **React 19 + Vite** on the frontend and **Node.js + Express 5 + MongoDB** on the backend.

---

## ✨ Features

### For Riders (Users)
- Sign up / log in with JWT authentication
- Search pickup and destination with live address autocomplete
- See estimated fares for **Car, Auto, and Motorcycle** before booking
- Request a ride and get a 4-digit **OTP** to share with the captain
- Real-time updates when a captain accepts, starts, or ends the ride
- Live map tracking of your current location

### For Captains (Drivers)
- Separate captain sign up / login with vehicle details (color, plate, capacity, type)
- Receive new ride requests instantly over WebSockets
- Accept a ride and start it by verifying the rider's OTP
- Finish the ride and view trip details
- Live location updates shared with the server

### General
- Role-based protected routes (user vs. captain)
- Access + refresh token flow with token blacklisting on logout
- Fare calculation based on base fare, distance, and duration
- Responsive, mobile-first UI with animated bottom sheets (GSAP)

---

## 🛠️ Tech Stack

### Frontend
| Category | Technologies |
| --- | --- |
| Framework | React 19, Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS 4, React Icons |
| Maps | Mapbox GL JS |
| Real-time | Socket.IO Client |
| Animation | GSAP |
| HTTP | Axios |

### Backend
| Category | Technologies |
| --- | --- |
| Runtime & Framework | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens, bcrypt, cookie-parser |
| Validation | express-validator |
| Real-time | Socket.IO |
| Maps & Routing | Mapbox Geocoding, Directions & Search APIs |

---

## 📁 Project Structure

```
Uber-Clone/
├── Backend/
│   ├── controllers/        # Request handlers (user, captain, ride, maps)
│   ├── services/           # Business logic (fare, OTP, Mapbox calls)
│   ├── models/             # Mongoose models (User, Captain, Ride, BlacklistToken)
│   ├── routes/             # API routes
│   ├── middlewares/        # Auth middleware
│   ├── db/                 # MongoDB connection
│   ├── socket.js           # Socket.IO setup
│   ├── app.js              # Express app
│   └── server.js           # Server entry point
│
└── Frontend/
    └── src/
        ├── pages/          # Start, Login/Signup, Home, Riding, Captain pages
        ├── components/     # Home, captain, auth, routing, LiveTracking, common
        ├── context/        # User, Captain & Socket contexts
        ├── api/            # Axios instance & endpoints
        ├── services/       # Auth service
        ├── hooks/          # useAuth
        ├── validators/     # Form validation
        └── utils/          # Storage helpers
```

---

## 🔄 How a Ride Works

1. **Rider** enters pickup & destination → the app fetches fares for each vehicle type
2. **Rider** confirms → a ride is created with status `pending` and a 4-digit OTP
3. Nearby **captains** receive the request (`new-ride` event)
4. A **captain** accepts → rider is notified (`ride-confirmed`)
5. Captain enters the rider's OTP to begin → status becomes `ongoing` (`ride-started`)
6. Captain finishes the trip → status becomes `completed` (`ride-ended`)

**Fare formula:** `base fare + (distance in km × per-km rate) + (duration in min × per-minute rate)`

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- A [Mapbox](https://www.mapbox.com/) access token

### 1. Clone the repository

```bash
git clone https://github.com/AD202200651673/Uber-Clone.git
cd Uber-Clone
```

### 2. Set up the backend

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/uber-clone
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
MAPBOX_PUBLIC_API=your_mapbox_access_token
```

Start the server:

```bash
npm run dev
```

The API runs at `http://localhost:3000`.

### 3. Set up the frontend

```bash
cd Frontend
npm install
```

Create a `.env` file in `Frontend/`:

```env
VITE_MAPBOX_TOKEN=your_mapbox_access_token
VITE_BASE_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. In development, Vite proxies `/api` requests to the backend.

---

## 📜 Available Scripts

### Backend (`/Backend`)
| Command | Description |
| --- | --- |
| `npm run dev` | Start the server with nodemon |
| `npm start` | Start the server with Node |

### Frontend (`/Frontend`)
| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## 🔌 API Overview

Protected routes need a JWT sent as `Authorization: Bearer <token>` or in the `token` cookie.

| Resource | Endpoints |
| --- | --- |
| **Users** | `POST /api/users/register` · `POST /api/users/login` · `GET /api/users/profile` · `POST /api/users/refresh-token` · `POST /api/users/logout` |
| **Captains** | `POST /api/captains/register` · `POST /api/captains/login` · `GET /api/captains/profile` · `POST /api/captains/refresh-token` · `POST /api/captains/logout` |
| **Maps** | `GET /api/maps/get-coordinates` · `GET /api/maps/get-distance-time` · `GET /api/maps/get-suggestions` |
| **Rides** | `POST /api/rides/create` · `GET /api/rides/get-fare` · `POST /api/rides/confirm-ride` · `GET /api/rides/start-ride` · `POST /api/rides/end-ride` |

### Example: Register a user

```http
POST /api/users/register
Content-Type: application/json

{
  "fullName": { "firstName": "John", "lastName": "Doe" },
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

### Example: Get fares

```http
GET /api/rides/get-fare?pickup=Bhopal Railway Station&destination=DB City Mall Bhopal
```

```json
{ "auto": 118, "car": 193, "motorcycle": 65 }
```

---

## 📡 Socket Events

| Event | Direction | Description |
| --- | --- | --- |
| `join` | Client → Server | Registers the user/captain's socket ID |
| `update-location-captain` | Client → Server | Captain sends live location |
| `new-ride` | Server → Captain | New ride request |
| `ride-confirmed` | Server → User | Captain accepted the ride |
| `ride-started` | Server → User | Ride started after OTP verification |
| `ride-ended` | Server → User | Ride completed |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author
 
**Mayur**
 
- GitHub: (https://github.com/AD202200651673)