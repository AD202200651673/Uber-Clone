# Uber Clone Backend

## Register User

Creates a new user account and returns an authentication token.

### Endpoint

```http
POST /api/users/register
```

The server expects JSON in the request body:

```http
Content-Type: application/json
```

### Request Body

```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

### Required Data

| Field | Type | Requirements |
| --- | --- | --- |
| `fullName.firstName` | string | Required; at least 3 characters |
| `fullName.lastName` | string | Required; at least 3 characters |
| `email` | string | Required; must be a valid email address |
| `password` | string | Required; at least 6 characters |

The password is hashed before the user is stored. Do not send a pre-hashed password.

### Success Response

**Status: `201 Created`**

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user-id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  },
  "token": "jwt-token"
}
```

The password is hashed before storage. The current controller returns the newly created user document, so response sanitization should be added before exposing this endpoint in production.

### Validation Error

**Status: `400 Bad Request`**

Returned when one or more fields do not satisfy the validation rules.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "ab",
      "msg": "First name must be at least 3 characters long",
      "path": "fullName.firstName",
      "location": "body"
    }
  ]
}
```

### Status Codes

| Status code | Meaning |
| --- | --- |
| `201 Created` | User registered successfully |
| `400 Bad Request` | Request data failed validation |
| `500 Internal Server Error` | Unexpected database or server error |

## Register Captain

Creates a new captain account and returns an authentication token.

### Endpoint

```http
POST /api/captains/register
```

The server expects JSON in the request body:

```http
Content-Type: application/json
```

### Request Body

```json
{
  "fullName": {
    "firstName": "Ali",
    "lastName": "Khan"
  },
  "email": "ali.khan@example.com",
  "password": "secret123",
  "vehicle": {
    "color": "Black",
    "plate": "ABC-123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Required Data

| Field | Type | Requirements |
| --- | --- | --- |
| `fullName.firstName` | string | Required; at least 3 characters |
| `fullName.lastName` | string | Optional but validated if provided; at least 3 characters |
| `email` | string | Required; must be a valid email address |
| `password` | string | Required; at least 6 characters |
| `vehicle.color` | string | Required; at least 3 characters |
| `vehicle.plate` | string | Required; at least 3 characters |
| `vehicle.capacity` | number | Required; must be an integer greater than or equal to 1 |
| `vehicle.vehicleType` | string | Required; must be one of `car`, `bike`, or `van` |

The password is hashed before the captain is stored.

### Success Response

**Status: `201 Created`**

```json
{
  "token": "jwt-token",
  "captain": {
    "_id": "captain-id",
    "fullName": {
      "firstName": "Ali",
      "lastName": "Khan"
    },
    "email": "ali.khan@example.com",
    "socketId": null,
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "ABC-123",
      "capacity": 4,
      "vehicleType": "car",
      "location": {
        "latitude": null,
        "longitude": null
      }
    }
  }
}
```

### Validation Error

**Status: `400 Bad Request`**

Returned when any required field fails validation.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "ab",
      "msg": "First name must be at least 3 characters long",
      "path": "fullName.firstName",
      "location": "body"
    }
  ]
}
```

### Duplicate Captain

**Status: `400 Bad Request`**

Returned when a captain with the same email already exists.

```json
{
  "message": "captain already exist"
}
```

### Status Codes

| Status code | Meaning |
| --- | --- |
| `201 Created` | Captain registered successfully |
| `400 Bad Request` | Validation failed or captain already exists |
| `500 Internal Server Error` | Unexpected database or server error |

## Login User

Authenticates an existing user and returns a new authentication token.

### Endpoint

```http
POST /api/users/login
```

The server expects JSON in the request body:

```http
Content-Type: application/json
```

### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

### Required Data

| Field | Type | Requirements |
| --- | --- | --- |
| `email` | string | Required; must be a valid email address |
| `password` | string | Required; at least 6 characters |

### Success Response

**Status: `200 OK`**

```json
{
  "token": "jwt-token",
  "user": {
    "_id": "user-id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

The token expires after one hour. The current controller explicitly selects the password to verify it and returns the user document in the response, so response sanitization should be added before exposing this endpoint in production.

### Validation Error

**Status: `400 Bad Request`**

Returned when the email is invalid or the password is shorter than 6 characters.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Please provide a valid email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Invalid Credentials

**Status: `401 Unauthorized`**

Returned when the email does not exist or the password is incorrect.

```json
{
  "message": "Invalid email or password"
}
```

### Status Codes

| Status code | Meaning |
| --- | --- |
| `200 OK` | Login successful |
| `400 Bad Request` | Request data failed validation |
| `401 Unauthorized` | Invalid email or password |
| `500 Internal Server Error` | Unexpected database or server error |

## Get User Profile

Retrieves the authenticated user's profile information.

### Endpoint

```http
GET /api/users/profile
```

### Authentication

This route requires a valid JWT token. The middleware accepts either:

- a cookie named `token`
- an `Authorization` header in the format:

```http
Authorization: Bearer <jwt-token>
```

### Success Response

**Status: `200 OK`**

```json
{
  "user": {
    "_id": "user-id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

### Unauthorized Responses

**Status: `401 Unauthorized`**

Returned if the token is missing, invalid, expired, or has been blacklisted.

```json
{
  "message": "Unauthorized"
}
```

or

```json
{
  "message": "Invalid token"
}
```

or

```json
{
  "message": "Token is blacklisted"
}
```

### Status Codes

| Status code | Meaning |
| --- | --- |
| `200 OK` | Profile retrieved successfully |
| `401 Unauthorized` | Missing or invalid authentication |
| `500 Internal Server Error` | Unexpected server error |

## Logout User

Logs out the authenticated user by invalidating the current token.

### Endpoint

```http
POST /api/users/logout
```

### Authentication

This route also requires a valid JWT token in the same way as `/api/users/profile`.

### Success Response

**Status: `200 OK`**

```json
{
  "message": "User logged out successfully"
}
```

The server also clears the `token` cookie and stores the current token in the blacklist collection.

### Unauthorized Responses

**Status: `401 Unauthorized`**

Returned if the token is missing, invalid, expired, or already blacklisted.

```json
{
  "message": "Unauthorized"
}
```

or

```json
{
  "message": "Invalid token"
}
```

### Status Codes

| Status code | Meaning |
| --- | --- |
| `200 OK` | User logged out successfully |
| `401 Unauthorized` | Missing or invalid authentication |
| `500 Internal Server Error` | Unexpected server error |

## Login Captain

Authenticates an existing captain and returns a new authentication token.

### Endpoint

```http
POST /api/captains/login
```

The server expects JSON in the request body:

```http
Content-Type: application/json
```

### Request Body

```json
{
  "email": "ali.khan@example.com",
  "password": "secret123"
}
```

### Required Data

| Field | Type | Requirements |
| --- | --- | --- |
| `email` | string | Required; must be a valid email address |
| `password` | string | Required; at least 6 characters |

### Success Response

**Status: `200 OK`**

```json
{
  "token": "jwt-token",
  "captain": {
    "_id": "captain-id",
    "fullName": {
      "firstName": "Ali",
      "lastName": "Khan"
    },
    "email": "ali.khan@example.com",
    "socketId": null,
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "ABC-123",
      "capacity": 4,
      "vehicleType": "car",
      "location": {
        "latitude": null,
        "longitude": null
      }
    }
  }
}
```

The token expires after 24 hours, and the server also sets a `token` cookie on successful login.

### Validation Error

**Status: `400 Bad Request`**

Returned when the email is invalid or the password is shorter than 6 characters.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Invalid Credentials

**Status: `401 Unauthorized`**

Returned when the captain email does not exist or the password is incorrect.

```json
{
  "message": "invalid email or password"
}
```

### Status Codes

| Status code | Meaning |
| --- | --- |
| `200 OK` | Login successful |
| `400 Bad Request` | Request data failed validation |
| `401 Unauthorized` | Invalid email or password |
| `500 Internal Server Error` | Unexpected database or server error |

## Get Captain Profile

Retrieves the authenticated captain's profile information.

### Endpoint

```http
GET /api/captains/profile
```

### Authentication

This route requires a valid JWT token. The middleware accepts either:

- a cookie named `token`
- an `Authorization` header in the format:

```http
Authorization: Bearer <jwt-token>
```

### Success Response

**Status: `200 OK`**

```json
{
  "captain": {
    "_id": "captain-id",
    "fullName": {
      "firstName": "Ali",
      "lastName": "Khan"
    },
    "email": "ali.khan@example.com",
    "socketId": null,
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "ABC-123",
      "capacity": 4,
      "vehicleType": "car",
      "location": {
        "latitude": null,
        "longitude": null
      }
    }
  }
}
```

### Unauthorized Responses

**Status: `401 Unauthorized`**

Returned if the token is missing, invalid, expired, or already blacklisted.

```json
{
  "message": "Unauthorized"
}
```

or

```json
{
  "message": "Invalid token"
}
```

or

```json
{
  "message": "Token is blacklisted"
}
```

### Status Codes

| Status code | Meaning |
| --- | --- |
| `200 OK` | Profile retrieved successfully |
| `401 Unauthorized` | Missing or invalid authentication |
| `500 Internal Server Error` | Unexpected server error |

## Logout Captain

Logs out the authenticated captain by invalidating the current token.

### Endpoint

```http
GET /api/captains/logout
```

### Authentication

This route requires a valid JWT token in the same way as `/api/captains/profile`.

### Success Response

**Status: `200 OK`**

```json
{
  "message": "Captain logged out successfully"
}
```

The server clears the `token` cookie and stores the token in the blacklist collection.

### Unauthorized Responses

**Status: `401 Unauthorized`**

Returned if the token is missing, invalid, expired, or already blacklisted.

```json
{
  "message": "Unauthorized"
}
```

or

```json
{
  "message": "Invalid token"
}
```

### Status Codes

| Status code | Meaning |
| --- | --- |
| `200 OK` | Captain logged out successfully |
| `401 Unauthorized` | Missing or invalid authentication |
| `500 Internal Server Error` | Unexpected server error |

## Get Coordinates

Retrieves latitude and longitude coordinates for a given address using the geocoding service.

### Endpoint

```http
GET /api/maps/get-coordinates
```

### Authentication

Requires a valid user token in the `Authorization` header (`Bearer <token>`) or the `token` cookie.

### Query Parameters

| Parameter | Type | Requirements |
| --- | --- | --- |
| `address` | string | Required; at least 3 characters |

### Example Request

```http
GET /api/maps/get-coordinates?address=Sheryians%20Coding%20School%20Bhopal
```

### Success Response

**Status: `200 OK`**

```json
{
  "ltd": 23.259933,
  "lng": 77.412615
}
```

### Validation Error

**Status: `400 Bad Request`**

```json
{
  "errors": [
    {
      "type": "field",
      "value": "ab",
      "msg": "Address is required",
      "path": "address",
      "location": "query"
    }
  ]
}
```

### Not Found Error

**Status: `404 Not Found`**

```json
{
  "message": "Coordinates not found"
}
```

### Status Codes

| Status code | Meaning |
| --- | --- |
| `200 OK` | Coordinates retrieved successfully |
| `400 Bad Request` | Invalid query parameter (address missing or shorter than 3 characters) |
| `401 Unauthorized` | Missing or invalid authentication |
| `404 Not Found` | Coordinates could not be found for the given address |
| `500 Internal Server Error` | Unexpected server error |

## Get Distance and Time

Calculates driving distance and estimated travel duration between two addresses.

### Endpoint

```http
GET /api/maps/get-distance-time
```

### Authentication

Requires a valid user token in the `Authorization` header (`Bearer <token>`) or the `token` cookie.

### Query Parameters

| Parameter | Type | Requirements |
| --- | --- | --- |
| `origin` | string | Required; at least 3 characters |
| `destination` | string | Required; at least 3 characters |

### Example Request

```http
GET /api/maps/get-distance-time?origin=Bhopal%20Railway%20Station&destination=DB%20City%20Mall%20Bhopal
```

### Success Response

**Status: `200 OK`**

```json
{
  "distance": {
    "text": "7.2 km",
    "value": 7200
  },
  "duration": {
    "text": "18 mins",
    "value": 1080
  }
}
```

### Validation Error

**Status: `400 Bad Request`**

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Origin is required",
      "path": "origin",
      "location": "query"
    }
  ]
}
```

