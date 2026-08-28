# Phase 18: Doctor Backend Capability Audit & Implementation Blueprint

**Project:** Doctorly Healthcare Management System
**Date:** August 28, 2026

## 1. Executive Summary
This document provides a comprehensive backend-to-frontend capability audit of the `L2B6-Backend-PH-Healthcare-Management-System`, focusing strictly on the Doctor platform. By directly examining the backend repository's Prisma schemas, controllers, routes, and services, we have mapped out the exact API surface available. The frontend must strictly adhere to these capabilities for Phases 19-26. 

The backend is fully operational and capable of supporting a rich Doctor Dashboard, though specific strict Role-Based Access Control (RBAC) rules dictate how Doctors can access patient data and schedules.

---

## 2. Backend Architecture Relevant to Doctor
The Doctor entity interacts heavily with:
- **`Appointment`**: The core pivot table connecting Doctor, Patient, and Schedule.
- **`Schedule`** & **`DoctorSchedules`**: A two-tier scheduling system where global `schedules` (time blocks) are bound to Doctors via `DoctorSchedules`.
- **`Prescription`** & **`MedicalRecord`**: 1:1 relations strictly bound to `appointmentId` and `patientId`.
- **`Payment`**: Payment aggregation bound to `appointmentId`.

---

## 3. Doctor API Map

| Feature | Method | Route | Auth Role | Notes |
|---------|--------|-------|-----------|-------|
| **Doctor Profile** | `GET` | `/doctor/:id` | Public/Any | Fetch public doctor info. |
| **Update Profile** | `PATCH` | `/doctor/update-my-profile` | `DOCTOR` | Edit personal doctor profile. |
| **My Appointments**| `GET` | `/appointment/my-appointments` | `DOCTOR` | Fetches all appointments (includes Patient object). |
| **Change Appt Status**| `PATCH`| `/appointment/:id/status` | `DOCTOR` | Transitions (SCHEDULED -> INPROGRESS -> COMPLETED). |
| **Create Schedule**| `POST` | `/doctor-schedule/create-my-doctor-schedule` | `DOCTOR` | Payload requires `scheduleIds` (global time blocks). |
| **My Schedules** | `GET` | `/doctor-schedule/my-doctor-schedules` | `DOCTOR` | Fetches active doctor-schedule links. |
| **Delete Schedule**| `DELETE`| `/doctor-schedule/delete-my-doctor-schedule/:scheduleId`| `DOCTOR` | Fails if `isBooked` is true. |
| **Create Rx** | `POST` | `/prescription/` | `DOCTOR` | Create prescription linked to `appointmentId`. |
| **My Prescriptions**| `GET` | `/prescription/my-prescriptions` | `DOCTOR` | Fetch prescriptions written by this doctor. |
| **Create Record** | `POST` | `/medical-record/` | `DOCTOR` | Create medical record linked to `appointmentId`. |
| **My Payments** | `GET` | `/payment/my-payments` | `DOCTOR` | Earnings tied to completed appointments. |
| **Unread Notifs** | `GET` | `/notification/unread-count` | `DOCTOR` | Polling/Socket event target. |

---

## 4. Appointment Lifecycle
The backend explicitly enforces these `AppointmentStatus` transitions in `appointment.service.ts`:
1. **`SCHEDULED`** (Created by Patient via `/appointment/book-appointment`).
2. **`INPROGRESS`** (Doctor triggers this via `PATCH /appointment/:id/status`).
3. **`COMPLETED`** (Doctor triggers this after consultation).
4. **`CANCELED`** (Can be triggered by Patient or Doctor before completion).
*Note: A completed or canceled appointment is a terminal state and cannot be modified.*

---

## 5. Patient Access Rules
- **Direct Access**: `NOT AVAILABLE`. The route `GET /patient/:id` restricts access strictly to `[PATIENT, ADMIN, SUPER_ADMIN]`. A Doctor cannot fetch an arbitrary patient ID.
- **Derived Access**: `AVAILABLE`. A Doctor retrieves their patients by fetching `/appointment/my-appointments`. The backend dynamically includes the nested `patient` object in the appointment payload.

---

## 6. Prescription Workflow
- **Creation**: `POST /prescription/`. Requires `appointmentId`, `patientId`, `doctorId`, and an array of `medicines`.
- **Constraint**: It is a `1:1` relationship with `appointmentId`. Doctors can only write one prescription per appointment.
- **Visibility**: Both Patient and Doctor can query it via `/prescription/my-prescriptions`.

---

## 7. Medical Record Workflow
- **Creation**: `POST /medical-record/`. Requires `diagnosis`, `symptoms`, `appointmentId`, `patientId`, `doctorId`.
- **Constraint**: `1:1` relationship with `appointmentId`.
- **Visibility**: Patients can read their own. Doctors can read ones they created.

---

## 8. Schedule Workflow
- **Two-Tier System**: 
  - `Schedule` (Global time blocks, created by Admin).
  - `DoctorSchedules` (Junction table linking Doctor to `Schedule`).
- **Doctor Capability**: Doctors cannot create arbitrary time slots. They must `GET /schedule` to view global time blocks, and then `POST /doctor-schedule/create-my-doctor-schedule` passing an array of `scheduleIds` they wish to claim.

---

## 9. Payment/Earnings Workflow
- **Earnings Aggregation**: The backend `GET /payment/my-payments` returns individual transaction records.
- **Frontend Requirement**: The frontend must manually aggregate (SUM) the `amount` fields to display Total Earnings, as there is no `/doctor/statistics` endpoint natively providing total revenue.

