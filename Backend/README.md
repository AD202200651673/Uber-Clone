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
