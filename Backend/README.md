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
