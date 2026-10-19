import { PaymentInvoice } from "@/types/invoice.types";
import styles from "./InvoiceDocument.module.css";

const cx = (...names: string[]) => names.map(name => styles[name]).join(" ");

export function InvoiceDocument({ invoice }: { invoice: PaymentInvoice }) {
  const amount = `${invoice.currency} ${invoice.amount.toFixed(2)}`;
  const doctor = /^dr\.?\s/i.test(invoice.doctor.name) ? invoice.doctor.name : `Dr. ${invoice.doctor.name}`;
  return (
    <article className={styles.sheet}>
      <header className={styles["brand-row"]}>
        <div className={styles.brand}>
          <div className={styles.mark}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M3 16h6l4-9 5 18 4-12 3 3h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div><div className={styles.wordmark}>Doctorly</div><div className={styles.healthcare}>HEALTHCARE</div></div>
        </div>
        <div className={styles.billing}><div className={styles.eyebrow}>Patient billing</div>Consultation payment receipt</div>
      </header>
      <div className={styles["title-row"]}>
        <div><div className={styles.eyebrow}>Care, clearly documented</div><h1>Consultation invoice</h1></div>
        <span className={styles.paid}>{invoice.paymentStatus}</span>
      </div>
      <div className={styles.meta}>
        <div><div className={styles.eyebrow}>Invoice number</div><div className={cx("value", "reference")}>{invoice.invoiceNumber}</div></div>
        <div><div className={styles.eyebrow}>Payment date</div><div className={styles.value}>{invoice.paymentDate}</div></div>
      </div>
      <div className={styles.parties}>
        <section className={styles.party}><h2 className={styles.eyebrow}>Billed to / patient</h2><div className={styles.name}>{invoice.patient.name}</div><div className={styles.detail}>{invoice.patient.email}</div></section>
        <section className={styles.party}><h2 className={styles.eyebrow}>Consultation provider</h2><div className={styles.name}>{doctor}</div><div className={cx("detail", "designation")}>{invoice.doctor.designation}</div><div className={styles.detail}>{invoice.doctor.hospital}</div></section>
      </div>
      <table aria-label="Consultation charges">
        <thead><tr><th scope="col">Consultation details</th><th scope="col" className={styles.number}>Qty</th><th scope="col" className={styles.number}>Unit price</th><th scope="col" className={styles.number}>Amount</th></tr></thead>
        <tbody><tr><td><strong>Online medical consultation</strong><div className={styles.schedule}>{invoice.schedule.appointmentTime}</div></td><td className={styles.number}>1</td><td className={styles.number}>{invoice.amount.toFixed(2)}</td><td className={styles.number}><strong>{invoice.amount.toFixed(2)}</strong></td></tr></tbody>
      </table>
      <div className={styles.appointment}>Appointment reference: {invoice.appointmentId}</div>
      <div className={styles.summary}>
        <div><div className={styles.eyebrow}>Payment received</div><div className={styles.thanks}>Thank you for choosing Doctorly.</div><div className={styles.detail}>Keep this receipt with your healthcare records.</div></div>
        <div><div className={styles.subtotal}><span>Subtotal</span><strong>{amount}</strong></div><div className={styles.total}><div className={styles.eyebrow}>Total paid</div><div className={styles.amount}>{amount}</div></div></div>
      </div>
      <div className={styles.transaction}>
        <div><div className={styles.eyebrow}>Transaction reference</div><div className={cx("value", "reference")}>{invoice.transactionId}</div></div>
        <div><div className={styles.eyebrow}>Currency</div><div className={styles.value}><strong>{invoice.currency}</strong></div></div>
      </div>
      <footer><span>Doctorly Healthcare | Consultation payment receipt</span><span>Computer-generated receipt</span></footer>
    </article>
  );
}
