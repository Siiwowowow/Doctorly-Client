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

export enum DoctorApplicationStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    RESUBMISSION_REQUIRED = "RESUBMISSION_REQUIRED"
}

export enum DocumentVerificationStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED"
}

// ----------------------------------------------------------------------
// INTERFACES
// ----------------------------------------------------------------------

export interface User {
    id: string;
    email: string;
    role: Role;
    status: UserStatus;
    name?: string;
    image?: string | null;
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
    doctorSchedules?: DoctorSchedule[];
    reviews?: Review[];
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

export interface PatientHealthData {
    id?: string;
    gender?: Gender;
    dateOfBirth?: string;
    bloodGroup?: BloodGroup;
    hasAllergies?: boolean;
    hasDiabetes?: boolean;
    height?: string;
    weight?: string;
    smokingStatus?: boolean;
    dietaryPreferences?: string | null;
    pregnancyStatus?: boolean;
    mentalHealthHistory?: string | null;
    immunizationStatus?: string | null;
    hasPastSurgeries?: boolean;
    recentAnxiety?: boolean;
    recentDepression?: boolean;
    maritalStatus?: string | null;
    patientId?: string;
}

export interface Patient {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string | null;
    contactNumber?: string | null;
    address?: string | null;
    bloodGroup?: string | null;
    isDeleted: boolean;
    deletedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
    user?: User;
    patientHealthData?: PatientHealthData | null;
}

export interface Admin {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string | null;
    contactNumber?: string | null;
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
    data?: Record<string, any> | null;
    isDeleted?: boolean;
    readAt?: string | null;
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

export interface DoctorApplicationDocument {
    id: string;
    applicationId: string;
    documentType: string;
    documentName: string;
    fileUrl: string;
    verificationStatus: DocumentVerificationStatus;
    adminNote?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface DoctorApplication {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    bmdcRegistrationNumber?: string | null;
    registrationType?: string | null;
    qualifications?: string | null;
    experienceYears?: number | null;
    currentWorkplace?: string | null;
    designation?: string | null;
    consultationFee?: number | null;
    about?: string | null;
    specialtyId?: string | null;
    status: DoctorApplicationStatus;
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt: string;
    documents?: DoctorApplicationDocument[];
    specialty?: Specialty | null;
    user?: User | null;
}

export interface Review {
    id: string;
    rating: number;
    comment?: string | null;
    createdAt: string;
    updatedAt: string;
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    patient?: Patient;
    doctor?: Doctor;
}
