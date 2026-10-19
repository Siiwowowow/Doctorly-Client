export interface PaymentInvoice {
  invoiceNumber: string;
  transactionId: string;
  paymentId: string;
  appointmentId: string;
  paymentStatus: string;
  amount: number;
  currency: string;
  paymentDate: string;
  patient: { id: string; name: string; email: string };
  doctor: { id: string; name: string; designation: string; hospital: string };
  schedule: { appointmentTime: string };
}
