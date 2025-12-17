# Login Page Implementation

This directory contains the implementation of the modern login page for Mealie.

## Features

### Dynamic Configuration
The login page fetches its configuration from `/api/app/about` and adjusts its behavior based on the response:

- **Demo Mode Banner**: Displays when `demoStatus` is `true`
- **Password Login Form**: Shows when `allowPasswordLogin` is `true`
- **OIDC/SSO Login**: Displays OIDC button when `enableOidc` is `true`
- **Auto-redirect**: Redirects to OIDC when both `enableOidc` and `oidcRedirect` are `true`
- **Sign-up Link**: Shows when `allowSignup` is `true`

### Form Fields
- **Username or Email**: Accepts both username and email formats (not just email)
- **Password**: Standard password input with toggle visibility
- **Remember Me**: Checkbox to persist login
- **Forgot Password**: Link to password recovery

### Design
- Orange accent color scheme (Mealie brand)
- Responsive card-based layout
- Light and dark mode support
- Loading and error states
- Accessible form controls

## Files

- `page.tsx` - Main login page component
- `/lib/api/config.ts` - API client for fetching app config
- `/lib/types/app-config.ts` - TypeScript types for config

## Testing

The login page can be tested at `http://localhost:3000/login` during development.

A mock API endpoint is provided at `/api/app/about` for testing without a backend.

## Production Notes

In production:
1. The `/api/app/about` route will be proxied to the backend (see `next.config.ts`)
2. The mock API endpoint (`/app/api/app/about/route.ts`) should be removed
3. Actual authentication logic needs to be implemented in the form submission handler
