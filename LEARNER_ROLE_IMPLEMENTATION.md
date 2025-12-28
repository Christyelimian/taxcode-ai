# Learner Role Implementation

## Overview
A new `learner` role has been created to restrict course access. Only users with the `learner` role (or `admin`) can enroll in courses and access the learning interface.

## Key Changes

### 1. Role System Updates
- **Added `learner` to UserRole type**: `'admin' | 'user' | 'moderator' | 'learner'`
- **Updated role management**: Admins can now assign `learner` role via `/dashboard/team`
- **Default role remains `user`**: New users still get `user` role by default

### 2. Access Control

#### Protected Routes
- **`/dashboard/learning`** - Requires `learner` or `admin` role
- **`/academy/modules/[id]/learn`** - Requires `learner` or `admin` role

#### API Route Protection
All learning API routes now check for `learner` or `admin` role:
- `POST /api/learning/enroll` - Returns 403 if not learner/admin
- `GET /api/learning/progress` - Returns 403 if not learner/admin
- `POST /api/learning/progress` - Returns 403 if not learner/admin
- `POST /api/learning/lesson-complete` - Returns 403 if not learner/admin
- `GET /api/learning/my-courses` - Returns empty array with message if not learner/admin

### 3. User Experience

#### For `user` Role:
- ✅ Can browse courses at `/academy` (view only)
- ✅ Can view course details
- ❌ Cannot enroll in courses
- ❌ Cannot access learning interface
- ❌ Cannot access `/dashboard/learning`
- **Message**: "Please apply to become a learner to access courses"

#### For `learner` Role:
- ✅ All `user` permissions
- ✅ Can enroll in courses
- ✅ Can access learning interface
- ✅ Can track progress
- ✅ Can earn XP

#### For `admin` Role:
- ✅ All permissions including course management
- ✅ Can access all learning features

### 4. Getting Learner Role

**Process:**
1. User visits `/academy/onboard`
2. Selects "Join as a learner"
3. Fills out application form
4. Application saved to Firestore `onboardingApplications` collection
5. Admin reviews application
6. Admin approves via `/api/onboarding/approve`
7. `learner` role automatically assigned to user
8. User receives approval email
9. User can now access courses

### 5. Components Created

#### `LearnerProtectedLayout`
- Server component that checks for `learner` or `admin` role
- Redirects to `/academy/onboard` if role not found
- Used by learning pages

#### Layout Files
- `src/app/academy/modules/[id]/learn/layout.tsx` - Wraps learning interface
- `src/app/dashboard/learning/layout.tsx` - Wraps learning dashboard

### 6. Dashboard Sidebar Updates
- **"My Learning"** and **"Browse Courses"** only visible to `learner` and `admin` roles
- Regular `user` role won't see these menu items

### 7. Error Handling
- API routes return clear error messages: "Learner role required"
- Enrollment button redirects to onboarding if role check fails
- Learning pages redirect to onboarding with helpful message

## Role Comparison

| Feature | `user` | `learner` | `moderator` | `admin` |
|---------|--------|-----------|-------------|---------|
| Browse Courses | ✅ (view) | ✅ | ✅ (view) | ✅ |
| Enroll in Courses | ❌ | ✅ | ❌ | ✅ |
| Access Learning | ❌ | ✅ | ❌ | ✅ |
| Track Progress | ❌ | ✅ | ❌ | ✅ |
| Manage Courses | ❌ | ❌ | ❌ | ✅ |

## Migration Notes

### Existing Users
- Current users with `user` role will NOT have access to courses
- They need to apply via `/academy/onboard` to get `learner` role
- Admins can manually assign `learner` role via `/dashboard/team`

### Admin Approval Workflow
1. Admin receives email notification of learner application
2. Admin reviews application in Firestore
3. Admin calls `/api/onboarding/approve` with `applicationId` and `userId`
4. System automatically assigns `learner` role
5. User receives approval email

## Files Modified

- `src/lib/user-roles.ts` - Added `learner` to UserRole type
- `src/app/actions.ts` - Updated setUserRoleAction to accept `learner`
- `src/components/user-roles-management.tsx` - Added learner option
- `src/app/api/learning/**` - Added role checks to all routes
- `src/app/dashboard/layout.tsx` - Hide learning links for non-learners
- `ROLES_AND_ACCESS.md` - Updated documentation

## Files Created

- `src/components/learner-protected-layout.tsx` - Access control component
- `src/app/academy/modules/[id]/learn/layout.tsx` - Learning page layout
- `src/app/dashboard/learning/layout.tsx` - Learning dashboard layout
- `src/app/api/onboarding/approve/route.ts` - Approve applications API

## Testing Checklist

- [ ] User role cannot enroll in courses
- [ ] User role cannot access learning interface
- [ ] User role redirected to onboarding when trying to access courses
- [ ] Learner role can enroll and access courses
- [ ] Admin role can access all features
- [ ] Dashboard sidebar shows/hides learning links correctly
- [ ] Onboarding application approval assigns learner role
- [ ] API routes return proper 403 errors for non-learners



