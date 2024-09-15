import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import localFont from "next/font/local";
import "./globals.css";

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

export const metadata = {
  title: "Marketplace",
  description: "Student marketplace, Apartments, Goods, Skills",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
      <link rel="icon" type="image/png" href="/images/favicon.png" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="relative flex-grow w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
