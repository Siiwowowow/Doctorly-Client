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
import { Toaster } from "sonner";
import { getUserInfo } from "@/services/auth.services";
import HeaderWrapper from "@/components/shared/Layout/HeaderWrapper";
import localFont from "next/font/local";

const anekBangla = localFont({
  src: "../../public/Font/AnekBangla-VariableFont_wdth,wght.ttf",
  display: "swap",
  variable: "--font-anek-bangla-local",
  weight: "100 800",
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
        className={`flex min-h-screen flex-col antialiased bg-doctorly-bg text-doctorly-text ${anekBangla.className} ${anekBangla.variable}`}
      >
        <QueryProviders>
          <AuthProvider initialUser={user}>
            <SocketProvider>
              <NotificationProvider>
                <NextIntlClientProvider messages={messages}>
                  <TooltipProvider>
                    <HeaderWrapper>
                      <Navbar />
                    </HeaderWrapper>
                    <main className="flex-1 min-w-0 w-full">{children}</main>
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
