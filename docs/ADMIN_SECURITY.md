# Admin Route Security Implementation

This document outlines the comprehensive security implementation for protecting admin routes in your application.

## Overview

The admin protection system includes:
1. **Role-Based Access Control (RBAC)**
2. **Security Enhancements**
3. **Rate Limiting**
4. **Multi-layer Protection**

## Features

### 1. Role-Based Access Control (RBAC)

#### User Roles
- **`user`**: Default role, no admin access
- **`moderator`**: Can read and write in admin area
- **`admin`**: Full permissions including user management

#### Permission System
```typescript
// src/lib/permissions.ts
export const ROLE_PERMISSIONS = {
  user: { canRead: false, canWrite: false, canDelete: false, canManageUsers: false },
  moderator: { canRead: true, canWrite: true, canDelete: false, canManageUsers: false },
  admin: { canRead: true, canWrite: true, canDelete: true, canManageUsers: true }
}
```

### 2. Security Enhancements

#### HTTP Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

#### Rate Limiting
- **Window**: 15 minutes
- **Max Requests**: 100 per IP address
- **Storage**: In-memory Map (production should use Redis)

### 3. Multi-Layer Protection

#### Layer 1: Middleware (`middleware.ts`)
- Server-side protection before request reaches components
- Role verification from database
- Rate limiting enforcement
- Security headers injection

#### Layer 2: Admin Layout (`src/app/admin/layout.tsx`)
- Client-side session validation
- Role checking with fallback
- Loading states and error handling

#### Layer 3: Admin Pages
- Additional page-level protection
- User data fetching with authentication

## Implementation Details

### Database Schema
```sql
-- Added to users table
role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'))
```

### NextAuth Integration
```typescript
// JWT token includes role
token.role = user.role;

// Session includes role
session.user.role = token.role;
```

### Middleware Flow
1. **Rate Limit Check**: Block excessive requests
2. **Session Validation**: Ensure user is authenticated
3. **Role Verification**: Check admin/moderator role
4. **Security Headers**: Apply to all responses

## Setup Instructions

### 1. Database Migration
Run the migration to add the role column:
```bash
# Apply the migration
npm run db:migrate

# Or run the SQL manually
psql -d your_database < drizzle/0001_add_user_role.sql
```

### 2. Set Admin User
Update your database to set an admin user:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

### 3. Environment Variables
Ensure you have:
```env
AUTH_SECRET=your-secret-key
DATABASE_URL=your-database-url
```

## Usage Examples

### Checking Permissions
```typescript
import { hasPermission, canAccessAdmin } from '@/lib/permissions';

// Check specific permission
if (hasPermission(userRole, 'canDelete')) {
  // Allow deletion
}

// Check admin access
if (canAccessAdmin(userRole)) {
  // Allow admin area access
}
```

### Protecting API Routes
```typescript
// In API route
import { auth } from '@/lib/auth';
import { canAccessAdmin } from '@/lib/permissions';

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session || !canAccessAdmin(session.user.role)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Proceed with admin logic
}
```

## Security Considerations

### Production Recommendations

1. **Rate Limiting Storage**
   - Use Redis or similar for distributed rate limiting
   - Configure appropriate limits for your traffic

2. **Session Management**
   - Set appropriate session expiration
   - Implement session refresh tokens

3. **Database Security**
   - Use read replicas for user role checks
   - Implement database connection pooling

4. **Monitoring**
   - Log failed authentication attempts
   - Monitor rate limit violations
   - Set up alerts for suspicious activity

### Testing Security

```typescript
// Test cases to implement
describe('Admin Security', () => {
  test('unauthenticated users redirected to login')
  test('non-admin users redirected to unauthorized')
  test('rate limiting blocks excessive requests')
  test('security headers are present')
  test('role permissions work correctly')
})
```

## Troubleshooting

### Common Issues

1. **Role Not Found in Session**
   - Check database migration completed
   - Verify NextAuth callbacks include role
   - Ensure TypeScript types are updated

2. **Rate Limiting Too Strict**
   - Adjust `maxAttempts` in middleware
   - Consider different limits per user role

3. **Database Errors in Middleware**
   - Check database connection
   - Verify schema includes role column
   - Monitor database performance

### Debug Mode
Add debug logging:
```typescript
// In middleware
console.log('User ID:', session.user?.id);
console.log('User Role:', userRole);
console.log('Rate limit:', clientId, record?.count);
```

## Future Enhancements

1. **Feature Flags**: Granular permission system
2. **Audit Logging**: Track admin actions
3. **2FA Integration**: Two-factor authentication
4. **IP Whitelisting**: Restrict admin access by IP
5. **Session Analytics**: Monitor session patterns

## Support

For security issues or questions about this implementation:
1. Review the code comments
2. Check the database schema
3. Test with different user roles
4. Monitor application logs
