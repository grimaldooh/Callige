import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/Navbar";  
import SideNavbar from "../components/SideNavbar";
import NavbarHandler from "../components/NavbarHandler";
import { AuthProvider } from './context/AuthContext';
import { ErrorProvider } from './context/ErrorContext';
import React from 'react';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Callige",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Agregamos el Navbar aquí para que esté disponible en todas las páginas */}
        <ErrorProvider>
        <AuthProvider>
          <div className="flex ">
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
        </ErrorProvider>
      </body>
    </html>
  );
}