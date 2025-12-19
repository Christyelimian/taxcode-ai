# Onboarding System for Academy

## Overview
A comprehensive onboarding system that allows users to apply as either **Community Educators** or **Learners** to join the TaxCode Academy.

## Features

### 1. Onboarding Page (`/academy/onboard`)
- **Selection Screen**: Users choose between "Community Educator" or "Learner"
- **Dynamic Forms**: Different forms based on selection
- **Pre-filled Data**: Auto-fills name and email if user is logged in
- **Validation**: Required field validation
- **Email Notifications**: Sends confirmation and admin notifications

### 2. Application Types

#### Community Educator Application
**Required Fields:**
- Full Name
- Email
- Phone Number
- State
- Professional Background
- Teaching/Education Experience
- Motivation (why become educator)
- Availability (full-time, part-time, weekends, evenings, flexible)
- Preferred Teaching Mode (online, in-person, hybrid, content-creation)

**Optional Fields:**
- LGA (Local Government Area)

#### Learner Application
**Required Fields:**
- Full Name
- Email
- Phone Number
- State
- Learning Goals
- Areas of Interest

**Optional Fields:**
- LGA
- Preferred Learning Mode (self-paced, guided, group, mixed)

### 3. API Route

#### `POST /api/onboarding/submit`
- Validates application data
- Saves to Firestore `onboardingApplications` collection
- Sends email notifications:
  - To admins (application details)
  - To applicant (confirmation)
- Returns success/error response

## Access Points

### From Course Detail Page
- **"Join as a community educator"** button → `/academy/onboard`
- **"Join as a learner"** button → `/academy/onboard`

### From Academy Homepage
- **"Join Academy"** button in hero section → `/academy/onboard`
- **"Join the Academy"** button in Tax Champions section → `/academy/onboard`

### Direct Access
- Visit `/academy/onboard` directly

## User Flow

1. **User clicks onboarding button** (from course page or academy homepage)
2. **Selection Screen**: Choose "Community Educator" or "Learner"
3. **Form Screen**: Fill out application form
4. **Submit**: Application is saved and emails are sent
5. **Confirmation**: Success message and redirect to academy

## Data Storage

### Firestore Collection: `onboardingApplications`
```typescript
{
  type: "educator" | "learner",
  name: string,
  email: string,
  phone: string,
  state: string,
  lga?: string,
  userId?: string, // If logged in
  status: "pending" | "reviewed" | "approved" | "rejected",
  createdAt: Date,
  updatedAt: Date,
  
  // Educator-specific
  background?: string,
  experience?: string,
  motivation?: string,
  availability?: string,
  preferredMode?: string,
  
  // Learner-specific
  goals?: string,
  interests?: string,
  preferredMode?: string,
}
```

## Email Notifications

### Admin Notification
- **To**: Admin emails (from env or default)
- **Subject**: "New [Type] Application: [Name]"
- **Content**: All application details

### Applicant Confirmation
- **To**: Applicant email
- **Subject**: "Thank you for your [Type] application"
- **Content**: Confirmation and next steps

## Status Workflow

1. **pending** - Initial status when submitted
2. **reviewed** - Admin has reviewed (manual update)
3. **approved** - Application approved (manual update)
4. **rejected** - Application rejected (manual update)

## Future Enhancements

- Admin dashboard to review applications
- Status update notifications
- Bulk approval/rejection
- Application tracking for users
- Integration with user roles (auto-promote approved educators)

## Files Created

- `src/app/academy/onboard/page.tsx` - Onboarding form page
- `src/app/api/onboarding/submit/route.ts` - API route for submissions

## Files Modified

- `src/app/academy/modules/[id]/page.tsx` - Added onboarding buttons
- `src/app/academy/page.tsx` - Updated "Join Academy" button
