# Cache and Session Management Guide

## 🔧 **System Overview**

This project implements a comprehensive cache and session management system with the following features:

### **Cache Management**
- **In-Memory Cache**: Fast access to frequently used data
- **Session-Aware Caching**: Different cache entries for different user sessions
- **Automatic Cleanup**: Expired cache entries are automatically removed
- **Statistics**: Monitor cache usage and performance

### **Session Management**
- **Server-Side Sessions**: Secure session storage with automatic expiration
- **Client-Side Sessions**: Local storage for client-side state management
- **Session Validation**: Automatic validation of session integrity
- **Cross-Platform Support**: Works on both client and server

## 📁 **Key Files**

### **Cache Management**
- `src/lib/cache.ts` - Enhanced cache manager with session awareness
- `src/lib/store.ts` - Zustand state management for client-side state

### **Session Management**
- `src/lib/session.ts` - Comprehensive session management system
- `src/lib/adminAuth.ts` - Admin authentication with session support
- `src/middleware.ts` - Route protection with session validation

### **Data Providers**
- `src/lib/providers.tsx` - React Query configuration for data fetching

## 🚀 **Usage Examples**

### **Cache Management**

```typescript
import { cacheManager, CACHE_KEYS } from '@/lib/cache';

// Store data in cache
cacheManager.set('user_profile_123', userData, 10 * 60 * 1000); // 10 minutes

// Store session-specific data
cacheManager.set('user_bookings', bookings, 5 * 60 * 1000, sessionId, 'client');

// Retrieve data from cache
const userData = cacheManager.get('user_profile_123');

// Retrieve session-specific data
const bookings = cacheManager.get('user_bookings', sessionId, 'client');

// Clear specific session cache
cacheManager.clear(sessionId, 'client');

// Get cache statistics
const stats = cacheManager.getStats();
console.log('Cache stats:', stats);
```

### **Session Management**

```typescript
import { SessionManager, clientSession } from '@/lib/session';

// Server-side session management
const sessionId = SessionManager.createSession(userId, 'admin', token);
const response = SessionManager.setSessionCookie(response, sessionId, 'admin');

// Validate session
const isValid = SessionManager.validateSession(request, 'admin');

// Client-side session management
clientSession.setSession('admin', { token, user: adminUser });
const session = clientSession.getSession('admin');
const hasSession = clientSession.hasValidSession('admin');

// Clear session
clientSession.clearSession('admin');
```

### **State Management**

```typescript
import { useAppStore } from '@/lib/store';

// In your component
const { bookings, addBooking, setLoading } = useAppStore();

// Add new booking
addBooking(newBooking);

// Show loading state
setLoading(true);

// Show toast notification
showToast('Booking created successfully!', 'success');
```

## 🔒 **Security Features**

### **Session Security**
- **HttpOnly Cookies**: Session cookies are httpOnly to prevent XSS attacks
- **Secure Cookies**: Cookies are secure in production
- **Session Expiration**: Automatic session cleanup
- **IP Validation**: Optional IP address validation for sessions
- **Token Rotation**: Support for token refresh mechanisms

### **Cache Security**
- **Session Isolation**: Cache entries are isolated by session
- **User Type Isolation**: Admin and client cache entries are separate
- **Automatic Cleanup**: Expired cache entries are automatically removed
- **Memory Management**: Prevents memory leaks through cleanup intervals

## 📊 **Performance Optimization**

### **Cache Strategy**
- **TTL (Time To Live)**: Configurable expiration times for different data types
- **Session-Specific Caching**: Reduces cache conflicts between users
- **Automatic Cleanup**: Prevents memory bloat
- **Statistics Monitoring**: Track cache hit rates and performance

### **Session Strategy**
- **In-Memory Storage**: Fast session access
- **Automatic Cleanup**: Expired sessions are automatically removed
- **Minimal Data**: Only essential data is stored in sessions
- **Efficient Validation**: Quick session validation checks

## 🛠 **Configuration**

### **Cache Configuration**
```typescript
// Cache TTL settings (in milliseconds)
const CACHE_TTL = {
  SERVICES: 30 * 60 * 1000,      // 30 minutes
  BOOKINGS: 5 * 60 * 1000,       // 5 minutes
  USER_PROFILE: 10 * 60 * 1000,  // 10 minutes
  DASHBOARD_STATS: 2 * 60 * 1000, // 2 minutes
};

// Cleanup intervals
const CLEANUP_INTERVALS = {
  CACHE: 5 * 60 * 1000,    // 5 minutes
  SESSIONS: 60 * 60 * 1000, // 1 hour
};
```

### **Session Configuration**
```typescript
const SESSION_CONFIG = {
  ADMIN_TOKEN_EXPIRY: 24 * 60 * 60 * 1000,    // 24 hours
  CLIENT_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  SESSION_CLEANUP_INTERVAL: 60 * 60 * 1000,   // 1 hour
};
```

## 🔍 **Monitoring and Debugging**

### **Cache Monitoring**
```typescript
// Get cache statistics
const stats = cacheManager.getStats();
console.log('Cache Statistics:', {
  totalEntries: stats.totalEntries,
  adminEntries: stats.adminEntries,
  clientEntries: stats.clientEntries,
  sessionSpecificEntries: stats.sessionSpecificEntries,
  expiredEntries: stats.expiredEntries,
});
```

### **Session Monitoring**
```typescript
// Check session validity
const isValid = SessionManager.validateSession(request, 'admin');

// Get session information
const sessionId = SessionManager.getSessionId(request, 'admin');
const session = SessionManager.getSession(sessionId);
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Cache Not Working**
   - Check if cache key is correct
   - Verify TTL settings
   - Check for session conflicts

2. **Session Expiring Too Quickly**
   - Verify session configuration
   - Check server time settings
   - Review cleanup intervals

3. **Memory Leaks**
   - Monitor cache statistics
   - Check cleanup intervals
   - Review session cleanup

### **Debug Commands**
```typescript
// Debug cache
console.log('Cache stats:', cacheManager.getStats());

// Debug session
console.log('Session valid:', SessionManager.validateSession(request, 'admin'));

// Clear all cache (for debugging)
cacheManager.clear();
```

## 📈 **Best Practices**

### **Cache Best Practices**
1. **Use Appropriate TTL**: Set TTL based on data freshness requirements
2. **Session-Specific Keys**: Use session IDs for user-specific data
3. **Monitor Memory Usage**: Regularly check cache statistics
4. **Clear on Logout**: Clear user-specific cache on logout

### **Session Best Practices**
1. **Secure Cookies**: Always use secure cookie settings in production
2. **Regular Cleanup**: Ensure cleanup intervals are appropriate
3. **Minimal Data**: Store only essential data in sessions
4. **Validation**: Always validate sessions before use

### **Performance Best Practices**
1. **Cache Frequently Used Data**: Cache data that's accessed often
2. **Use Session Isolation**: Prevent cache conflicts between users
3. **Monitor Cleanup**: Ensure cleanup doesn't impact performance
4. **Optimize TTL**: Balance freshness with performance

## 🎯 **Integration with React Query**

The cache system works seamlessly with React Query:

```typescript
// In your API hooks
const useBookings = (sessionId: string) => {
  return useQuery({
    queryKey: ['bookings', sessionId],
    queryFn: () => fetchBookings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
};

// Cache invalidation
const queryClient = useQueryClient();
queryClient.invalidateQueries(['bookings', sessionId]);
```

---

**🎉 Your cache and session management system is now properly configured and optimized for performance and security!** 