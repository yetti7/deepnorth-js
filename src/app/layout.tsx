import type { Metadata } from "next";
import localFont from "next/font/local";
import NavBar from "../components/NavBar"; // Import the NavBar component
import "./globals.css";

// Define custom local fonts
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

// Metadata for SEO
export const metadata: Metadata = {
  title: "Deepnorth",
  description: "App Hub",
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
        <NavBar />  {/* Add the NavBar component here */}
        {children}  {/* This will render the content of each page */}
      </body>
    </html>
  );
}