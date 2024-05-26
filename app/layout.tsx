import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "./globals.css";
import Link from "next/link";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <Link className={styles.btn} href="/Setup">Setup Pokemon</Link>
          <Link className={styles.btn} href="/">Battle</Link>
          <Link className={styles.btn} href="/Scuffed">Scuffed Battle</Link>
          <Link className={styles.btn} href="/Import">Import</Link>
        </div>
        {children}
      </body>
    </html>
  );
}