---

## 10. Notification Workflow
- **Triggers**: `APPOINTMENT_BOOKED`, `APPOINTMENT_CANCELED`, etc.
- **Socket**: Events are broadcast via `notification:new`.
- **REST Fallback**: `GET /notification/` and `PATCH /notification/:id/read`.

---

## 11. Chat Workflow
- **Creation**: `POST /chat/conversations` (Checks if conversation exists between Doctor and Patient, creates if not).
- **Messaging**: `POST /chat/conversations/:id/messages` (Supports text and multer file attachments).

---

## 12. Video Consultation Workflow
- **Initiation**: `POST /call/` (Initiates WebRTC session).
- **Acceptance**: `PATCH /call/:id/accept`.
- **Constraint**: Tied strictly to `Appointment`. A Doctor should only initiate a call if the appointment status is `INPROGRESS`.

---

## 13. Existing Frontend Implementation
- **Implemented**: Sidebar, basic routing shells inside `src/app/(dashboardLayout)/doctor/`. Services are fully mapped in `src/services/`.
- **Missing**: The actual UI views for Doctor Dashboard, Schedule generation grids, Appointment data tables, and Prescription Forms are mostly empty layout shells.

---

## 14. Feature Matrix

| Feature             | Backend Support | Frontend Status | Required Work | Priority |
| ------------------- | --------------- | --------------- | ------------- | -------- |
| Doctor Dashboard    | AVAILABLE       | EMPTY SHELL     | Build UI/Aggregate Stats | High |
| Doctor Profile      | AVAILABLE       | PARTIAL         | Build Edit Form | Medium |
| Appointments        | AVAILABLE       | EMPTY SHELL     | Build Data Table | High |
| Appointment Details | AVAILABLE       | EMPTY SHELL     | Build Status Mutators| High |
| Patients            | DERIVED         | EMPTY SHELL     | Build Derived List | Low |
| Schedule            | AVAILABLE       | EMPTY SHELL     | Build Slot Picker | High |
| Prescription        | AVAILABLE       | EMPTY SHELL     | Build Form Array | High |
| Medical Records     | AVAILABLE       | EMPTY SHELL     | Build Form/View | Medium |
| Payments            | AVAILABLE       | EMPTY SHELL     | Build Table/Aggregate| Low |
| Notifications       | AVAILABLE       | FULL            | None          | None |
| Chat                | AVAILABLE       | FULL            | None          | None |
| Video Consultation  | AVAILABLE       | FULL            | None          | None |

---

## 15. Backend Gaps
**Gap 1: Missing Global Statistics Endpoint**
- *Why frontend needs it*: The Doctor Dashboard needs "Total Patients", "Total Earnings", "Total Appointments".
- *Existing closest endpoint*: `/appointment/my-appointments` and `/payment/my-payments`.
- *Workaround*: SAFE. The frontend must fetch all appointments and payments and mathematically aggregate the statistics in React.

**Gap 2: Missing Direct `/patient/:id` Access**
- *Why frontend needs it*: Doctor clicking on a Patient profile.
- *Workaround*: SAFE. The frontend must pass the nested `patient` object retrieved from the `/appointment/:id` payload into the view, rather than making a standalone network request.

---

## 16. Security/RBAC Findings
- Backend safely blocks Doctors from modifying other Doctors' schedules or viewing unrelated patient data.
- Frontend must respect these boundaries and avoid attempting unauthorized `GET /patient/:id` requests.

---

## 17. Recommended Implementation Order
1. **Phase 19** — Doctor Dashboard (Metrics Aggregation)
2. **Phase 20** — Doctor Appointment Management & Status Transitions
3. **Phase 21** — Doctor Patient View (Derived from Appointments)
4. **Phase 22** — Doctor Consultation Workspace (Integration of Chat/Video into Appointment Details)
5. **Phase 23** — Doctor Prescription & Medical Record Workflow (Forms)
6. **Phase 24** — Doctor Schedule Management (Grid UI mapping to Global Schedules)
7. **Phase 25** — Doctor Payments
8. **Phase 26** — Doctor UX Polish & Profile Edits

---

## 18. Files to Modify/Create
- `src/app/(dashboardLayout)/doctor/dashboard/page.tsx`
- `src/app/(dashboardLayout)/doctor/appointments/page.tsx`
- `src/app/(dashboardLayout)/doctor/appointments/[appointmentId]/page.tsx`
- `src/app/(dashboardLayout)/doctor/patients/page.tsx`
- `src/app/(dashboardLayout)/doctor/schedule/page.tsx`
- `src/app/(dashboardLayout)/doctor/prescriptions/new/page.tsx`
- `src/components/doctor/ScheduleGrid.tsx`
- `src/components/doctor/PrescriptionForm.tsx`

---

## 19. Risks
- **Schedule Management Complexity**: Doctors cannot create arbitrary timestamps (e.g., 10:12 AM). They must select from pre-generated Admin `schedules`. The UI must clearly reflect this "slot claiming" mechanism rather than a free-text date picker.

---

## 20. Final Recommendation
The backend exposes all necessary REST endpoints, WebRTC signaling events, and relational models required to complete the Doctor platform without any modifications to the Node.js API. The frontend can safely proceed using mathematical aggregations for dashboard statistics.

**READY FOR DOCTOR IMPLEMENTATION**