### Not Found Error

**Status: `404 Not Found`**

```json
{
  "message": "Distance time not found"
}
```

### Status Codes

| Status code | Meaning |
| --- | --- |
| `200 OK` | Distance and duration calculated successfully |
| `400 Bad Request` | Missing or invalid query parameters |
| `401 Unauthorized` | Missing or invalid authentication |
| `404 Not Found` | Route or distance could not be determined |
| `500 Internal Server Error` | Unexpected server error |

## Get Address Suggestions

Retrieves autocomplete location suggestions matching the search query.

### Endpoint

```http
GET /api/maps/get-suggestions
```

### Authentication

Requires a valid user token in the `Authorization` header (`Bearer <token>`) or the `token` cookie.

### Query Parameters

| Parameter | Type | Requirements |
| --- | --- | --- |
| `address` | string | Required; at least 3 characters |

### Example Request

```http
GET /api/maps/get-suggestions?address=Sheryians
```

### Success Response

**Status: `200 OK`**

```json
[
  {
    "name": "Sheryians Coding School, Indrapuri, Bhopal, Madhya Pradesh, India",
    "coordinates": [77.4612, 23.2435]
  },
  {
    "name": "Sheryians Coding School, MP Nagar, Bhopal, Madhya Pradesh, India",
    "coordinates": [77.4321, 23.2312]
  }
]
```

