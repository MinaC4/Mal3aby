# Malaby API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

## Error Format

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Endpoints

### Health Check

#### GET `/health`

Check API status.

**Response:**
```json
{
  "success": true,
  "message": "Malaby API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

---

### Pitches

#### GET `/api/pitches`

Get all pitches with optional filters.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by name or description |
| `location` | string | Filter by location |
| `minPrice` | number | Minimum price per hour |
| `maxPrice` | number | Maximum price per hour |

**Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "...",
      "name": "ملعب النجوم",
      "description": "...",
      "images": ["url1", "url2"],
      "pricePerHour": 300,
      "location": "مدينة نصر، القاهرة",
      "amenities": ["عشب صناعي", "إضاءة"],
      "rating": 4.8,
      "isActive": true,
      "availability": [
        {
          "day": "Saturday",
          "slots": [
            { "time": "08:00 AM", "available": true }
          ]
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/pitches/:id`

Get a single pitch by ID.

**Response:**
```json
{
  "success": true,
  "data": { ...pitch object }
}
```

#### GET `/api/pitches/:id/slots?date=YYYY-MM-DD`

Get available time slots for a pitch on a specific date.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | string | Yes | Date in YYYY-MM-DD format |

**Response:**
```json
{
  "success": true,
  "data": ["08:00 AM", "09:00 AM", "10:00 AM"]
}
```

---

### Bookings

#### GET `/api/bookings`

Get all bookings (Admin only).

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (pending/confirmed/cancelled/completed) |
| `date` | string | Filter by date (YYYY-MM-DD) |
| `pitchId` | string | Filter by pitch ID |

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "pitch": { ...pitch object },
      "customerName": "محمد أحمد",
      "customerEmail": "mohamed@example.com",
      "customerPhone": "01234567890",
      "bookingDate": "2024-01-15T00:00:00.000Z",
      "timeSlot": "06:00 PM",
      "duration": 2,
      "totalPrice": 600,
      "paymentScreenshot": null,
      "paymentMethod": "vodafone_cash",
      "status": "pending",
      "notes": "",
      "createdAt": "2024-01-10T12:00:00.000Z",
      "updatedAt": "2024-01-10T12:00:00.000Z"
    }
  ]
}
```

#### POST `/api/bookings`

Create a new booking.

**Request Body:**
```json
{
  "pitchId": "...",
  "customerName": "محمد أحمد",
  "customerEmail": "mohamed@example.com",
  "customerPhone": "01234567890",
  "bookingDate": "2024-01-15",
  "timeSlot": "06:00 PM",
  "duration": 2,
  "paymentMethod": "vodafone_cash",
  "notes": "Optional notes"
}
```

**Validation Rules:**
- `pitchId`: Required
- `customerName`: Required, trimmed
- `customerEmail`: Required, valid email format
- `customerPhone`: Required, trimmed
- `bookingDate`: Required
- `timeSlot`: Required
- `duration`: Optional, default 1, max 4
- `paymentMethod`: Optional, default "vodafone_cash"

**Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": { ...booking object }
}
```

**Error (Duplicate Booking):**
```json
{
  "success": false,
  "message": "This time slot is already booked. Please select another time."
}
```

#### GET `/api/bookings/:id`

Get a single booking by ID.

**Response:**
```json
{
  "success": true,
  "data": { ...booking object with populated pitch }
}
```

#### PUT `/api/bookings/:id/status`

Update booking status.

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Allowed Status Values:**
- `pending` - قيد الانتظار
- `confirmed` - مؤكد
- `cancelled` - ملغي
- `completed` - مكتمل

#### PUT `/api/bookings/:id/payment`

Upload payment screenshot URL.

**Request Body:**
```json
{
  "paymentScreenshotUrl": "https://example.com/screenshot.jpg"
}
```

#### DELETE `/api/bookings/:id`

Delete a booking.

**Response:**
```json
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

---

### Notifications

#### GET `/api/notifications`

Get all notifications.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `read` | boolean | Filter by read status |
| `type` | string | Filter by type |

**Response:**
```json
{
  "success": true,
  "count": 15,
  "unreadCount": 3,
  "data": [
    {
      "_id": "...",
      "booking": { ...booking object },
      "title": "New Booking Received",
      "message": "...",
      "type": "new_booking",
      "read": false,
      "readAt": null,
      "createdAt": "2024-01-10T12:00:00.000Z"
    }
  ]
}
```

#### PUT `/api/notifications/:id/read`

Mark a notification as read.

#### PUT `/api/notifications/read-all`

Mark all notifications as read.

#### GET `/api/notifications/stats/unread`

Get unread notifications count.

**Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

#### DELETE `/api/notifications/:id`

Delete a notification.

---

## Data Models

### Pitch

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `name` | string | Pitch name |
| `description` | string | Detailed description |
| `images` | string[] | Array of image URLs |
| `pricePerHour` | number | Price per hour in EGP |
| `location` | string | Location address |
| `amenities` | string[] | List of amenities |
| `rating` | number | Rating (0-5) |
| `isActive` | boolean | Whether pitch is active |
| `availability` | DayAvailability[] | Weekly availability schedule |

### Booking

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `pitch` | ObjectId (ref: Pitch) | Reference to pitch |
| `customerName` | string | Customer full name |
| `customerEmail` | string | Customer email |
| `customerPhone` | string | Customer phone number |
| `bookingDate` | Date | Booking date |
| `timeSlot` | string | Selected time slot |
| `duration` | number | Duration in hours |
| `totalPrice` | number | Calculated total price |
| `paymentScreenshot` | string | Payment screenshot URL |
| `paymentMethod` | enum | Payment method |
| `status` | enum | Booking status |
| `notes` | string | Optional notes |

### Notification

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `booking` | ObjectId (ref: Booking) | Reference to booking |
| `title` | string | Notification title |
| `message` | string | Notification message |
| `type` | enum | Notification type |
| `read` | boolean | Read status |
| `readAt` | Date | When notification was read |

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 409 | Conflict (duplicate booking) |
| 500 | Server Error |

---

## WebSocket (Future Enhancement)

For real-time notifications, consider implementing WebSocket:

```javascript
// Connection
const ws = new WebSocket('ws://localhost:5000/ws');

// Listen for new bookings
ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  console.log('New notification:', notification);
};
```

---

**API Version:** 1.0.0
**Last Updated:** 2024
