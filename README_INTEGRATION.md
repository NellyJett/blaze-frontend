# Compliance Guard Frontend Integration Guide

## Environment Variables

Create a `.env` file in the `compliance-guard` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## React Hooks

The following hooks are available for integration:

### `useRegisterUser`
Register a new user with the backend.

```typescript
const { register, isLoading, error } = useRegisterUser();

await register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+2348000000000',
  password: 'password123',
  organisationName: 'Acme Corp',
  organisationType: 'fintech_lending',
  role: 'compliance_officer',
});
```

### `useVerifyOtp`
Verify OTP code sent to user's email.

```typescript
const { verify, isLoading, error } = useVerifyOtp();

await verify({
  email: 'john@example.com',
  otp: '123456',
});
```

### `useResendOtp`
Resend OTP code to user's email.

```typescript
const { resend, isLoading, error } = useResendOtp();

await resend('john@example.com');
```

### `useLogin`
Login user and get JWT token.

```typescript
const { login, isLoading, error } = useLogin();

await login({
  email: 'john@example.com',
  password: 'password123',
});
```

### `useUploadDocument`
Upload a compliance document.

```typescript
const { upload, isLoading, uploadProgress, error } = useUploadDocument();

const file = // File object from input
await upload(file, 'certificate_of_incorporation');
```

### `useDocuments`
Fetch and manage user documents.

```typescript
const { documents, isLoading, error, fetchDocuments, deleteDocument } = useDocuments();

// Documents are automatically fetched on mount
// To delete a document:
await deleteDocument(documentId);
```

## API Service

The API service is configured in `src/services/api.ts` and automatically:
- Adds JWT token to requests from localStorage
- Handles 401 errors by redirecting to login
- Provides TypeScript types for all API calls

## Integration Status

✅ User Registration - Integrated
✅ OTP Verification - Integrated
✅ OTP Resend - Integrated
✅ User Login - Integrated
✅ Document Upload - Integrated
✅ Document Management - Integrated

## Components Updated

- `Signup.tsx` - Uses `useRegisterUser` hook
- `VerifyOTP.tsx` - Uses `useVerifyOtp` and `useResendOtp` hooks
- `Login.tsx` - Uses `useLogin` hook
- `ComplianceDocuments.tsx` - Uses `useUploadDocument` and `useDocuments` hooks

