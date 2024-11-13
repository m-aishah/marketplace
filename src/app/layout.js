import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "./AuthContext";
import { ToastContainer } from "react-toastify";
import Head from "next/head"; // Import the Head component
import "react-toastify/dist/ReactToastify.css";
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
  title: "FindAll",
  description: "Student marketplace, Apartments, Products, Services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>FindAll</title>
        <meta
          name="description"
          content="Student marketplace, Apartments, Products, Services"
        />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <main className="relative flex-grow w-full">{children}</main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </AuthProvider>
      </body>
    </html>
  );
}