### Validation Error

**Status: `400 Bad Request`**

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Address is required",
      "path": "address",
      "location": "query"
    }
  ]
}
```

### Not Found Error

**Status: `404 Not Found`**

```json
{
  "message": "Suggestions not found"
}
```

### Status Codes

| Status code | Meaning |
| --- | --- |
| `200 OK` | Suggestions retrieved successfully |
| `400 Bad Request` | Query parameter invalid or too short |
| `401 Unauthorized` | Missing or invalid authentication |
| `404 Not Found` | No suggestions found |
| `500 Internal Server Error` | Unexpected server error |

## Create Ride

Creates a new ride request for an authenticated user, calculates the fare based on pickup and destination distance/duration, and generates a 4-digit verification OTP.

### Endpoint

```http
POST /api/rides/create
```

### Authentication

Requires a valid user token in the `Authorization` header (`Bearer <token>`) or the `token` cookie.

### Request Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "pickup": "Sheryians Coding School, Indrapuri, Bhopal",
  "destination": "DB City Mall, MP Nagar, Bhopal",
  "vehicleType": "car"
}
```

### Required Data

| Field | Type | Requirements |
| --- | --- | --- |
| `pickup` | string | Required; pickup location address |
| `destination` | string | Required; destination location address |
| `vehicleType` | string | Required; must be one of: `car`, `motorcycle`, `auto` |

