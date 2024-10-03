import type { Metadata } from "next";
import localFont from "next/font/local";
import NavBar from "../components/NavBar";
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

export const metadata: Metadata = {
  title: "Deepnorth",
  description: "App Hub",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload the custom RichTheBarber font */}
        <link
          rel="preload"
          href="/fonts/RichTheBarber.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <title>Deepnorth</title>
        <meta name="description" content="App Hub" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}