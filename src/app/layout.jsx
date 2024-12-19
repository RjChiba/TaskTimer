import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Timer",
  description: "Just do it.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable}`} >
        {children}
      </body>
    </html>
  );
}
