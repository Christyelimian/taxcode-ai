# Course Access Guide

## Who Can Access Courses?

### ✅ **All Users (Public Access)**
- **Browse Courses**: Anyone can visit `/academy` to browse available courses
- **View Course Details**: Anyone can view course information at `/academy/modules/[id]`
- **No Login Required**: For browsing and viewing course information

### ✅ **Authenticated Users (Any Role)**
- **Enroll in Courses**: Users with `user`, `moderator`, or `admin` roles can enroll
- **Access Learning Interface**: Can access `/academy/modules/[id]/learn` after enrollment
- **Track Progress**: Can view progress at `/dashboard/learning`
- **Earn XP**: Can complete lessons and earn XP

### 🔒 **Admin Only**
- **Manage Courses**: Only `admin` role can access `/dashboard/modules` to create/edit courses
- **Edit Lesson Content**: Only admins can add detailed lesson content
- **Publish Courses**: Only admins can publish courses

## How Users Access Courses

### 1. **From Header Navigation (Mega Menu)**
- Click on **"Learn"** in the header
- Select **"Academy"** from the dropdown
- Click **"Browse Courses"** → Goes to `/academy`

### 2. **From Dashboard Sidebar** (NEW!)
- **"My Learning"** → `/dashboard/learning` - View enrolled courses and progress
- **"Browse Courses"** → `/academy` - Browse all available courses

### 3. **Direct Links**
- **Academy Homepage**: `/academy` - Public page showing all courses
- **Course Catalog**: `/academy/courses` - Detailed course listings
- **My Learning Dashboard**: `/dashboard/learning` - User's learning progress

### 4. **From Course Detail Page**
- Visit `/academy/modules/[id]` (anyone can view)
- Click **"Start learning (free)"** button
- If not logged in → Redirects to login
- If logged in → Enrolls and redirects to learning interface

## User Flow

### For Non-Logged-In Users:
1. Browse courses at `/academy` ✅
2. View course details ✅
3. Click "Start learning" → Redirected to login
4. After login → Automatically enrolled → Can start learning

### For Logged-In Users:
1. Browse courses at `/academy` ✅
2. View course details ✅
3. Click "Start learning" → Enrolls immediately ✅
4. Redirected to `/academy/modules/[id]/learn` ✅
5. Can track progress at `/dashboard/learning` ✅

### For Admins:
1. All user permissions ✅
2. Plus: Access `/dashboard/modules` to manage courses ✅
3. Can create/edit/publish courses ✅
4. Can add detailed lesson content ✅

## Access Points Summary

| Page | Public | Authenticated | Admin Only |
|------|--------|---------------|------------|
| `/academy` | ✅ Browse | ✅ Browse | ✅ Browse |
| `/academy/modules/[id]` | ✅ View | ✅ View | ✅ View |
| `/academy/modules/[id]/learn` | ❌ | ✅ Learn | ✅ Learn |
| `/dashboard/learning` | ❌ | ✅ View Progress | ✅ View Progress |
| `/dashboard/modules` | ❌ | ❌ | ✅ Manage |

## Navigation Buttons

### Header (Site Header)
- **Mega Menu → Learn → Academy → Browse Courses** → `/academy`

### Dashboard Sidebar
- **My Learning** → `/dashboard/learning` (All authenticated users)
- **Browse Courses** → `/academy` (All authenticated users)
- **Training Modules** → `/dashboard/modules` (Admin only)

### Course Detail Page
- **"Start learning (free)"** → Enrolls and starts learning
- **"Continue Learning"** → If already enrolled
- **"Review Course"** → If completed

### Learning Dashboard
- **"Continue Learning"** → Goes to current lesson
- **"Browse All Courses"** → Goes to `/academy`

## Role-Based Access

### `user` Role (Default)
- ✅ Browse courses
- ✅ Enroll in courses
- ✅ Complete lessons
- ✅ Track progress
- ✅ Earn XP
- ❌ Cannot manage courses

### `moderator` Role
- ✅ All `user` permissions
- ✅ Can moderate community content
- ❌ Cannot manage courses

### `admin` Role
- ✅ All `user` permissions
- ✅ Can create/edit/publish courses
- ✅ Can add lesson content
- ✅ Can manage all course content

## Quick Access Guide

### To Browse Courses:
1. Click **"Learn"** in header → **"Academy"** → **"Browse Courses"**
   OR
2. Go to `/academy` directly
   OR
3. From dashboard sidebar → **"Browse Courses"**

### To Start Learning:
1. Browse courses at `/academy`
2. Click on a course
3. Click **"Start learning (free)"**
4. If not logged in → Login → Auto-enroll
5. Start learning!

### To View Progress:
1. From dashboard sidebar → **"My Learning"**
   OR
2. Go to `/dashboard/learning` directly

### To Manage Courses (Admin Only):
1. From dashboard sidebar → **"Training Modules"**
   OR
2. Go to `/dashboard/modules` directly

## Important Notes

1. **Enrollment is Free**: All courses are free to enroll
2. **Login Required**: Must be logged in to enroll and learn
3. **Progress Tracking**: Progress is saved automatically
4. **XP System**: Users earn XP for completing lessons
5. **Public Browsing**: Anyone can browse courses without login

