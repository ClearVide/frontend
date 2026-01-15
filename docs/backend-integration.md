# Frontend Integration & Testing Guide

Use this guide to connect your frontend to this Go backend.

## 1. Authentication Flow
- **Signup**: `POST /api/signup`
- **Get User Profile**: `GET /api/me`
  - Requires Auth (Clerk Token)
  - Returns:
  ```json
  {
    "isPro": false,
    "hasPurchasedTemplates": false
  }
  ```
- **Header**: For all other requests, include:
  `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`

## 2. GitHub OAuth Login
1. **Initiate**: Redirect the user to `GET http://localhost:8080/api/auth/github`.
2. **Handle Callback**: The backend will redirect back to your frontend and issue tokens (likely via query parameters).

## 3. AI Resume Builder
- **Analyze**: `POST /api/analyze` 
  - Requires Auth.
  - Returns gap analysis and suggestions based on the expert prompt.
- **Polish**: `POST /api/polish`
  - Requires Auth.
  - Used for iterative refinement of specific text blocks.

## 3. Payments (Stripe)
- **Get Checkout URL**: `POST /api/checkout`
  - Returns a Stripe URL. Redirect the user there.
- **Webhook**: The backend listens for Stripe events on `/api/webhook`.
  - To test locally, use the Stripe CLI:
    `stripe listen --forward-to localhost:8080/api/webhook`

## 4. Manual Testing with CURL
### Signup
```bash
curl -X POST http://localhost:8080/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123"}'
```
*(Copy the token from the response)*

### Analyze Resume
```bash
curl -X POST http://localhost:8080/api/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"personalDetails":{"jobTitle":"Go Developer"}}'
```
