import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProviders from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Navbar from "@/components/shared/Navbar/Navbar";
import AnnouncementBar from "@/components/landing/AnnouncementBar";
import { Toaster } from "sonner";
import { getUserInfo } from "@/services/auth.services";
import HeaderWrapper from "@/components/shared/Layout/HeaderWrapper";
import { Hind_Siliguri, Outfit } from "next/font/google";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});
export const metadata: Metadata = {
  title: "Doctorly | Smart Healthcare Management Platform",
  description: "Book appointments, consult doctors, and manage health records all in one place.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserInfo();
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning translate="no">
      <body
        suppressHydrationWarning
        className={`flex flex-col min-h-screen antialiased bg-doctorly-bg text-doctorly-text ${hindSiliguri.variable} ${outfit.variable} ${
          locale === "bn" ? "font-hind" : "font-outfit"
        }`}
      >
        <QueryProviders>
          <AuthProvider initialUser={user}>
            <SocketProvider>
              <NotificationProvider>
                <NextIntlClientProvider messages={messages}>
                  <TooltipProvider>
                    <HeaderWrapper>
                      <AnnouncementBar />
                      <Navbar />
                    </HeaderWrapper>
                    <main className="flex-1 shrink-0">{children}</main>
                    <Toaster richColors position="top-right" />
                  </TooltipProvider>
                </NextIntlClientProvider>
              </NotificationProvider>
            </SocketProvider>
          </AuthProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
