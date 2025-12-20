# Roles and Access Control in TaxCode Platform

## Overview
The TaxCode platform uses role-based access control (RBAC) to manage user permissions across different features and pages.

## User Roles

### 1. **`user`** (Default Role)
**Default role assigned to all new users**

**Access:**
- ✅ Public dashboard pages
- ✅ AI Tax Assistant (`/dashboard/assistant`)
- ✅ Tax Calculator (`/dashboard/calculator`)
- ✅ Community Forum (`/community`)
  - Can ask questions
  - Can answer questions
  - Can vote on answers
  - Can accept answers (if question author)
- ✅ My Profile (`/dashboard/consultant`) - If they've claimed a consultant profile
- ✅ Lawyer Profile (`/dashboard/lawyer`) - If they've claimed a lawyer profile
- ✅ View public directories (`/directory`, `/lawyers`)
- ✅ View knowledge base articles (read-only)
- ✅ Browse courses (view only at `/academy`)

**Restrictions:**
- ❌ Cannot access admin-only pages
- ❌ Cannot edit/delete questions/answers they didn't create
- ❌ Cannot manage user roles
- ❌ Cannot manage training modules
- ❌ Cannot manage knowledge base content
- ❌ **Cannot enroll in courses or access learning interface**
- ❌ **Cannot access `/dashboard/learning`**
- ❌ **Cannot access `/academy/modules/[id]/learn`**

---

### 2. **`learner`** (NEW)
**Role for users who want to access training courses**

**How to Get This Role:**
- Apply via `/academy/onboard` as a learner
- Admin approves application and assigns `learner` role

**Access:**
- ✅ All `user` permissions, PLUS:
- ✅ **Academy & Learning:**
  - Enroll in courses
  - Access learning interface (`/academy/modules/[id]/learn`)
  - Track progress (`/dashboard/learning`)
  - Complete lessons and earn XP
  - View enrolled courses
- ✅ Browse courses at `/academy`

**Restrictions:**
- ❌ Cannot access admin-only pages
- ❌ Cannot edit/delete questions/answers they didn't create
- ❌ Cannot manage user roles
- ❌ Cannot manage training modules
- ❌ Cannot manage knowledge base content

---

### 3. **`moderator`**
**Content moderation and community management**

**Access:**
- ✅ All `user` permissions, PLUS:
- ✅ Can edit/delete any question or answer in community
- ✅ Can moderate community content
- ✅ Can manage flags/reports

**Restrictions:**
- ❌ Cannot access admin dashboard pages
- ❌ Cannot manage user roles
- ❌ Cannot manage training modules
- ❌ Cannot manage knowledge base CMS

**Note:** Currently, moderators have the same community permissions as admins but cannot access admin dashboard features.

---

### 4. **`admin`**
**Full platform access**

**Access:**
- ✅ All `user` permissions
- ✅ All `learner` permissions
- ✅ All `moderator` permissions
- ✅ **Admin Dashboard Pages:**
  - `/dashboard/team` - Faculty & User Roles Management
  - `/dashboard/modules` - Training Modules CMS
  - `/dashboard/modules/import` - AI Course Builder
  - `/dashboard/knowledge` - Knowledge Base CMS
  - `/dashboard/tools` - Interactive Tools Management
  - `/dashboard/directory` - Professional Directory Management
  - `/dashboard/lawyers` - Tax Lawyers Directory Management
- ✅ **User Role Management:**
  - Can change user roles (user ↔ moderator ↔ admin)
  - Can view all registered users
  - Can manage user permissions
- ✅ **Content Management:**
  - Create/edit/delete training modules
  - Create/edit/delete knowledge base articles
  - Manage faculty/team members
  - Manage professional directories

---

## Role Storage

### Firestore (Firebase)
- **Location:** `users/{uid}/role`
- **Default:** `'user'`
- **Types:** `'admin' | 'user' | 'moderator' | 'learner'`
- **Set by:** 
  - Admins via `/dashboard/team` → User Roles tab
  - Automatically assigned when learner application is approved via `/api/onboarding/approve`

### PostgreSQL (Community)
- **Location:** `User.role` field
- **Default:** `'user'`
- **Types:** `'user' | 'admin' | 'expert' | 'moderator'`
- **Note:** Community roles are separate from Firestore roles but should be synced

---

## Protected Pages

### Admin-Only Pages (using `AdminProtectedLayout`)
These pages require `admin` role:

1. **`/dashboard/team`** - Faculty & User Roles Management
   - Manage team members
   - Change user roles
   - View all users

2. **`/dashboard/modules`** - Training Modules CMS
   - Create/edit/delete training modules
   - Manage course content

3. **`/dashboard/modules/import`** - AI Course Builder
   - Import and build courses using AI

4. **`/dashboard/knowledge`** - Knowledge Base CMS
   - Create/edit/delete knowledge base articles
   - Manage article content

5. **`/dashboard/tools`** - Interactive Tools Management
   - Manage interactive tools

6. **`/dashboard/directory`** - Professional Directory Management
   - Manage consultant directory
   - Approve/reject profiles

