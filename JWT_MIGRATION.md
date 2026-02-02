# JWT Migration: RS256 → HS256

## Changes Made

### 1. Updated JWT Configuration
- **Old**: RS256 (asymmetric) with private/public key pair
- **New**: HS256 (symmetric) with shared secrets

### 2. Environment Variables

#### Removed:
- `JWT_PRIVATE_KEY`
- `JWT_PUBLIC_KEY`

#### Added:
- `JWT_SECRET` - Secret for access tokens (required)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens (required)
- `JWT_EXPIRES_IN` - Access token expiration (default: 15m)
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration (default: 7d)

### 3. Updated Functions in `src/utils/jwt.ts`

#### Old Functions (removed):
```typescript
signJwt(payload)
verifyJwt(token)
```

#### New Functions:
```typescript
signAccessToken(payload)      // Generate access token
signRefreshToken(payload)     // Generate refresh token
verifyAccessToken(token)      // Verify access token
verifyRefreshToken(token)     // Verify refresh token
```

### 4. Files Removed
- `src/scripts/generate-jwt-keys.ts` - RSA key generation script
- `keys/` folder - Private/public key storage

### 5. Dependencies
No changes required! The `jsonwebtoken` package already supports both RS256 and HS256.

## Setup Instructions

### 1. Update your `.env` file:
```env
JWT_SECRET="your-secure-access-token-secret-here-min-32-chars"
JWT_REFRESH_SECRET="your-secure-refresh-token-secret-here-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

### 2. Generate secure secrets:
You can generate secure random secrets using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this twice to generate both `JWT_SECRET` and `JWT_REFRESH_SECRET`.

## Usage Example

### Generating Tokens:
```typescript
import { signAccessToken, signRefreshToken } from './utils/jwt.js';

const payload = {
  id: user.id,
  email: user.email,
  role: user.role
};

const accessToken = signAccessToken(payload);
const refreshToken = signRefreshToken(payload);

// Return both tokens to client
res.json({ accessToken, refreshToken });
```

### Verifying Tokens:
```typescript
import { verifyAccessToken, verifyRefreshToken } from './utils/jwt.js';

// In authentication middleware
try {
  const decoded = verifyAccessToken(token);
  // Token is valid, proceed
} catch (error) {
  // Token is invalid or expired
}

// In refresh token endpoint
try {
  const decoded = verifyRefreshToken(refreshToken);
  // Generate new access token
  const newAccessToken = signAccessToken({
    id: decoded.id,
    email: decoded.email,
    role: decoded.role
  });
} catch (error) {
  // Refresh token is invalid
}
```

## Security Notes

1. **Keep secrets secure**: Never commit `.env` files to version control
2. **Use strong secrets**: Minimum 32 characters, use crypto.randomBytes()
3. **Different secrets**: Use different secrets for access and refresh tokens
4. **Short-lived access tokens**: Keep access tokens short-lived (15m recommended)
5. **Longer refresh tokens**: Refresh tokens can be longer (7d recommended)

## Why HS256?

- **Simpler**: Single secret instead of key pair management
- **Faster**: Symmetric encryption is faster than asymmetric
- **Sufficient**: For most applications, HS256 provides adequate security
- **Easier deployment**: No key file management needed

Use RS256 only if you need to verify tokens without access to the signing key (e.g., distributed systems with multiple services).
