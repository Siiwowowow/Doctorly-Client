export interface ApiResponse<TData = unknown> {
    success: boolean;
    message: string;
    data: TData;
    meta?: PaginationMeta;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface ApiErrorResponse {
    success: boolean;
    message: string;
}

// ----------------------------------------------------------------------
// ENUMS
// ----------------------------------------------------------------------

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    DOCTOR = "DOCTOR",
    PATIENT = "PATIENT"
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
    DELETED = "DELETED"
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}

export enum BloodGroup {
    A_POSITIVE = "A_POSITIVE",
    A_NEGATIVE = "A_NEGATIVE",
    B_POSITIVE = "B_POSITIVE",
    B_NEGATIVE = "B_NEGATIVE",
    AB_POSITIVE = "AB_POSITIVE",
    AB_NEGATIVE = "AB_NEGATIVE",
    O_POSITIVE = "O_POSITIVE",
    O_NEGATIVE = "O_NEGATIVE"
}

export enum AppointmentStatus {
    SCHEDULED = "SCHEDULED",
    INPROGRESS = "INPROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED"
}

export enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID"
}

// ----------------------------------------------------------------------
// INTERFACES
// ----------------------------------------------------------------------

export interface User {
    id: string;
    email: string;
    role: Role;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}

export interface Doctor {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string | null;
    contactNumber?: string | null;
    address?: string | null;
    isDeleted: boolean;
    deletedAt?: string | null;
    
    registrationNumber: string;
    experience: number;
    gender: Gender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    averageRating: number;
    
    createdAt: string;
    updatedAt: string;
    
    userId: string;
    user?: User;
    specialties?: DoctorSpecialty[];
}

export interface Specialty {
    id: string;
    title: string;
    description?: string | null;
    icon?: string | null;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt?: string | null;
}

export interface DoctorSpecialty {
    id: string;
    doctorId: string;
    specialtyId: string;
    doctor?: Doctor;
    specialty?: Specialty;
}

export interface Patient {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string | null;
    contactNumber?: string | null;
    address?: string | null;
    isDeleted: boolean;
    deletedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
    user?: User;
}

export interface Appointment {
    id: string;
    videoCallingId: string;
    status: AppointmentStatus;
    paymentStatus: PaymentStatus;
    createdAt: string;
    updatedAt: string;
    
    patientId: string;
    patient?: Patient;
    
    doctorId: string;
    doctor?: Doctor;
    
    scheduleId: string;
    schedule?: Schedule;
}

export enum CallStatus {
    RINGING = "RINGING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    CANCELED = "CANCELED",
    MISSED = "MISSED",
    ENDED = "ENDED",
    BUSY = "BUSY"
}

export enum NotificationType {
    APPOINTMENT_BOOKED = "APPOINTMENT_BOOKED",
    APPOINTMENT_INPROGRESS = "APPOINTMENT_INPROGRESS",
    APPOINTMENT_COMPLETED = "APPOINTMENT_COMPLETED",
    APPOINTMENT_CANCELED = "APPOINTMENT_CANCELED",
    PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
    PAYMENT_REFUNDED = "PAYMENT_REFUNDED",
    MEDICAL_RECORD_CREATED = "MEDICAL_RECORD_CREATED",
    PRESCRIPTION_CREATED = "PRESCRIPTION_CREATED",
    PRESCRIPTION_UPDATED = "PRESCRIPTION_UPDATED",
    CHAT_MESSAGE = "CHAT_MESSAGE",
    CALL_INCOMING = "CALL_INCOMING",
    CALL_MISSED = "CALL_MISSED"
}

export interface Schedule {
    id: string;
    startDateTime: string;
    endDateTime: string;
    createdAt: string;
    updatedAt: string;
    doctorSchedules?: DoctorSchedule[];
}

export interface DoctorSchedule {
    doctorId: string;
    scheduleId: string;
    isBooked: boolean;
    appointmentId?: string | null;
    doctor?: Doctor;
    schedule?: Schedule;
    appointment?: Appointment | null;
}

export interface Prescription {
    id: string;
    instructions: string;
    createdAt: string;
    updatedAt: string;
    patientId: string;
    doctorId: string;
    appointmentId: string;
    patient?: Patient;
    doctor?: Doctor;
    appointment?: Appointment;
    medicines?: PrescriptionMedicine[];
}

export interface PrescriptionMedicine {
    id: string;
    prescriptionId: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string | null;
}

export interface MedicalRecord {
    id: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    patientId: string;
    doctorId: string;
    appointmentId: string;
    patient?: Patient;
    doctor?: Doctor;
    appointment?: Appointment;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    recipientId: string;
}

export interface Payment {
    id: string;
    amount: number;
    transactionId: string;
    status: PaymentStatus;
    paymentGatewayData?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
    appointmentId: string;
    appointment?: Appointment;
}