7. **`/dashboard/lawyers`** - Tax Lawyers Directory Management
   - Manage lawyer directory
   - Approve/reject profiles

### Learner-Only Pages (using `LearnerProtectedLayout`)
These pages require `learner` or `admin` role:

1. **`/dashboard/learning`** - Learning dashboard (enrolled courses, progress)
2. **`/academy/modules/[id]/learn`** - Learning interface (course lessons)

### Authenticated Pages (using `ProtectedLayout`)
These pages require login (any role):

1. **`/dashboard`** - Main dashboard
2. **`/dashboard/assistant`** - AI Tax Assistant
3. **`/dashboard/calculator`** - Tax Calculator
4. **`/dashboard/consultant`** - Consultant Profile (if claimed)
5. **`/dashboard/lawyer`** - Lawyer Profile (if claimed)
6. **`/community/ask`** - Ask a question
7. **`/academy`** - Browse courses (public viewing, enrollment requires learner role)

---

## Community Permissions

### Question Permissions
- **Create:** Any authenticated user
- **Edit/Delete:** 
  - Author of the question
  - `admin` role
  - `moderator` role

### Answer Permissions
- **Create:** Any authenticated user
- **Edit/Delete:**
  - Author of the answer
  - `admin` role
  - `moderator` role
- **Accept as Best Answer:**
  - Only the question author

### Voting Permissions
- **Vote:** Any authenticated user (except on own content)

---

## Profile Types (Separate from Roles)

### Consultant Profile
- Users can claim a consultant profile from `/directories/claim`
- Access to `/dashboard/consultant` dashboard
- Can manage bookings, edit profile
- Independent of user role (any role can be a consultant)

### Lawyer Profile
- Users can claim a lawyer profile from `/lawyer/claim`
- Access to `/dashboard/lawyer` dashboard
- Can manage bookings, edit profile, view case outcomes
- Independent of user role (any role can be a lawyer)

---

## Role Management

### How to Change User Roles
1. Login as `admin`
2. Navigate to `/dashboard/team`
3. Click on "User Roles" tab
4. Find the user you want to modify
5. Select new role from dropdown
6. Changes take effect on user's next session

### Default Role Assignment
- New users are automatically assigned `user` role on first login
- Role is stored in Firestore `users` collection
- `learner` role is assigned when admin approves learner application
- Role can be changed by admins only

### Getting Learner Role
1. Visit `/academy/onboard`
2. Select "Join as a learner"
3. Fill out application form
4. Admin reviews and approves application
5. `learner` role is automatically assigned
6. User can now enroll in courses and access learning features

---

## Sidebar Menu Visibility

The dashboard sidebar shows/hides menu items based on role:

### All Users See:
- Dashboard
- AI Tax Assistant
- Tax Calculator
- Interactive Tools
- My Profile (Consultant)
- Community

### Learners & Admins See (in addition to above):
- My Learning (`/dashboard/learning`)
- Browse Courses (`/academy`)

### Admin Only Sees (in addition to above):
- Training Modules
- AI Course Builder
- Knowledge Base
- Faculty
- Directory (Admin)
- Tax Lawyers (Admin)

---

## Summary Table

| Feature | `user` | `learner` | `moderator` | `admin` |
|---------|--------|-----------|-------------|---------|
| **Dashboard Access** | ✅ | ✅ | ✅ | ✅ |
| **AI Assistant** | ✅ | ✅ | ✅ | ✅ |
| **Tax Calculator** | ✅ | ✅ | ✅ | ✅ |
| **Community Forum** | ✅ | ✅ | ✅ | ✅ |
| **Browse Courses** | ✅ (view only) | ✅ | ✅ (view only) | ✅ |
| **Enroll in Courses** | ❌ | ✅ | ❌ | ✅ |
| **Access Learning Interface** | ❌ | ✅ | ❌ | ✅ |
| **Track Progress** | ❌ | ✅ | ❌ | ✅ |
| **Edit Own Content** | ✅ | ✅ | ✅ | ✅ |
| **Edit Any Content** | ❌ | ❌ | ✅ | ✅ |
| **User Role Management** | ❌ | ❌ | ❌ | ✅ |
| **Training Modules CMS** | ❌ | ❌ | ❌ | ✅ |
| **Knowledge Base CMS** | ❌ | ❌ | ❌ | ✅ |
| **Directory Management** | ❌ | ❌ | ❌ | ✅ |
| **Faculty Management** | ❌ | ❌ | ❌ | ✅ |
| **Tools Management** | ❌ | ❌ | ❌ | ✅ |

---

## Notes

1. **Role Sync:** Community roles (PostgreSQL) and Firestore roles should be kept in sync, but they're currently separate systems.

2. **Profile Types:** Consultant and Lawyer profiles are separate from user roles. A user with any role can claim and manage a professional profile.

3. **Default Access:** All authenticated users can access the main dashboard, assistant, calculator, and community features regardless of role.

4. **Role Changes:** Only admins can change user roles. Role changes take effect on the user's next session/login.