### Success Response

**Status: `201 Created`**

```json
{
  "_id": "664fa1b2e5f3982a1c4b7890",
  "user": "664fa0a1e5f3982a1c4b7888",
  "pickup": "Sheryians Coding School, Indrapuri, Bhopal",
  "destination": "DB City Mall, MP Nagar, Bhopal",
  "fare": 185,
  "status": "pending",
  "createdAt": "2026-09-21T18:45:00.000Z",
  "updatedAt": "2026-09-21T18:45:00.000Z"
}
```

*(Note: The `otp` field is generated and stored in the database with `select: false` so it is not leaked in public responses).*

### Validation Error

**Status: `400 Bad Request`**

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid vehicle type",
      "path": "vehicleType",
      "location": "body"
    }
  ]
}
```

### Unauthorized Error

**Status: `401 Unauthorized`**

```json
{
  "message": "Unauthorized"
}
```

### Status Codes

| Status code | Meaning |
| --- | --- |
| `201 Created` | Ride created successfully |
| `400 Bad Request` | Missing or invalid request body fields |
| `401 Unauthorized` | Missing or invalid authentication token |
| `500 Internal Server Error` | Unexpected server or database error |

## Get Fare

Calculates the estimated fare for available vehicle types (`car`, `motorcycle`, `auto`) between pickup and destination addresses.

### Endpoint

```http
GET /api/rides/get-fare
```

### Authentication

Requires a valid user token in the `Authorization` header (`Bearer <token>`) or the `token` cookie.

### Query Parameters

| Parameter | Type | Requirements |
| --- | --- | --- |
| `pickup` | string | Required; pickup address |
| `destination` | string | Required; destination address |

### Example Request

```http
GET /api/rides/get-fare?pickup=Sheryians%20Coding%20School%20Bhopal&destination=DB%20City%20Mall%20Bhopal
```

### Success Response

**Status: `200 OK`**

```json
{
  "auto": 118,
  "car": 193,
  "motorcycle": 65
}
```

### Validation Error

**Status: `400 Bad Request`**

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Pickup location is required",
      "path": "pickup",
      "location": "query"
    }
  ]
}
```

### Unauthorized Error

**Status: `401 Unauthorized`**

```json
{
  "message": "Unauthorized"
}
```

### Status Codes

| Status code | Meaning |
| --- | --- |
| `200 OK` | Fare calculated successfully |
| `400 Bad Request` | Missing or invalid query parameters |
| `401 Unauthorized` | Missing or invalid authentication token |
| `500 Internal Server Error` | Unexpected server or routing error |


