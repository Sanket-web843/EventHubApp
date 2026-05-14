# Implement Role-Based Access Control (RBAC) & Organizer Dashboard

This plan outlines the steps to implement RBAC (Student, Organizer, Admin), update the database schemas, add authentication middleware, and build the Organizer Dashboard on the frontend. The approach is designed to extend current functionality without breaking existing features.

## User Review Required

> [!WARNING]
> **JWT Authentication & Existing API Calls**
> Implementing `verifyToken` requires adding JWT to the backend. The login and signup controllers will be updated to issue a JWT. Frontend API calls will need to include this token in the `Authorization` header. I will configure an Axios interceptor or update the relevant Axios calls to ensure the token is attached, so existing functionality continues to work.
> 
> **Event Schema `organizer_id` type**
> Currently, `organizer_id` in `Event` schema is a `Number`. To reference the User's `_id` properly, I will change this to `mongoose.Schema.Types.ObjectId` referencing the `User` model. If you have existing data where `organizer_id` is a Number, this might cause validation errors on those specific old documents. Let me know if you want to create a new field (e.g., `organizerRef`) instead to be 100% safe.

## Open Questions

> [!IMPORTANT]
> 1. Should I add an `axios` interceptor in the frontend to automatically attach the JWT token to all requests, or manually update the specific API calls? (Interceptor is recommended for cleaner code).
> 2. For the Registration/Participant tracking, what specific fields do you want to capture besides User ID, Event ID, and payment status (Paid/Free)?
> 3. Should the Admin role have a dedicated dashboard as well, or is the focus solely on the Organizer Dashboard for now?

## Proposed Changes

---

### Database Layer (MongoDB/Mongoose)

#### [MODIFY] [user.model.js](file:///c:/Users/HP/OneDrive/Desktop/CollegeEventManager/Backend/model/user.model.js)
- Update the `role` field's `enum` to include `"Admin"`.

#### [MODIFY] [event.model.js](file:///c:/Users/HP/OneDrive/Desktop/CollegeEventManager/Backend/model/event.model.js)
- Update `organizer_id` to be of type `mongoose.Schema.Types.ObjectId` with `ref: 'User'`.

#### [NEW] `registration.model.js` (Backend/model/)
- Create a new Mongoose schema to track participants.
- Fields: `eventId` (ObjectId, ref: Event), `userId` (ObjectId, ref: User), `paymentStatus` (String, enum: ['Paid', 'Free']).

---

### Backend Layer (Node.js/Express)

#### [NEW] `auth.middleware.js` (Backend/middleware/)
- Implement `verifyToken` middleware using `jsonwebtoken` to validate the user's token.
- Implement `checkRole([...roles])` middleware to restrict access based on user role.

#### [MODIFY] [user.controller.js](file:///c:/Users/HP/OneDrive/Desktop/CollegeEventManager/Backend/controller/user.controller.js)
- Update `login` and `signup` functions to sign and return a JWT token containing the user's `_id` and `role`.

#### [MODIFY] [event.controller.js](file:///c:/Users/HP/OneDrive/Desktop/CollegeEventManager/Backend/controller/event.controller.js)
- Add `getOrganizerEvents`: Fetch events filtered by `req.user._id`.
- Add `updateEvent` & `deleteEvent`: Allow organizers to edit/delete only their events.
- Add `getEventParticipants`: Fetch registrations for a specific event, separating 'Paid' and 'Free'.
- Add `manageParticipant`: Allow organizers to manually add/remove users from their event.

#### [MODIFY] [event.route.js](file:///c:/Users/HP/OneDrive/Desktop/CollegeEventManager/Backend/route/event.route.js)
- Add protected routes for the new organizer functions using the `verifyToken` and `checkRole` middlewares.

#### [NEW] `registration.route.js` & `registration.controller.js` (Backend/route/ & Backend/controller/)
- (Optional depending on structure) Handle student registration logic here.

---

### Frontend Layer (React)

#### [NEW] `ProtectedRoute.jsx` (Frontend/src/components/)
- Create a wrapper component that checks `localStorage` for the user's role and token, redirecting unauthorized users.

#### [NEW] `OrganizerDashboard.jsx` (Frontend/src/components/)
- Build a dedicated dashboard UI for Organizers.
- Include sections/tabs for "My Events" (CRUD operations) and "Participants".
- Include a toggle/tab to view "Paid" vs "Free" participants.

#### [MODIFY] [App.jsx](file:///c:/Users/HP/OneDrive/Desktop/CollegeEventManager/Frontend/src/App.jsx)
- Add routing for the new Organizer Dashboard, wrapped in the `ProtectedRoute`.

#### [MODIFY] [Login.jsx](file:///c:/Users/HP/OneDrive/Desktop/CollegeEventManager/Frontend/src/components/Login.jsx) & Signup.jsx
- Update localStorage logic to also store the JWT token returned by the backend.

## Verification Plan

### Automated Tests
- N/A for this phase (relies on manual verification).

### Manual Verification
1. **Authentication**: Sign up and log in as an Organizer; verify JWT is received and stored in localStorage.
2. **Access Control**: Attempt to access the Organizer Dashboard as a Student; verify redirection.
3. **Event Management**: As an Organizer, create a new event. Verify it appears in "My Events". Log in as a different Organizer and verify you cannot see the first Organizer's events.
4. **Participant Management**: Add participants to an event. View the participants list and toggle between "Paid" and "Free". Remove a participant and verify the list updates.
