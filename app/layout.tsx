import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Roboto,
  Rubik_Scribble,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"], style: ["normal", "italic"] });

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  style: ["normal", "italic"],
});

const rubik = Rubik_Scribble({
  subsets: ["latin"],
  variable: "--font-rubik",
  weight: "400",
  style: "normal",
});

const metallica = localFont({
  src: "./metallica.ttf",
  variable: "--font-metallica",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Karrot Market",
    default: "Karrot Market",
  },
  description: "Buy and sell everything around you!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${rubik.variable} ${metallica.variable} mx-auto max-w-screen-sm bg-neutral-900 text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
