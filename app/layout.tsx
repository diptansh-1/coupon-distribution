import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coupon Distribution System | Round-Robin with Abuse Prevention",
  description: "A system that distributes coupons to guest users in a round-robin manner with IP and cookie tracking to prevent abuse.",
  keywords: "coupons, promotion, discounts, round-robin, coupon distribution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
