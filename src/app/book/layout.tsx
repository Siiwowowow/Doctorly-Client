import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Consultation | Doctorly",
  description: "Schedule your consultation with top healthcare professionals.",
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
