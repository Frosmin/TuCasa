import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ToastProvider, ToastContainer } from "@/components/Toast";
import { AuthProvider } from "@/context/AuthContext";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tu Casa - Encuentra tu hogar ideal",
  description: "Encuentra tu hogar ideal con Tu Casa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${nunito.variable} antialiased`}
        style={{ fontFamily: "var(--font-nunito)" }}
      >
        <AuthProvider>
          <Header />
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
