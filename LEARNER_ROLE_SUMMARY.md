# Learner Role - Quick Summary

## What Changed

### ✅ New Role: `learner`
- Created to restrict course access
- Only `learner` and `admin` roles can access training/courses
- Regular `user` role CANNOT access courses

## Access Control

### Who Can Access Courses?

| Role | Browse Courses | Enroll | Learn | Track Progress |
|------|---------------|--------|-------|----------------|
| `user` | ✅ (view only) | ❌ | ❌ | ❌ |
| `learner` | ✅ | ✅ | ✅ | ✅ |
| `moderator` | ✅ (view only) | ❌ | ❌ | ❌ |
| `admin` | ✅ | ✅ | ✅ | ✅ |

## How Users Get Learner Role

1. **Apply**: Visit `/academy/onboard` → Select "Join as a learner" → Fill form
2. **Admin Reviews**: Admin receives email notification
3. **Admin Approves**: Admin approves application (manual process for now)
4. **Role Assigned**: System automatically assigns `learner` role
5. **Access Granted**: User can now enroll and learn

## Protected Pages

- `/dashboard/learning` - Requires `learner` or `admin`
- `/academy/modules/[id]/learn` - Requires `learner` or `admin`

## What Happens When User Role Tries to Access Courses?

1. **Enrollment**: Gets 403 error → Redirected to `/academy/onboard`
2. **Learning Interface**: Redirected to `/academy/onboard` with message
3. **Dashboard**: Learning links hidden from sidebar
4. **API Calls**: Returns 403 with "Learner role required" message

## Admin Actions

- **Assign Learner Role**: Go to `/dashboard/team` → User Roles tab → Select "learner"
- **Approve Applications**: Review applications in Firestore → Call `/api/onboarding/approve`

## Important Notes

- **Default Role**: New users still get `user` role (not `learner`)
- **Application Required**: Users must apply to become learners
- **Admin Approval**: Applications require admin approval
- **Browse Only**: `user` role can still browse courses but cannot enroll

